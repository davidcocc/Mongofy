from flask import render_template, jsonify, Blueprint
from pymongo import MongoClient
from mongoConnection import database_connection

app_bp = Blueprint('app', __name__)

# Connessione a MongoDB usando il database 'Mongofy'
client = MongoClient('mongodb://localhost:27017/')
db = client.Mongofy

@app_bp.route('/')
def index():
    songs_collection = database_connection()
    return render_template('index.html')

def get_songs():
    # Ottieni i dati dalla collezione 'songs'
    songs = list(songs_collection.find({}, {
        "_id": 0, "Artist Name": 1, "Track Name": 1, "Popularity": 1, "Genres": 1,
        "danceability": 1, "energy": 1, "speechiness": 1, "instrumentalness": 1,
        "valence": 1, "duration_ms": 1
    }))
    print('canzoni ' + songs[2:])
    return jsonify(songs)
