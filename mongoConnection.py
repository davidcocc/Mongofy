import pandas as pd
from pymongo import MongoClient

df = pd.read_csv('musicData.csv')
data_dict = df.to_dict(orient='records')
print("CSV letto!")
print(data_dict[:2])

client = MongoClient('mongodb://localhost:27017/')
print("Connessione effettuata!")

db = client['Mongofy']
collection = db['songs']

collection.insert_many(data_dict)

print("Dati inseriti con successo nella collection 'songs' nel database 'Mongofy'! Daje Roma, daje!")
