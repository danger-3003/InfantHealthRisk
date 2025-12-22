import joblib
import numpy as np
import pandas as pd

from app.core.config import FEATURE_ORDER_PATH, LOW_RISK_THRESHOLD, MEDIUM_RISK_THRESHOLD, MODEL_PATH

# ----------------------------
# Load trained model & features
# ----------------------------

model = joblib.load(MODEL_PATH)
feature_order = joblib.load(FEATURE_ORDER_PATH)

np.random.seed(42)

# ----------------------------
# Condition mapping
# ----------------------------
CONDITIONS = {
    "p_jaundice": "Jaundice",
    "p_cardiac": "Cardiac",
    "p_respiratory": "Respiratory"
}

# ----------------------------
# Risk bucketing
# ----------------------------
def risk_bucket(p: float) -> str:
    if p < LOW_RISK_THRESHOLD:
        return "Low"
    elif p < MEDIUM_RISK_THRESHOLD:
        return "Medium"
    return "High"

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
# Interpret predictions
# ----------------------------
def interpret_all_predictions(probabilities: dict) -> list:
    results = []

    for key, prob in probabilities.items():
        results.append({
            "condition": CONDITIONS[key],
            "risk_level": risk_bucket(prob),
            "confidence": round(prob, 2)
        })

    return results

# ----------------------------
# Generate realistic infant data
# ----------------------------
sample_input = {
    "name":"test infant",
    "gender": np.random.randint(0, 2),
    "gestational_age_weeks": np.random.randint(32, 41),
    "birth_weight_kg": round(np.random.uniform(1.8, 4.0), 2),
    "birth_length_cm": round(np.random.uniform(44, 52), 1),
    "birth_head_circumference_cm": round(np.random.uniform(30, 36), 1),
    "age_days": np.random.randint(1, 28),
    "weight_kg": round(np.random.uniform(1.7, 4.0), 2),
    "length_cm": round(np.random.uniform(44, 54), 1),
    "head_circumference_cm": round(np.random.uniform(30, 38), 1),
    "temperature_c": round(np.random.uniform(36.0, 39.5), 1),
    "heart_rate_bpm": np.random.randint(90, 190),
    "respiratory_rate_bpm": np.random.randint(30, 70),
    "oxygen_saturation": round(np.random.uniform(85, 100), 1),
    "feeding_type": np.random.randint(0, 2),
    "feeding_frequency_per_day": np.random.randint(4, 10),
    "urine_output_count": np.random.randint(1, 8),
    "stool_count": np.random.randint(0, 6),
    "jaundice_level_mg_dl": round(np.random.uniform(2, 20), 1),
    "apgar_score": np.random.randint(4, 10),
    "immunizations_done": np.random.randint(0, 2),
    "reflexes_normal": np.random.randint(0, 2)
}

# ----------------------------
# Test model
# ----------------------------
def test_model():

    # Convert input to DataFrame
    X = pd.DataFrame([sample_input])

    # Ensure feature order
    X = X.reindex(columns=feature_order)

    # Fill missing values
    X = X.fillna(X.median())

    # Predict class probabilities
    class_probs = model.predict_proba(X)[0]

    # Map to condition-wise probabilities
    condition_probs = map_model_probs_to_conditions(class_probs)

    # Interpret results
    final_output = interpret_all_predictions(condition_probs)

    # ----------------------------
    # Print results
    # ----------------------------
    input_table = pd.DataFrame(
        sample_input.items(),
        columns=["Feature", "Value"]
    )

    print("\n🍼 Infant Input Data -\n")
    print(input_table.to_string(index=False))

    print("\n\nCondition-wise Risk Probabilities - \n")
    for r in final_output:
        print(
            f"{r['condition']:<12} | "
            f"Risk Level: {r['risk_level']:<6} | "
            f"Confidence: {r['confidence']}"
        )

    print("\n")

if __name__ == "__main__":
    test_model()
