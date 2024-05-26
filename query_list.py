import pymongo

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
    

    def find_songs_by_popularity(self, min_popularity):
        return list(self.songs_collection.find({"Popularity": {"$gt": min_popularity}}))

    def find_songs_by_duration(self, max_duration):
        return list(self.songs_collection.find({"duration_ms": {"$lt": max_duration}}))

    def find_songs_by_danceability(self, min_danceability):
        return list(self.songs_collection.find({"danceability": {"$gt": min_danceability}}))
    
    def find_songs_by_danceability_50(self):
        return list(self.songs_collection.find({"danceability": {"$gt": 0.50}}))
    
    def find_songs_by_artist_and_dance(self, artist_name):
        return list(self.songs_collection.find({"ArtistName": artist_name}).sort("duration_ms", 1))

    def find_songs_by_title(self, track_name):
        return list(self.songs_collection.find({"TrackName": {"$regex": track_name, "$options": "i"}}))
    