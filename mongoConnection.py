import pandas as pd
from pymongo import MongoClient, errors
import ast



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

def insert_data_to_collection(collection, data):
    try:
        result = collection.insert_many(data)
        print("Dati inseriti con successo nella collection!")
        return result.inserted_ids
    except errors.BulkWriteError as e:
        print(f"Errore durante l'inserimento dei dati: {e}")
        return None

def is_collection_empty(collection):
    return collection.count_documents({}) == 0


def database_connection():
    # Carica i dati dal CSV
    csv_file_path = 'musicData_with_covers.csv'
    df = load_csv(csv_file_path)
    if df is not None:
        # Connessione a MongoDB
        uri = 'mongodb://localhost:27017/'
        db_name = 'Mongofy'
        songs_collection_name = 'songs'
        genres_collection_name = 'genres'

        genres_collection = connect_to_mongo(uri, db_name, genres_collection_name)
        songs_collection = connect_to_mongo(uri, db_name, songs_collection_name)

        if genres_collection is not None and songs_collection is not None:
            if is_collection_empty(genres_collection):
                # Estrai e processa i generi
                genres_set = set()
                for genres in df['Genres']:
                    genres_list = ast.literal_eval(genres)
                    genres_set.update(genres_list)

                genres_list = list(genres_set)
                genres_data = [{'genre': genre} for genre in genres_list]

                print("generi creati")
                genre_ids = insert_data_to_collection(genres_collection, genres_data)
                genre_map = {genre['genre']: genre_id for genre, genre_id in zip(genres_data, genre_ids)}

            if is_collection_empty(songs_collection):
                # Modifica i documenti delle canzoni per includere i riferimenti ai generi
                df['Genres'] = df['Genres'].apply(lambda x: [genre_map[genre] for genre in ast.literal_eval(x)])
                data_dict = df.to_dict(orient='records')

                # Inserisci i dati delle canzoni nella collection
                print("canzoni create")
                insert_data_to_collection(songs_collection, data_dict)
                print("canzoni inserite")

        return songs_collection
    else:
        return None
