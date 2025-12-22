
# 🍼 Infant Health Risk Prediction API

This project provides a machine learning–based API to predict infant health risk levels and derive condition-wise risk assessments (Cardiac, Respiratory, and Jaundice) using a trained XGBoost model.

---

## 🚀 Prerequisites

- Python 3.10 or above
- pip
- Internet connection (for installing dependencies)

---

## 📦 Step 1: Install uv

uv is used for fast dependency management and script execution.

```
pip install uv
```

---

## 📁 Step 2: Navigate to the API Folder

Move into the api directory before running any commands:

```
cd api
```

---

## 📥 Step 3: Install Dependencies and activate virtual environment

Install all required Python packages using:

```
uv sync
```

Activate virtual env using:

```
.venv/scripts/activate
```

---

## ⚙️ Step 4: Configure Environment Variables

Create a `.env` file inside the api folder.

Example `.env` file:

```
MODEL_PATH=app/models/health_model.pkl
FEATURE_ORDER_PATH=app/models/feature_order.pkl

LOW_RISK_THRESHOLD=0.45
MEDIUM_RISK_THRESHOLD=0.6

DATASET_PATH=data/newborn_health_monitoring_with_risk.csv
```

You can change the paths and values based on the model and dataset location.

---

## 🧠 Step 5: Train the Model

To train the machine learning model:

```
uv run train
```

This command:
- Loads the dataset
- Trains the XGBoost model
- Saves the trained model and feature order

---

## 🧪 Step 6: Test the Model

To test the trained model:

```
uv run test
```

This will run predictions and display condition-wise risk results.

---

## 🌐 Step 7: Run the API Server

To start the API server:

```
uv run server
```

---

## 📁 Project Structure

```
api/
 ├── app/
 │   ├── core/
 │   │   └── config.py
 │   ├── services/
 │   │   ├── health_prediction.py
 │   │   └── risk_mapping.py
 │   └── models/
 │       └── health_model.pkl
 ├── training/
 │   └── train_models.py
 ├── data/
 │   └── newborn_health_monitoring_with_risk.csv
 ├── .env
 └── README.md
```

---

## 🎓 Notes

- This system is a risk prediction and early warning tool, not a medical diagnostic system.
- Condition-wise risks are derived using a rule-based interpretation layer.
- Environment variables are managed using python-decouple.

---

## ✅ Commands Summary

- Install dependencies: uv sync
- Train model: uv run train
- Test model: uv run test
- Run server: uv run server
