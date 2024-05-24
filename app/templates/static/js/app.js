angular.module('mongofyApp', [])
    .controller('MainController', ['$scope', '$http', '$document', function($scope, $http, $document) {
        $scope.darkMode = false;
        $scope.currentPage = 0;
        $scope.currentSort = 'TrackName';
        $scope.reverseSort = false;
        $scope.searchType = 'genre';
        $scope.searchQuery = '';
        $scope.itemsPerPage = 20; // Numero di elementi per pagina

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
    }]);
