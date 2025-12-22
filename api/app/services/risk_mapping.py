# ----------------------------
# Condition mapping
# ----------------------------
from app.core.config import LOW_RISK_THRESHOLD, MEDIUM_RISK_THRESHOLD


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
# Interpret condition-wise risks
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
