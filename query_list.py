import pymongo

uri = 'mongodb://localhost:27017/'
db_name = 'Mongofy'
songs_collection_name = 'songs'
genres_collection_name = 'genres'

def mongo_connection(collection_name):
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client[db_name]
    collection = db[collection_name]
    return collection


def find_songs_by_artist(artist_name):
    songs_collection = mongo_connection(songs_collection_name)
    return list(songs_collection.find({"ArtistName": artist_name}))

def find_songs_by_genre(genre_name):
    genres_collection = mongo_connection(genres_collection_name)
    songs_collection = mongo_connection(songs_collection_name)

    genre = genres_collection.find_one({"name": genre_name})
    if genre:
        genre_id = genre['_id']
        return list(songs_collection.find({"Genres": genre_id}))
    return []


def find_songs_by_popularity(min_popularity):
    songs_collection = mongo_connection(songs_collection_name)
    return list(songs_collection.find({"Popularity": {"$gt": min_popularity}}))


def find_songs_by_duration(max_duration):
    songs_collection = mongo_connection(songs_collection_name)
    return list(songs_collection.find({"duration_ms": {"$lt": max_duration}}))

def sort_songs_by_popularity():
    songs_collection = mongo_connection(songs_collection_name)
    return list(songs_collection.find().sort("Popularity", -1))


def find_and_sort_songs_by_artist_and_duration(artist_name):
    songs_collection = mongo_connection(songs_collection_name)
    return list(songs_collection.find().sort("duration_ms", 1))


def find_songs_by_danceability(min_danceability):
    songs_collection = mongo_connection(songs_collection_name)
    return list(songs_collection.find({"danceability": {"$gt": min_danceability}}))

def find_songs_by_title(track_name):
    songs_collection = mongo_connection(songs_collection_name)
    return list(songs_collection.find({"TrackName": track_name}))