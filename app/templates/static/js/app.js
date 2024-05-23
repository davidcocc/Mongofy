angular.module('mongofyApp', [])
    .controller('MainController', ['$scope', '$http', function($scope, $http) {
        $scope.darkMode = false;
        $scope.currentPage = 0;
        $scope.currentSort = 'genre';
        $scope.reverseSort = false;

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

        // Caricamento iniziale dei brani e dei generi
        $http.get('/api/songs').then(function(response) {
            $scope.songs = response.data;
            loadGenres();
        });

        $scope.toggleTheme = function() {
            $scope.darkMode = !$scope.darkMode;
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
            if (($scope.currentPage + 1) * 20 < $scope.songs.length) {
                $scope.currentPage++;
            }
        };

        $scope.prevPage = function() {
            if ($scope.currentPage > 0) {
                $scope.currentPage--;
            }
        };

        $scope.formatDuration = function(ms) {
            var minutes = Math.floor(ms / 60000);
            var seconds = ((ms % 60000) / 1000).toFixed(0);
            return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
        };
    }]);
