from datetime import datetime
from fastapi import Depends, HTTPException, UploadFile, File, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import FileResponse, JSONResponse
from app.schemas.user import LoginRequest, RegisterRequest, ResetPasswordRequest
from app.services.auth import (
    create_access_token,
    get_current_user,
    hash_password,
    verify_password,
)
from app.serializers.user_serializer import serialize_user
from app.utils.excel_export import generate_bulk_excel
from app.utils.bulk_upload import read_bulk_file
from app.schemas.request import InfantHealthInput, HealthPredictionResponse
from app.services.inference import predict_health, predict_health_bulk
from pathlib import Path
from app.db.mongo_db import users_collection, records_collection


app = FastAPI(
    title="Neonatal Early Warning System",
    description="AI-based risk prediction for neonatal health conditions",
    version="1.0.0",
)

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health_check():
    return {"status": "API running"}


@app.post("/auth/register")
async def register(data: RegisterRequest):
    existing_user = users_collection.find_one({"email": data.email})

    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_password = hash_password(data.password)

    users_collection.insert_one(
        {
            "name": data.name,
            "email": data.email,
            "password": hashed_password,
            "created_at": datetime.utcnow(),
        }
    )

    user = users_collection.find_one({"email": data.email})

    token = create_access_token({"sub": user["email"]})

    return {
        "access_token": token,
        "token_type": "bearer",
        "message": "User registered successfully",
        "user": serialize_user(user),
    }


@app.post("/auth/login")
async def login(data: LoginRequest):
    user = users_collection.find_one({"email": data.email})

    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": user["email"]})

    return {
        "access_token": token,
        "token_type": "bearer",
        "message": "User login successfully",
        "user": serialize_user(user),
    }


@app.post("/auth/reset-password")
async def reset_password_public(data: ResetPasswordRequest):
    user = users_collection.find_one({"email": data.email})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Verify old password instead of token/OTP/session
    if not verify_password(data.old_password, user["password"]):
        raise HTTPException(status_code=400, detail="Incorrect old password")

    users_collection.update_one(
        {"email": data.email}, {"$set": {"password": hash_password(data.new_password)}}
    )

    return {"message": "Password updated successfully"}


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    invalid_fields = []

    for err in exc.errors():
        field_name = err["loc"][-1]
        invalid_fields.append(field_name)

    # remove duplicates
    invalid_fields = list(set(invalid_fields))

    return JSONResponse(
        status_code=422,
        content={
            "values": invalid_fields,
            "message": "Please provide valid input values.",
        },
    )


@app.post("/predict", response_model=HealthPredictionResponse)
def predict(input_data: InfantHealthInput, user: str = Depends(get_current_user)):
    return predict_health(input_data.dict(), user)


@app.post("/predict/bulk")
async def predict_bulk(
    file: UploadFile = File(...), user: str = Depends(get_current_user)
):
    df = read_bulk_file(file)

    # Extract names
    names = (
        df["name"].tolist()
        if "name" in df.columns
        else [f"Infant {i+1}" for i in range(len(df))]
    )

    if "name" in df.columns:
        df = df.drop(columns=["name"])

    # Get input rows as dictionaries
    rows = df.to_dict(orient="records")

    predictions = predict_health_bulk(df)

    input_data = []
    response = []
    for name, row, result in zip(names, rows, predictions):
        input_data.append(row)
        response.append({"name": name, "results": result})

    # 🔹 Generate Excel
    excel_path = generate_bulk_excel(response)

    records_collection.update_one(
        {"email": user},
        {
            "$push": {
                "records": {
                    "type": "bulk",
                    "date": datetime.utcnow(),
                    "input_data": input_data,
                    "result": response,
                    "download_excel": excel_path,
                }
            }
        },
        upsert=True,
    )

    return {
        "message": "Bulk prediction completed",
        "count": len(response),
        "download_file_name": f"/predict/bulk/download?file={excel_path}",
        "result": response,
    }


BASE_DIR = Path(__file__).resolve().parents[1]
EXPORT_DIR = BASE_DIR / "app" / "exports"


@app.get("/predict/bulk/download/{filename}")
def download_bulk_excel(filename: str):
    file_path = EXPORT_DIR / filename

    if not file_path.exists():
        return {"error": "File not found", "expected_path": str(file_path)}

    return FileResponse(
        path=file_path,
        filename=filename,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    )
