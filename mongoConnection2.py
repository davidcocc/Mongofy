import pandas as pd
from pymongo import MongoClient, errors

# Funzione per la connessione a MongoDB
def connect_to_mongo(uri, db_name, collection_name):
    try:
        client = MongoClient(uri)
        print("Connessione a MongoDB effettuata!")
        db = client[db_name]
        collection = db[collection_name]
        return collection
    except errors.ConnectionError as e:
        print(f"Errore di connessione a MongoDB: {e}")
        return None
    except errors.ConfigurationError as e:
        print(f"Errore di configurazione: {e}")
        return None

# Funzione per caricare i dati CSV
def load_csv(file_path):
    try:
        df = pd.read_csv(file_path)
        print("CSV letto con successo!")
        return df
    except FileNotFoundError:
        print("Errore: File CSV non trovato!")
        return None
    except pd.errors.EmptyDataError:
        print("Errore: File CSV vuoto!")
        return None
    except pd.errors.ParserError:
        print("Errore di parsing del CSV!")
        return None

# Funzione per inserire i dati nella collection
def insert_data_to_collection(collection, data):
    try:
        collection.insert_many(data)
        print("Dati inseriti con successo nella collection!")
    except errors.BulkWriteError as e:
        print(f"Errore durante l'inserimento dei dati: {e}")

# Percorso del file CSV
csv_file_path = 'musicData.csv'

# Carica i dati dal CSV
df = load_csv(csv_file_path)
if df is not None:
    data_dict = df.to_dict(orient='records')
    print(data_dict[:2])  # Visualizza i primi due record per conferma

    # Connessione a MongoDB e inserimento dei dati
    collection = connect_to_mongo('mongodb://localhost:27017/', 'Mongofy', 'songs')
    if collection is not None:
        insert_data_to_collection(collection, data_dict)
else:
    print("Impossibile procedere senza i dati CSV.")
