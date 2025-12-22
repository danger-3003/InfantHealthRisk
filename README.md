
# 🍼 Infant Health Risk Prediction System

This project is a machine learning–powered backend system designed to predict infant health risk levels and provide condition-wise risk assessment (Cardiac, Respiratory, and Jaundice). It combines a robust ML model with a modern, high-performance backend architecture.

---

## 🤖 Why XGBoost Multi-Class Model?

The project uses an XGBoost multi-class classification model with the `multi:softmax` objective and `mlogloss` as the evaluation metric.

### Reasons for Choosing XGBoost

- Optimized for structured tabular medical data
- Native support for multi-class classification (Low, Medium, High risk)
- Strong performance on small-to-medium datasets
- Built-in regularization to prevent overfitting
- Fast training and inference suitable for APIs

### Why `mlogloss`?

- Evaluates prediction confidence
- Penalizes incorrect but confident predictions
- Suitable for healthcare risk assessment

---

## ⚙️ Why FastAPI Instead of Django?

FastAPI is used as the backend framework.

### Reasons for Choosing FastAPI

- High-performance asynchronous framework
- Designed for API-first applications
- Automatic Swagger/OpenAPI documentation
- Strong request/response validation using Pydantic
- Clean JWT Bearer token authentication
- Less boilerplate than Django REST Framework

---

## 🗄️ Why MongoDB Instead of PostgreSQL?

MongoDB is used as the database.

### Reasons for Choosing MongoDB

- Flexible schema for evolving healthcare data
- JSON-native document storage
- Efficient storage of nested prediction results
- Faster development without schema migrations
- Horizontal scalability

---

## 📦 Why uv Instead of pip?

The project uses uv as the Python package manager.

### Reasons for Choosing uv

- Faster dependency installation
- Deterministic dependency resolution
- Built-in virtual environment management
- Unified workflow for install, run, and sync

---

## 🔐 Security

- JWT Bearer token–based authentication
- Environment-based configuration
- Secure separation of ML and API layers

---

## 🏗️ Technology Stack

| Layer | Technology |
|------|-----------|
| Machine Learning | XGBoost (Multi-class) |
| Backend | FastAPI |
| Authentication | JWT Bearer |
| Database | MongoDB |
| Package Manager | uv |
| Evaluation Metric | Multi-class Log Loss |

---

## 🎓 Final Note

This system is intended as a risk prediction and early warning tool, not a diagnostic system. All technology choices prioritize performance, scalability, and maintainability.
