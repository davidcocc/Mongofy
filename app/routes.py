from flask import render_template, jsonify, Blueprint
from pymongo import MongoClient

app_bp = Blueprint('app', __name__)

# Connessione a MongoDB usando il database 'Mongofy'
client = MongoClient('mongodb://localhost:27017/')
db = client.Mongofy
songs_collection = db.songs

@app_bp.route('/')
def index():
    return render_template('index.html')

@app_bp.route('/api/songs')
def get_songs():
    # Ottieni i dati dalla collezione 'songs'
    songs = list(songs_collection.find({}, {
        "_id": 0, "Artist Name": 1, "Track Name": 1, "Popularity": 1, "Genres": 1,
        "danceability": 1, "energy": 1, "speechiness": 1, "instrumentalness": 1,
        "valence": 1, "duration_ms": 1
    }))
    return jsonify(songs)
