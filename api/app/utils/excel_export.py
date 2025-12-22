import pandas as pd
from datetime import datetime
from pathlib import Path

EXPORT_DIR = Path("app/exports")
EXPORT_DIR.mkdir(exist_ok=True)

def generate_bulk_excel(results: list) -> str:
    rows = []

    for item in results:
        name = item["name"]
        for r in item["results"]:
            rows.append({
                "name": name,
                "condition": r["condition"],
                "risk_level": r["risk_level"],
                "confidence": r["confidence"],
            })

    df = pd.DataFrame(rows)

    filename = f"bulk_predictions_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
    file_path = EXPORT_DIR / filename

    df.to_excel(file_path, index=False)

    return filename
