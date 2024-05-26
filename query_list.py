import pymongo
from bson import ObjectId

class MongoDBClient:
    def __init__(self, uri='mongodb://localhost:27017/', db_name='Mongofy'):
        self.client = pymongo.MongoClient(uri)
        self.db = self.client[db_name]

    def get_collection(self, collection_name):
        return self.db[collection_name]

class SongRepository:
    def __init__(self, db_client):
        self.songs_collection = db_client.get_collection('songs')
        self.genres_collection = db_client.get_collection('genres')

    def find_songs(self):
        return list(self.songs_collection.find({}, {
        "_id": 1, "ArtistName": 1, "TrackName": 1, "Popularity": 1, "Genres": 1,
        "danceability": 1, "energy": 1, "speechiness": 1, "instrumentalness": 1,
        "valence": 1, "duration_ms": 1, "album_cover_url": 1
        }))
        
    def find_genres(self):
        return list(self.genres_collection.find({}, {"_id": 1, "genre": 1}))

    def find_songs_by_artist(self, artist_name):
        return list(self.songs_collection.find({"ArtistName": {"$regex": artist_name, "$options": "i"}}))

    def find_songs_by_genre(self, genre_name):
        matching_genres = self.genres_collection.find({"genre": {"$regex": genre_name, "$options": "i"}})
        genre_ids = [genre['_id'] for genre in matching_genres]
        if genre_ids:
            return list(self.songs_collection.find({"Genres": {"$in": genre_ids}}))
        return []
    
    
    def find_songs_by_danceability_morethan(self):
        return list(self.songs_collection.find({"danceability": {"$gt": 0.70}}))
    
    def find_songs_by_danceability_lessthan(self):
        return list(self.songs_collection.find({"danceability": {"$lt": 0.30}}))
    
    
    def find_songs_by_popularity_morethan(self):
        return list(self.songs_collection.find({"Popularity": {"$gt": 0.70}}))
    
    def find_songs_by_popularity_lessthan(self):
        return list(self.songs_collection.find({"Popularity": {"$lt": 0.30}}))
    
    
    def find_songs_by_energy_morethan(self):
        return list(self.songs_collection.find({"energy": {"$gt": 0.70}}))
    
    def find_songs_by_energy_lessthan(self):
        return list(self.songs_collection.find({"energy": {"$lt": 0.30}}))
    
    def find_songs_by_speechiness_morethan(self):
        return list(self.songs_collection.find({"speechiness": {"$gt": 0.70}}))
    
    def find_songs_by_speechiness_lessthan(self):
        return list(self.songs_collection.find({"speechiness": {"$lt": 0.30}}))
    
    def find_songs_by_instrumentalness_morethan(self):
        return list(self.songs_collection.find({"instrumentalness": {"$gt": 0.70}}))
    
    def find_songs_by_instrumentalness_lessthan(self):
        return list(self.songs_collection.find({"instrumentalness": {"$lt": 0.30}}))
    
    def find_songs_by_valence_morethan(self):
        return list(self.songs_collection.find({"valence": {"$gt": 0.70}}))
    
    def find_songs_by_valence_lessthan(self):
        return list(self.songs_collection.find({"valence": {"$lt": 0.30}}))
    
    def find_Speranza(self):
        return list(self.songs_collection.find({"ArtistName": "Speranza", "valence": {"$gt": 0.50}}))
    
    def find_songs_by_genre_italian(self):
        matching_genres = self.genres_collection.find({"genre": {"$regex": "italian", "$options": "i"}, "instrumentalness": {"$gt": 0.40}})
        genre_ids = [genre['_id'] for genre in matching_genres]
        if genre_ids:
            return list(self.songs_collection.find({"Genres": {"$in": genre_ids}}))
        return []
    
    def update_song(self, song_id, update_data):
        result = self.songs_collection.update_one(
            {'_id': ObjectId(song_id)},
            {'$set': update_data}
        )
        return result.modified_count > 0
    
    def delete_song(self, song_id):
        result = self.songs_collection.delete_one({'_id': ObjectId(song_id)})
        return result.deleted_count > 0
    
    def insert_song(self, song_data):
        result = self.songs_collection.insert_one(song_data)
        return result.inserted_id
    
    def find_songs_by_title(self, track_name):
        return list(self.songs_collection.find({"TrackName": {"$regex": track_name, "$options": "i"}}))
    