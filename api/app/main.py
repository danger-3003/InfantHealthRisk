from fastapi import UploadFile, File, FastAPI, Request, Query
from fastapi.exceptions import RequestValidationError
from fastapi.responses import FileResponse, JSONResponse
from app.utils.excel_export import generate_bulk_excel
from app.utils.bulk_upload import read_bulk_file
from app.schemas.request import InfantHealthInput, HealthPredictionResponse
from app.services.inference import predict_health, predict_health_bulk
from pathlib import Path


app = FastAPI(
    title="Neonatal Early Warning System",
    description="AI-based risk prediction for neonatal health conditions",
    version="1.0.0"
)


@app.get("/")
def health_check():
    return {"status": "API running"}

@app.exception_handler(RequestValidationError)
async def validation_exception_handler( request: Request, exc: RequestValidationError ):
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
            "message": "Please provide valid input values."
        }
    )

@app.post("/predict", response_model=HealthPredictionResponse)
def predict(input_data: InfantHealthInput):
    return predict_health(input_data.dict())

@app.post("/predict/bulk")
async def predict_bulk(file: UploadFile = File(...)):
    df = read_bulk_file(file)

    # Extract names
    names = (
        df["name"].tolist()
        if "name" in df.columns
        else [f"Infant {i+1}" for i in range(len(df))]
    )

    if "name" in df.columns:
        df = df.drop(columns=["name"])

    predictions = predict_health_bulk(df)

    response = []
    for name, result in zip(names, predictions):
        response.append({
            "name": name,
            "results": result
        })

    # 🔹 Generate Excel
    excel_path = generate_bulk_excel(response)

    return {
        "message": "Bulk prediction completed",
        "count": len(response),
        "download_file_name": f"/predict/bulk/download?file={excel_path}",
        "result": response
    }

BASE_DIR = Path(__file__).resolve().parents[1]
EXPORT_DIR = BASE_DIR / "app" / "exports"

@app.get("/predict/bulk/download/{filename}")
def download_bulk_excel(filename: str):
    file_path = EXPORT_DIR / filename

    if not file_path.exists():
        return {
            "error": "File not found",
            "expected_path": str(file_path)
        }

    return FileResponse(
        path=file_path,
        filename=filename,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )