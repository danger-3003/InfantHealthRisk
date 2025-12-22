from fastapi import UploadFile, HTTPException
import pandas as pd


def read_bulk_file(file: UploadFile) -> pd.DataFrame:
    if file.filename.endswith(".csv"):
        return pd.read_csv(file.file)
    elif file.filename.endswith(".xlsx"):
        return pd.read_excel(file.file)
    else:
        raise HTTPException(400, "Only CSV or Excel supported")
