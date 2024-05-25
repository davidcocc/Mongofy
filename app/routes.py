from flask import render_template, jsonify, Blueprint
from pymongo import MongoClient
from bson import ObjectId
from mongoConnection import database_connection
from query_list import MongoDBClient, SongRepository

app_bp = Blueprint('app', __name__)

# Connessione a MongoDB usando il database 'Mongofy'
client = MongoClient('mongodb://localhost:27017/')
db = client.Mongofy

db_client = MongoDBClient()
song_repo = SongRepository(db_client)

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
    database_connection()
    return render_template('index.html')


@app_bp.route('/api/songs')
def get_songs():
    songs = song_repo.find_songs()
    for song in songs:
        song = convert_objectid_to_str(song)
    return jsonify(songs)


@app_bp.route('/api/genres')
def get_genres():
    genres = song_repo.find_genres()
    for genre in genres:
        genre = convert_objectid_to_str(genre)
    return jsonify(genres)


@app_bp.route('/api/songs/genre/<genre_name>')
def get_songs_by_genre(genre_name):
    songs = song_repo.find_songs_by_genre(genre_name)
    for song in songs:
        song = convert_objectid_to_str(song)
    return jsonify(songs)


@app_bp.route('/api/songs/title/<track_name>')
def get_songs_by_title(track_name):
    songs = song_repo.find_songs_by_title(track_name)
    for song in songs:
        song = convert_objectid_to_str(song)
    return jsonify(songs)


@app_bp.route('/api/songs/artist/<artist_name>')
def get_songs_by_artist(artist_name):
    songs = song_repo.find_songs_by_artist(artist_name)
    for song in songs:
        song = convert_objectid_to_str(song)
    return jsonify(songs)


