from decouple import config

MODEL_PATH = config("MODEL_PATH")
FEATURE_ORDER_PATH = config("FEATURE_ORDER_PATH")

LOW_RISK_THRESHOLD = config("LOW_RISK_THRESHOLD", cast=float, default=0.45)
MEDIUM_RISK_THRESHOLD = config("MEDIUM_RISK_THRESHOLD", cast=float, default=0.6)

DEBUG = config("DEBUG", cast=bool, default=False)

DATASET_PATH = config("DATASET_PATH")
