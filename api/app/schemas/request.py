from pydantic import BaseModel, Field
from typing import List

class InfantHealthInput(BaseModel):
    name: str
    gender: int = Field(..., ge=0, le=1)
    gestational_age_weeks: int = Field(..., ge=22, le=42)

    birth_weight_kg: float = Field(..., gt=0.5, le=6.0)
    birth_length_cm: float = Field(..., gt=30, le=60)
    birth_head_circumference_cm: float = Field(..., gt=20, le=40)

    age_days: int = Field(..., ge=0, le=28)

    weight_kg: float = Field(..., gt=0.5, le=6.0)
    length_cm: float = Field(..., gt=30, le=60)
    head_circumference_cm: float = Field(..., gt=20, le=40)

    temperature_c: float = Field(..., ge=35.0, le=42.0)
    heart_rate_bpm: int = Field(..., ge=60, le=220)
    respiratory_rate_bpm: int = Field(..., ge=20, le=90)
    oxygen_saturation: float = Field(..., ge=70, le=100)

    feeding_type: int = Field(..., ge=0, le=1)
    feeding_frequency_per_day: int = Field(..., ge=1, le=12)

    urine_output_count: int = Field(..., ge=0, le=10)
    stool_count: int = Field(..., ge=0, le=10)

    jaundice_level_mg_dl: float = Field(..., ge=0.1, le=30)
    apgar_score: int = Field(..., ge=0, le=10)

    immunizations_done: int = Field(..., ge=0, le=1)
    reflexes_normal: int = Field(..., ge=0, le=1)



class ConditionRisk(BaseModel):
    condition: str
    risk_level: str
    confidence: float


class HealthPredictionResponse(BaseModel):
    name:str
    results: List[ConditionRisk]
