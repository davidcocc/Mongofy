angular.module('mongofyApp')
    .service('SpotifyService', ['$http', function($http) {
        const clientId = 'b1cc5124d6cb4e43a9bfb6ea1ecd1754';
        const clientSecret = '8b79286098c44475983a2826b18a7003';
        let accessToken = '';

        // Funzione per ottenere il token di accesso
        this.getAccessToken = function() {
            const authUrl = 'https://accounts.spotify.com/api/token';
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
            };
            const data = 'grant_type=client_credentials';

            return $http.post(authUrl, data, { headers }).then(response => {
                accessToken = response.data.access_token;
                return accessToken;
            });
        };

        // Funzione per ottenere la copertina dell'album
        this.getAlbumCover = function(albumName) {
            if (!accessToken) {
                return this.getAccessToken().then(() => this.getAlbumCover(albumName));
            }

            const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(albumName)}&type=album`;
            const headers = {
                'Authorization': 'Bearer ' + accessToken
            };

            return $http.get(searchUrl, { headers }).then(response => {
                const album = response.data.albums.items[0];
                return album ? album.images[0].url : null;
            });
        };
    }]);
