from flask import render_template, jsonify, Blueprint
from pymongo import MongoClient
from bson import ObjectId
from mongoConnection import database_connection

app_bp = Blueprint('app', __name__)

# Connessione a MongoDB usando il database 'Mongofy'
client = MongoClient('mongodb://localhost:27017/')
db = client.Mongofy

def convert_objectid_to_str(document):
    if isinstance(document, dict):
        for key, value in document.items():
            if isinstance(value, ObjectId):
                document[key] = str(value)
            elif isinstance(value, list):
                document[key] = [convert_objectid_to_str(item) if isinstance(item, (dict, ObjectId)) else item for item in value]
            elif isinstance(value, dict):
                document[key] = convert_objectid_to_str(value)
    elif isinstance(document, ObjectId):
        document = str(document)
    return document

@app_bp.route('/')
def index():
    database_connection()  # Assicurati che la connessione al database e l'inserimento iniziale dei dati avvenga
    return render_template('index.html')

@app_bp.route('/api/songs')
def get_songs():
    # Ottieni i dati dalla collezione 'songs'
    songs_collection = db.songs
    songs = list(songs_collection.find({}, {
        "_id": 1, "ArtistName": 1, "TrackName": 1, "Popularity": 1, "Genres": 1,
        "danceability": 1, "energy": 1, "speechiness": 1, "instrumentalness": 1,
        "valence": 1, "duration_ms": 1
    }))
    
    # Converti ObjectId in stringa
    for song in songs:
        song = convert_objectid_to_str(song)
    
    return jsonify(songs)

@app_bp.route('/api/genres')
def get_genres():
    # Ottieni i dati dalla collezione 'genres'
    genres_collection = db.genres
    genres = list(genres_collection.find({}, {"_id": 1, "genre": 1}))
    
    # Converti ObjectId in stringa
    for genre in genres:
        genre = convert_objectid_to_str(genre)
    
    return jsonify(genres)
