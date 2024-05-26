angular.module('mongofyApp', [])



    .controller('MainController', ['$scope', '$http', '$document', function($scope, $http, $document) {
        $scope.darkMode = false;
        $scope.currentPage = 0;
        $scope.currentSort = 'TrackName';
        $scope.reverseSort = false;
        $scope.searchType = 'genre';
        $scope.searchQuery = '';
        $scope.itemsPerPage = 20; // Numero di elementi per pagina
        $scope.isModalOpen = false;
        $scope.selectedSong = {};
        $scope.songAttributes = {
        "Popolarità": 0,
        "Ballabilità": 0,
        "Energia": 0,
        "Speechiness": 0,
        "Instrumentalità": 0,
        "Valenza": 0 };

        $scope.colors = {
            "Popolarità": "#EF4444",
            "Ballabilità": "#EC4899",
            "Energia": "#EAB308",
            "Speechiness": "#22C55E",
            "Instrumentalità": "#3B82F6",
            "Valenza": "#A855F7"
        };

        $scope.getColor = function(key) {
            return $scope.colors[key] || '#000';
        };


        // Menu visibility
        $scope.menuVisible = false;

        $scope.toggleMenu = function() {
            $scope.menuVisible = !$scope.menuVisible;
        };

        $scope.runQuery = function(queryType) {
            let queryUrl;
            switch (queryType) {
                case 'mostDance':
                    queryUrl = '/api/songs/most_dance';
                    break;
                case 'lessDance':
                    queryUrl = '/api/songs/less_dance';
                    break;
                case 'mostPopolarity':
                    queryUrl = '/api/songs/most_popularity';
                    break;
                case 'lessPopolarity':
                    queryUrl = '/api/songs/less_popularity'
                    break;
                case 'mostEnergy':
                    queryUrl = '/api/songs/most_energy'
                    break;
                case 'lessEnergy':
                    queryUrl = '/api/songs/less_energy'
                    break;
                case 'mostSpeechiness':
                    queryUrl = '/api/songs/most_speechiness'
                    break;
                case 'lessSpeechiness':
                    queryUrl = '/api/songs/less_speechiness'
                    break;
                case 'mostInstrumentalness':
                    queryUrl = '/api/songs/most_instrumentalness'
                    break;
                case 'lessInstrumentalness':
                    queryUrl = '/api/songs/less_instrumentalness'
                    break;
                case 'mostValence':
                    queryUrl = '/api/songs/most_valence'
                    break;
                case 'lessValence':
                    queryUrl = '/api/songs/less_valence'
                    break;
                case 'speranza':
                    queryUrl = '/api/songs/find_speranza'
                    break;
                case 'italian':
                    queryUrl = '/api/songs/find_italian'
                    break;
                default:
                    return;
            }

            $http.get(queryUrl).then(function(response) {
                $scope.songs = response.data;
                loadGenres();
                $scope.menuVisible = false; // Hide the menu after selection
            });
        };
    

        // Funzione per caricare i generi e mapparli ai brani
        function loadGenres() {
            $http.get('/api/genres').then(function(response) {
                $scope.genres = response.data;
                mapGenresToSongs();
            });
        }

        // Funzione per mappare i generi ai brani
        function mapGenresToSongs() {
            $scope.songs.forEach(function(song) {
                song.Genres = song.Genres.map(function(genreId) {
                    var genre = $scope.genres.find(function(g) {
                        return g._id === genreId;
                    });
                    return genre ? genre.genre : genreId;
                });
            });
        }

        $scope.handleKeyPress = function(event) {
            if (event.keyCode === 13) { // Verifica se è stato premuto il tasto Invio (codice 13)
                $scope.searchSongs(); // Chiama la funzione di ricerca
            }
        };

        // Funzione per cercare i brani
        $scope.searchSongs = function() {
            let searchUrl;
            if ($scope.searchType === 'genre') {
                searchUrl = `/api/songs/genre/${$scope.searchQuery}`;
            } else if ($scope.searchType === 'title') {
                searchUrl = `/api/songs/title/${$scope.searchQuery}`;
            } else if ($scope.searchType === 'artist') {
                searchUrl = `/api/songs/artist/${$scope.searchQuery}`;
            }
            $http.get(searchUrl).then(function(response) {
                $scope.songs = response.data;
                loadGenres();
            });
        };

        // Caricamento iniziale dei brani e dei generi
        $http.get('/api/songs').then(function(response) {
            $scope.songs = response.data;
            loadGenres();
        });

        $scope.toggleTheme = function() {
            $scope.darkMode = !$scope.darkMode;
            if ($scope.darkMode) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
        };

        // Funzione per ordinare la colonna
        $scope.sortColumn = function(column) {
            if ($scope.currentSort === column) {
                $scope.reverseSort = !$scope.reverseSort;
            } else {
                $scope.currentSort = column;
                $scope.reverseSort = false;
            }
        };

        $scope.nextPage = function() {
            if (($scope.currentPage + 1) * $scope.itemsPerPage < $scope.songs.length) {
                $scope.currentPage++;
            }
        };

        $scope.prevPage = function() {
            if ($scope.currentPage > 0) {
                $scope.currentPage--;
            }
        };

        $scope.setPage = function(page) {
            $scope.currentPage = page;
        };

        $scope.getPages = function() {
            var totalPages = Math.ceil($scope.songs.length / $scope.itemsPerPage);
            var pages = [];
            var startPage = Math.max($scope.currentPage - 2, 0);
            var endPage = Math.min(startPage + 5, totalPages);

            for (var i = startPage; i < endPage; i++) {
                pages.push(i);
            }

            return pages;
        };

        $scope.formatDuration = function(ms) {
            var minutes = Math.floor(ms / 60000);
            var seconds = ((ms % 60000) / 1000).toFixed(0);
            return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
        };

        $scope.firstPage = function() {
            $scope.currentPage = 0;
        };

        $scope.lastPage = function() {
            $scope.currentPage = Math.ceil($scope.songs.length / $scope.itemsPerPage) - 1;
        };

        $scope.openPopup = function(song) {
            $scope.selectedSong = song;
            $scope.songAttributes.Popolarità = song.Popularity / 100;
            $scope.songAttributes.Ballabilità = song.danceability;
            $scope.songAttributes.Energia = song.energy;
            $scope.songAttributes.Speechiness = song.speechiness;
            $scope.songAttributes.Instrumentalità = song.instrumentalness;
            $scope.songAttributes.Valenza = song.valence;
            $scope.isModalOpen = true;
        };
    
        $scope.closeModal = function() {
            $scope.isModalOpen = false;
        };
    
        $scope.toggleFavorite = function(song) {
            song.isFavorite = !song.isFavorite;
            // Aggiungi logica per gestire i preferiti (salvare nel database, ecc.)
        };
    
        $scope.formatDuration = function(duration_ms) {
            var minutes = Math.floor(duration_ms / 60000);
            var seconds = ((duration_ms % 60000) / 1000).toFixed(0);
            return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
        };

        $scope.addNew = function() {
            console.log("Add new item");
        };
    
        $scope.openMenu = function() {
            console.log("Query menu");
        };
    
        $scope.deleteSong = function(song) {
            console.log("Delete song", song);
        };
    
        $scope.editSong = function(song) {
            console.log("Edit song", song);
        };

        $scope.likeSong = function(song) {
            $http.post('/like_song', { song_id: song._id })
                .then(function(response) {
                    if (response.data.status === 'success') {
                        alert('Song liked successfully!');
                    } else {
                        alert('Error liking song: ' + response.data.message);
                    }
                }, function(error) {
                    alert('Error liking song: ' + error.data.message);
                });
        };
    
        $scope.playSong = function(song) {
            $http.post('/play_song', { song_id: song._id })
                .then(function(response) {
                    if (response.data.status === 'success') {
                        alert('Playing song preview!');
                    } else {
                        alert('Error playing song: ' + response.data.message);
                    }
                }, function(error) {
                    alert('Error playing song: ' + error.data.message);
                });
        };


        $document.on('click', function(event) {
            var isClickedElementChildOfMenu = angular.element(event.target).closest('.relative').length > 0;
            if (!isClickedElementChildOfMenu) {
                $scope.$apply(function() {
                    $scope.menuVisible = false;
                });
            }
        });
    }]);

