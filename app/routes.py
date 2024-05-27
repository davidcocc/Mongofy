from flask import render_template, jsonify, Blueprint, request
from pymongo import MongoClient
from bson import ObjectId
from mongoConnection import database_connection
from query_list import MongoDBClient, SongRepository
from spotipy import SpotifyOAuth, Spotify

app_bp = Blueprint('app', __name__)

# Connessione a MongoDB usando il database 'Mongofy'
client = MongoClient('mongodb://localhost:27017/')
db = client.Mongofy

db_client = MongoDBClient()
song_repo = SongRepository(db_client)

SPOTIPY_CLIENT_ID = 'b1cc5124d6cb4e43a9bfb6ea1ecd1754'
SPOTIPY_CLIENT_SECRET = '8b79286098c44475983a2826b18a7003'
SPOTIPY_REDIRECT_URI = 'http://127.0.0.1:9090/callback'
SCOPE = "user-library-modify user-library-read"

sp = Spotify(auth_manager=SpotifyOAuth(client_id=SPOTIPY_CLIENT_ID,
                                       client_secret=SPOTIPY_CLIENT_SECRET,
                                       redirect_uri=SPOTIPY_REDIRECT_URI,
                                       scope=SCOPE))



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



@app_bp.route('/like_song', methods=['POST'])
def like_song():
    data = request.json
    song_id = data.get('song_id')
    if song_id:
        sp.current_user_saved_tracks_add([song_id])
        return jsonify({'status': 'success', 'message': 'Song liked successfully!'}), 200
    return jsonify({'status': 'error', 'message': 'Song ID is required'}), 400

@app_bp.route('/play_song', methods=['POST'])
def play_song():
    song_id = request.json.get('song_id')
    if not song_id:
        return jsonify({'status': 'error', 'message': 'No song_id provided'}), 400

    try:
        # Recupera i dettagli del brano da Spotify
        track = sp.track(song_id)
        preview_url = track.get('preview_url')
        
        if not preview_url:
            return jsonify({'status': 'error', 'message': 'No preview available for this track'}), 404

        return jsonify({'status': 'success', 'preview_url': preview_url})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


# DAVID QUESTE 3 FUNZIONI SOTTO SONO DA UTILIZZARE NELL'HTML, VEDI SE RIESCI AD INTEGRARLE

@app_bp.route('/update_song/<song_id>', methods=['PUT'])
def update_song(song_id):
    data = request.json
    print("Data received:", data)  # Stampa il contenuto della richiesta per debug

    if not data:
        return jsonify({'status': 'error', 'message': 'No update data provided'}), 400
    
    update_data = {}
    for key in ['ArtistName', 'TrackName']:
        if key in data:
            update_data[key] = data[key]
    
    if song_repo.update_song(song_id, update_data):
        return jsonify({'status': 'success', 'message': 'Song updated successfully!'}), 200
    else:
        return jsonify({'status': 'error', 'message': 'Failed to update song or song not found'}), 400



@app_bp.route('/delete_song/<song_id>', methods=['POST'])
def delete_song(song_id):
    result = song_repo.delete_song(song_id)
    if result:
        return jsonify({'status': 'success', 'message': 'Song deleted successfully!'}), 200
    else:
        return jsonify({'status': 'error', 'message': 'Failed to delete song or song not found'}), 400

@app_bp.route('/add_song', methods=['POST'])
def add_song():
    data = request.json
    if data:
        inserted_id = song_repo.insert_song(data)
        if inserted_id:
            return jsonify({'status': 'success', 'message': 'Song added successfully!', 'inserted_id': str(inserted_id)}), 200
        else:
            return jsonify({'status': 'error', 'message': 'Failed to add song'}), 500
    else:
        return jsonify({'status': 'error', 'message': 'No data provided'}), 400
    




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






@app_bp.route('/api/songs/most_dance', methods=['GET'])
def get_most_dance_songs():
    songs = song_repo.find_songs_by_danceability_morethan()
    
    for song in songs:
        song = convert_objectid_to_str(song)
    return jsonify(list(songs))

@app_bp.route('/api/songs/less_dance', methods=['GET'])
def get_less_danceable_songs():
    songs = song_repo.find_songs_by_danceability_lessthan()
    
    for song in songs:
        song = convert_objectid_to_str(song)
    return jsonify(list(songs))


@app_bp.route('/api/songs/most_popularity', methods=['GET'])
def get_most_popularity_songs():
    songs = song_repo.find_songs_by_popularity_morethan()
    
    for song in songs:
        song = convert_objectid_to_str(song)
    return jsonify(list(songs))


@app_bp.route('/api/songs/less_popularity', methods=['GET'])
def get_less_popularity_songs():
    songs = song_repo.find_songs_by_popularity_lessthan()
    
    for song in songs:
        song = convert_objectid_to_str(song)
    return jsonify(list(songs))


@app_bp.route('/api/songs/most_energy', methods=['GET'])
def get_most_energy_songs():
    songs = song_repo.find_songs_by_energy_morethan()
    
    for song in songs:
        song = convert_objectid_to_str(song)
    return jsonify(list(songs))


@app_bp.route('/api/songs/less_energy', methods=['GET'])
def get_less_energy_songs():
    songs = song_repo.find_songs_by_energy_lessthan()
    
    for song in songs:
        song = convert_objectid_to_str(song)
    return jsonify(list(songs))


@app_bp.route('/api/songs/most_speechiness', methods=['GET'])
def get_most_speechiness_songs():
    songs = song_repo.find_songs_by_speechiness_morethan()
    
    for song in songs:
        song = convert_objectid_to_str(song)
    return jsonify(list(songs))


@app_bp.route('/api/songs/less_speechiness', methods=['GET'])
def get_less_speechiness_songs():
    songs = song_repo.find_songs_by_speechiness_lessthan()
    
    for song in songs:
        song = convert_objectid_to_str(song)
    return jsonify(list(songs))

@app_bp.route('/api/songs/most_instrumentalness', methods=['GET'])
def get_most_instrumentalness_songs():
    songs = song_repo.find_songs_by_instrumentalness_morethan()
    
    for song in songs:
        song = convert_objectid_to_str(song)
    return jsonify(list(songs))


@app_bp.route('/api/songs/less_instrumentalness', methods=['GET'])
def get_less_instrumentalness_songs():
    songs = song_repo.find_songs_by_instrumentalness_lessthan()
    
    for song in songs:
        song = convert_objectid_to_str(song)
    return jsonify(list(songs))


@app_bp.route('/api/songs/most_valence', methods=['GET'])
def get_most_valence_songs():
    songs = song_repo.find_songs_by_valence_morethan()
    
    for song in songs:
        song = convert_objectid_to_str(song)
    return jsonify(list(songs))


@app_bp.route('/api/songs/less_valence', methods=['GET'])
def get_less_valence_songs():
    songs = song_repo.find_songs_by_valence_lessthan()
    
    for song in songs:
        song = convert_objectid_to_str(song)
    return jsonify(list(songs))



@app_bp.route('/api/songs/find_speranza', methods=['GET'])
def get_speranza_songs():
    songs = song_repo.find_Speranza()
    
    for song in songs:
        song = convert_objectid_to_str(song)
    return jsonify(list(songs))

@app_bp.route('/api/songs/find_italian', methods=['GET'])
def get_italian_songs():
    songs = song_repo.find_songs_by_genre_italian()
    
    for song in songs:
        song = convert_objectid_to_str(song)
    return jsonify(list(songs))







