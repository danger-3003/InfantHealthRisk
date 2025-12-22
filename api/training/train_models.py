import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    f1_score,
    precision_recall_fscore_support
)

from xgboost import XGBClassifier

from app.core.config import FEATURE_ORDER_PATH, MODEL_PATH


# =====================================================
# TRAIN MODEL (FINAL-YEAR READY)
# =====================================================

def train_model():
    INPUT = "data/newborn_health_monitoring_with_risk.csv"

    # -----------------------------
    # Load dataset
    # -----------------------------
    data = pd.read_csv(INPUT)

    # Encode target
    risk_map = {"Low": 0, "Medium": 1, "High": 2}
    data["risk_level"] = data["risk_level"].map(risk_map)

    # Features & target
    X = data.drop(
        columns=["baby_id", "name", "date", "risk_level"],
        errors="ignore"
    )
    y = data["risk_level"]

    # Numeric features only
    X = X.select_dtypes(include="number")
    X = X.fillna(X.median())

    # -----------------------------
    # Stratified Train-Test Split
    # -----------------------------
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y
    )

    # -----------------------------
    # XGBoost Multi-Class Model
    # -----------------------------
    model = XGBClassifier(
        objective="multi:softmax",
        num_class=3,
        n_estimators=300,
        max_depth=4,
        learning_rate=0.05,
        subsample=0.85,
        colsample_bytree=0.85,
        eval_metric="mlogloss",
        random_state=42
    )

    model.fit(X_train, y_train)

    # -----------------------------
    # Predictions
    # -----------------------------
    y_pred = model.predict(X_test)

    # -----------------------------
    # Metrics
    # -----------------------------
    accuracy = accuracy_score(y_test, y_pred)
    macro_f1 = f1_score(y_test, y_pred, average="macro")

    precision, recall, f1, support = precision_recall_fscore_support(
        y_test,
        y_pred,
        labels=[0, 1, 2],
        zero_division=0
    )

    labels = ["Low", "Medium", "High"]

    # -----------------------------
    # Console Output (Viva Ready)
    # -----------------------------
    print("\n📊 FINAL MODEL PERFORMANCE SUMMARY\n")
    print(f"Overall Accuracy   : {accuracy:.3f}")
    print(f"Macro F1-score     : {macro_f1:.3f}\n")

    print("Per-Class Metrics")
    print("-" * 65)
    for i, label in enumerate(labels):
        print(
            f"{label:<8} | "
            f"Precision: {precision[i]:.3f} | "
            f"Recall: {recall[i]:.3f} | "
            f"F1-score: {f1[i]:.3f} | "
            f"Support: {support[i]}"
        )

    print("\nConfusion Matrix (rows=true, cols=pred)")
    print(confusion_matrix(y_test, y_pred))

    # -----------------------------
    # Save Metrics as CSV
    # -----------------------------
    metrics_df = pd.DataFrame({
        "Class": labels,
        "Precision": precision,
        "Recall": recall,
        "F1-score": f1,
        "Support": support
    })

    overall_row = pd.DataFrame({
        "Class": ["Overall"],
        "Precision": [""],
        "Recall": [""],
        "F1-score": [round(macro_f1, 3)],
        "Support": [support.sum()]
    })

    metrics_df = pd.concat([metrics_df, overall_row], ignore_index=True)

    # -----------------------------
    # Save Model Artifacts
    # -----------------------------
    joblib.dump(model, MODEL_PATH)
    joblib.dump(list(X.columns), FEATURE_ORDER_PATH)

    print("\n✅ Model trained & saved successfully")


if __name__ == "__main__":
    train_model()
