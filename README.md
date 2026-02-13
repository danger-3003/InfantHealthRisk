🍼 Infant Health Risk Prediction System

An ML-powered backend system for early risk detection in newborns admitted to the Neonatal Intensive Care Unit (NICU). This clinical decision support tool predicts overall health risk levels and provides condition-specific risk assessments for Cardiac, Respiratory, and Jaundice conditions.

🎯 Purpose

This system functions as an early warning and risk stratification tool to support timely clinical intervention while maintaining strict safety and reliability standards. It is designed as a decision support system, not a diagnostic tool.

🤖 Machine Learning

CatBoost Multi-Class Classification

The core prediction engine uses CatBoost with a MultiClass objective and multi-class log loss (mlogloss) evaluation metric.

Why CatBoost for Medical Data?

•	Native categorical handling: Processes clinical features (delivery mode, feeding type, gender, blood group) without one-hot encoding, preserving clinical meaning and reducing preprocessing errors
•	Ordered boosting: Prevents target leakage during training, producing trustworthy predictions critical for small or imbalanced NICU datasets
•	Well-calibrated probabilities: Aligns with mlogloss optimization to penalize overconfident predictions—essential when uncertainty must be respected
•	Stability: Strong regularization and minimal hyperparameter tuning ensure consistent performance across retraining cycles
•	Safety-first: Prioritizes prediction stability and auditability over aggressive performance gains

🏗️ Technology Stack

Layer	Technology	Purpose
ML Model	CatBoost	Multi-class risk classification
Backend	FastAPI	High-performance async API serving
Authentication	JWT Bearer	Secure token-based access control
Database	MongoDB	Flexible schema for evolving healthcare data
Python Package Manager	uv	Fast, deterministic dependency management
Frontend Package Manager	npm	JavaScript dependency management
Evaluation Metric	Multi-class Log Loss	Penalizes overconfident predictions

⚙️ Backend: FastAPI
FastAPI provides:
•	High-performance async request handling for low-latency clinical inference
•	Automatic OpenAPI/Swagger documentation
•	Type-safe validation via Pydantic models
•	Clean JWT authentication with minimal boilerplate
•	API-first architecture ideal for modern clinical systems

🗄️ Database: MongoDB

MongoDB offers:
•	Flexible schema design that adapts to evolving healthcare data requirements
•	JSON-native storage for nested prediction outputs and condition-wise risk scores
•	Horizontal scalability as data volume grows
•	Faster development cycles without frequent schema migrations
📦 Package Management

Backend: uv

•	Significantly faster than pip
•	Built-in virtual environment handling
•	Deterministic, reproducible builds
•	Unified workflow for install/sync/run operations

Frontend: npm

•	Standard package manager for Node.js ecosystem
•	Semantic versioning and lock files for reproducible builds
•	Mature ecosystem with strong security update support
•	Seamless integration with modern UI frameworks (React, Vue)

🔐 Security

•	JWT Bearer token authentication
•	Environment-based configuration management
•	Secure separation between ML inference and API layers
•	Access control and data protection for healthcare compliance

📊 Risk Assessment Output

The system provides:
Condition-specific risk scores: Low , Medium , High
o	Cardiac risk
o	Respiratory risk
o	Jaundice risk

⚠️ Important Disclaimer

This system is designed strictly as an early risk prediction and clinical decision support tool, not a diagnostic system. All predictions should be reviewed by qualified healthcare professionals before clinical action.

🎓 Design Philosophy

Every technology choice emphasizes:
•	Safety: Well-calibrated, trustworthy predictions
•	Robustness: Stable performance across retraining cycles
•	Scalability: Handles growing data and user demands
•	Interpretability: Clear, auditable prediction pathways
•	Maintainability: Long-term reliability in clinical settings
All decisions align with the ethical and operational requirements of neonatal healthcare.
________________________________________
Built with care for the smallest patients 💙

