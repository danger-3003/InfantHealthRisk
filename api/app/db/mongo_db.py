from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

MONGO_URI = "mongodb+srv://root:1234@usercluster.xm6s871.mongodb.net/?appName=UserCluster"

client = MongoClient(MONGO_URI, server_api=ServerApi("1"))
db = client["cardiac_app"]
users_collection = db["users"]
records_collection = db["records"]
