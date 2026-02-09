import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    balanced_accuracy_score,
    confusion_matrix,
    f1_score,
    precision_recall_fscore_support,
    mean_squared_error,
    r2_score,
)

from catboost import CatBoostClassifier

from app.core.config import FEATURE_ORDER_PATH, MODEL_PATH


# =====================================================
# TRAIN MODEL (FINAL-YEAR + DISTINCTION LEVEL)
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
    X = data.drop(columns=["baby_id", "name", "date", "risk_level"], errors="ignore")
    y = data["risk_level"]

    # Numeric features only
    X = X.select_dtypes(include="number")
    X = X.fillna(X.median())

    # -----------------------------
    # Stratified Train-Test Split
    # -----------------------------
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.3, random_state=42, stratify=y
    )

    # -----------------------------
    # CatBoost Multi-Class Model
    # -----------------------------
    model = CatBoostClassifier(
        iterations=120,
        depth=3,
        learning_rate=0.03,
        loss_function="MultiClass",
        eval_metric="MultiClass",
        random_seed=42,
        verbose=0,
    )

    model.fit(X_train, y_train)

    # -----------------------------
    # Predictions
    # -----------------------------
    y_pred = model.predict(X_test).flatten()

    # -----------------------------
    # Core Metrics
    # -----------------------------
    accuracy = accuracy_score(y_test, y_pred)
    balanced_acc = balanced_accuracy_score(y_test, y_pred)
    macro_f1 = f1_score(y_test, y_pred, average="macro")

    # Regression-style metrics (distance error)
    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    r2 = r2_score(y_test, y_pred)

    precision, recall, f1, support = precision_recall_fscore_support(
        y_test, y_pred, labels=[0, 1, 2], zero_division=0
    )

    labels = ["Low", "Medium", "High"]

    # =====================================================
    # ULTRA-CLEAN CONSOLE REPORT (NON-TECH FRIENDLY)
    # =====================================================

    print("\n" + "=" * 60)
    print("        🏥 NEWBORN RISK PREDICTION — MODEL REPORT")
    print("=" * 60)

    print("\n📊 OVERALL MODEL PERFORMANCE\n")

    print(f"✅ Accuracy            : {accuracy*100:.2f}%")
    print(f"✅ Balanced Accuracy   : {balanced_acc*100:.2f}%")
    print(f"✅ Macro F1 Score      : {macro_f1:.3f}")

    print("\n📉 ERROR METRICS (How far predictions deviate)")
    print(f"• Mean Squared Error (MSE) : {mse:.3f}")
    print(f"• Root Mean Squared Error  : {rmse:.3f}")
    print(f"• R² Score                 : {r2:.3f}")

    print("\n👉 Simple Interpretation:")
    print("• Higher Accuracy → More correct predictions.")
    print("• Lower MSE/RMSE → Predictions are closer to actual risk.")
    print("• R² closer to 1 → Strong predictive reliability.")
    print("• Balanced Accuracy ensures fairness across all risk levels.")

    print("\n" + "-" * 60)
    print("Per-Class Performance")
    print("-" * 60)

    for i, label in enumerate(labels):
        print(
            f"{label:<8} | "
            f"Precision: {precision[i]:.2f} | "
            f"Recall: {recall[i]:.2f} | "
            f"F1-score: {f1[i]:.2f} | "
            f"Cases: {support[i]}"
        )

    print("\nConfusion Matrix (Actual vs Predicted)")
    print(confusion_matrix(y_test, y_pred))

    # -----------------------------
    # Save Metrics as CSV
    # -----------------------------
    metrics_df = pd.DataFrame(
        {
            "Class": labels,
            "Precision": precision,
            "Recall": recall,
            "F1-score": f1,
            "Support": support,
        }
    )

    overall_row = pd.DataFrame(
        {
            "Class": ["Overall"],
            "Precision": [""],
            "Recall": [""],
            "F1-score": [round(macro_f1, 3)],
            "Support": [support.sum()],
        }
    )

    metrics_df = pd.concat([metrics_df, overall_row], ignore_index=True)

    metrics_df.to_csv("model_metrics.csv", index=False)

    # -----------------------------
    # Save Model Artifacts
    # -----------------------------
    joblib.dump(model, MODEL_PATH)
    joblib.dump(list(X.columns), FEATURE_ORDER_PATH)

    print("\n🚀 Model trained, evaluated, and ready for clinical risk prediction.")
    print("✅ Model + feature order + metrics saved successfully.")


if __name__ == "__main__":
    train_model()
