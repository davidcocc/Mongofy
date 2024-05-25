import pandas as pd
from spotipy import Spotify, SpotifyOAuth

# Configurazione delle credenziali Spotify
SPOTIPY_CLIENT_ID = 'b1cc5124d6cb4e43a9bfb6ea1ecd1754'
SPOTIPY_CLIENT_SECRET = '8b79286098c44475983a2826b18a7003'
SPOTIPY_REDIRECT_URI = 'http://127.0.0.1:9090/callback'
SCOPE = "user-library-read"

# Autenticazione con Spotify
sp = Spotify(auth_manager=SpotifyOAuth(client_id=SPOTIPY_CLIENT_ID,
                                       client_secret=SPOTIPY_CLIENT_SECRET,
                                       redirect_uri=SPOTIPY_REDIRECT_URI,
                                       scope=SCOPE))

# Leggere il file CSV
csv_file_path = 'musicData.csv'
df = pd.read_csv(csv_file_path)

# Funzione per ottenere l'URL della copertina dell'album usando l'ID della traccia Spotify
def get_album_cover_url(track_id):
    results = sp.track(track_id)
    if results and results['album'] and results['album']['images']:
        album_cover_url = results['album']['images'][0]['url']
        return album_cover_url
    return None

# Assicurarsi che ci sia una colonna 'SpotifyTrackID' nel CSV
if '_id' not in df.columns:
    raise ValueError("Il file CSV deve contenere una colonna 'SpotifyTrackID' con gli ID delle tracce Spotify.")

# Aggiungere una nuova colonna per l'URL della copertina dell'album
df['album_cover_url'] = df['_id'].apply(get_album_cover_url)

# Salvare il DataFrame aggiornato in un nuovo file CSV
df.to_csv('musicData_with_covers.csv', index=False)
print("Album covers have been added to the CSV file!")


