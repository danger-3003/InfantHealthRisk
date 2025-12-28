from datetime import datetime
import joblib
import pandas as pd
import numpy as np

from app.core.config import FEATURE_ORDER_PATH, MODEL_PATH
from app.services.risk_mapping import interpret_all_predictions
from app.db.mongo_db import records_collection

# ----------------------------
# Model paths
# ----------------------------

model = joblib.load(MODEL_PATH)
feature_order = joblib.load(FEATURE_ORDER_PATH)

# ----------------------------
# Map overall risk → conditions
# ----------------------------
def map_model_probs_to_conditions(class_probs: np.ndarray) -> dict:
    """
    class_probs = [P(Low), P(Medium), P(High)]
    """
    low, medium, high = class_probs

    return {
        "p_jaundice": float(0.6 * medium + 0.4 * high),
        "p_cardiac": float(0.3 * medium + 0.7 * high),
        "p_respiratory": float(0.5 * medium + 0.5 * high),
    }

# ----------------------------
# Single prediction
# ----------------------------
def predict_health(input_data: dict, user) -> dict:
    baby_name = input_data.get("name")

    df = pd.DataFrame([input_data])
    df = df.reindex(columns=feature_order)
    df = df.fillna(df.median(numeric_only=True))

    # Predict probabilities
    class_probs = model.predict_proba(df)[0]

    # Convert to condition-wise probabilities
    condition_probs = map_model_probs_to_conditions(class_probs)

    results = interpret_all_predictions(condition_probs)

    records_collection.update_one(
        {"email":user},
        {
            "$push":{
                "records":{
                    "type": "single",
                    "date": datetime.utcnow(),
                    "input_data": [input_data],
                    "result": [{
                        "name":baby_name,
                        "results":results
                    }]
                }
            }
        },
        upsert=True
    )
        
    return {
        "name":baby_name,
        "results": results
    }

# ----------------------------
# Bulk prediction
# ----------------------------
def predict_health_bulk(df: pd.DataFrame) -> list:
    df = df.reindex(columns=feature_order)
    df = df.fillna(df.median(numeric_only=True))

    # Predict probabilities for all rows
    class_probs_all = model.predict_proba(df)

    bulk_results = []

    for class_probs in class_probs_all:
        condition_probs = map_model_probs_to_conditions(class_probs)
        result = interpret_all_predictions(condition_probs)
        bulk_results.append(result)

    return bulk_results
