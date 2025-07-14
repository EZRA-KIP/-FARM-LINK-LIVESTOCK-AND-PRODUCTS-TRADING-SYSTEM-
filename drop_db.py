from pymongo import MongoClient

# Connect to the local MongoDB server
client = MongoClient("mongodb://localhost:27017/")

# Drop the database (replace 'farmlinkdb' with your actual DB name if different)
client.drop_database("farmlinkdb")

print("Database 'farmlinkdb' dropped successfully.")