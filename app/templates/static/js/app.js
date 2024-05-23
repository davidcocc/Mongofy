angular.module('mongofyApp', [])
    .controller('MainController', ['$scope', '$http', function($scope, $http) {
        $scope.darkMode = false;
        $scope.currentPage = 0;
        $scope.currentSort = 'Track Name';
        $scope.reverseSort = false;

        $http.get('/').then(function(response) {
            $scope.songs = response.data;
        });

        $scope.toggleTheme = function() {
            $scope.darkMode = !$scope.darkMode;
        };

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
