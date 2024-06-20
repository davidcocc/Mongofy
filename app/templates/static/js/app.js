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
                case 'pop':
                    queryUrl = '/api/songs/find_pop'
                    break;
                case 'rock':
                    queryUrl = '/api/songs/find_rock'
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
    

        
        function loadGenres() {
            $http.get('/api/genres').then(function(response) {
                $scope.genres = response.data;
                mapGenresToSongs();
            });
        }

        
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
            $scope.selectedSongid = song._id;
            $scope.isModalOpen = true;
        };

        $scope.addSongEditor = function() {
            var addEndpoint = '/insert_song'; 
            var popup = window.open('', '_blank', 'width=400,height=400');
            if (popup) {
                console.log('Popup opened successfully:', popup);
                popup.document.write('<html><head><title>Aggiungi Brano</title></head><body>');
                popup.document.write('<h2>Title: <input type="text" id="title"></h2>');
                popup.document.write('<p>Artist: <input type="text" id="artist"></p>');
                popup.document.write('<button id="addButton">Add</button>');
                popup.document.write('</body></html>');
                
                popup.document.close();  
        
                popup.onload = function() {
                    console.log('Popup loaded successfully');
        
                    popup.document.getElementById('addButton').addEventListener('click', function() {
                        console.log('Add button clicked');
                        var toAddId = (Math.random() + 1).toString(36).substring(7);
                        var toAddTitle = popup.document.getElementById('title').value;
                        var toAddArtist = popup.document.getElementById('artist').value;
                        var toAddDuration = 3.0;
                        var toAddPopularity = 50;
                        var toAddDanceability = 0.5;
                        var toAddEnergy = 0.5;
                        var toAddSpeechiness= 0.5;
                        var toAddInstrumentality = 0.5;
                        var toAddValence = 0.5;
        
                        console.log('Added values:', toAddTitle, toAddArtist, toAddDuration, toAddPopularity, toAddDanceability, toAddEnergy, toAddSpeechiness, toAddInstrumentality, toAddValence);
        
                        var requestData = {
                            'TrackName': toAddTitle,
                            'ArtistName': toAddArtist,
                            'Duration': toAddDuration,
                            'Popularity': toAddPopularity,
                            'Danceability': toAddDanceability,
                            'Energy': toAddEnergy,
                            'Speechiness': toAddSpeechiness,
                            'Instrumentality': toAddInstrumentality,
                            'Valence': toAddValence
                        };
        
                        console.log('Request data:', requestData);
        
                        fetch(addEndpoint, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(requestData)
                        })
                        .then(function(response) {
                            return response.text().then(function(text) {
                                console.log('Response text:', text);
                                try {
                                    return JSON.parse(text);
                                } catch (e) {
                                    throw new Error('Invalid JSON: ' + text);
                                }
                            });
                        })
                        .then(function(data) {
                            console.log('Response data:', data);
                            if (data.status === 'success') {
                                alert('Song added successfully!');
                                popup.close();
                            } else {
                                alert('Failed to add song: ' + data.message);
                            }
                        })
                        .catch(function(error) {
                            console.error('Error:', error);
                            alert('An error occurred while adding the song.');
                        });
                    });
                };
            } else {
                alert('Please enable pop-ups for this site');
            }
        };
        
        $scope.addSong = function() {
            let popup = window.open('', '_blank');
        
            
            if (!popup || popup.closed || typeof popup.closed == 'undefined') {
                alert('Please enable pop-ups for this site');
                return;
            }
        
            
            let _id = toAddId;
            let title = popup.document.getElementById('title').value;
            let artist = popup.document.getElementById('artist').value;
            let toAddDuration = '3.0';
            let toAddPopularity = '50';
            let toAddDanceability = '0.5';
            let toAddEnergy = '0.5';
            let toAddSpeechiness= '0.5';
            let toAddInstrumentality = '0.5';
            let toAddValence = '0.5';
        
            console.log("_id: ", _id)
            console.log("Title:", title);
            console.log("Artist:", artist);
        
            let toAddSong = {
                _id: _id,
                ArtistName: artist,
                TrackName: title,
                Duration: toAddDuration,
                Popularity: toAddPopularity,
                Danceability: toAddDanceability,
                Energy: toAddEnergy,
                Speechiness: toAddSpeechiness,
                Instrumentality: toAddInstrumentality,
                Valence: toAddValence
                
            };
        
            
            popup.close();
        
            
            $http.post('/add_song/' + toAddSong)
                .then(function(response) {
                    if (response.data.status === 'success') {
                        alert('Song added successfully');
                    } else {
                        console.error('Failed to add song: ' + response.data.message);
                    }
                }).catch(function(error) {
                    
                    console.error('Error adding song:', error);
                });
        };

        $scope.openEditor = function(song) {
            
            var updateEndpoint = '/update_song/' + song._id;
        
            
            var popup = window.open(updateEndpoint, '_blank', 'width=400,height=400');
            if (popup) {
                console.log('Popup opened successfully:', popup);
                popup.onload = function() {
                    console.log('Popup loaded successfully');
                    popup.document.write('<html><head><title>Modifica Brano</title></head><body>');
                    popup.document.write('<h2>Title: <input type="text" id="title" value="' + song.TrackName + '"></h2>');
                    popup.document.write('<p>Artist: <input type="text" id="artist" value="' + song.ArtistName + '"></p>');
                    popup.document.write('<button id="saveButton">Save</button>');
                    popup.document.write('</body></html>');
        
                    popup.document.getElementById('saveButton').addEventListener('click', function() {
                        console.log('Save button clicked');
                        // Recupera i valori aggiornati
                        var updatedTitle = popup.document.getElementById('title').value;
                        var updatedArtist = popup.document.getElementById('artist').value;
        
                        console.log('Updated values:', updatedTitle, updatedArtist);
        
                        // Costruisci il corpo della richiesta
                        var requestData = {
                            'TrackName': updatedTitle,
                            'ArtistName': updatedArtist
                        };
        
                        console.log('Request data:', requestData);
        
                        fetch(updateEndpoint, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(requestData)
                        })
                        .then(function(response) {
                            return response.json();
                        })
                        .then(function(data) {
                            console.log('Response:', data);
                            if (data.status === 'success') {
                                alert('Song updated successfully!');
                                popup.close();
                            } else {
                                alert('Failed to update song: ' + data.message);
                            }
                        })
                        .catch(function(error) {
                            console.error('Error:', error);
                            console.log('Response:', error.response); 
                            alert('An error occurred while updating the song.');
                        });
                        
                        
                    });
                };
            } else {
                alert('Please enable pop-ups for this site');
            }
        };


        $scope.updateSong = function(song) {
            let popup = window.open('', '_blank');
        
            if (!popup || popup.closed || typeof popup.closed == 'undefined') {
                alert('Please enable pop-ups for this site');
                return;
            }
        
            let title = popup.document.getElementById('title').value;
            let artist = popup.document.getElementById('artist').value;
        
            console.log("Title:", title);
            console.log("Artist:", artist);
        
            let updatedSong = {
                ArtistName: artist,
                TrackName: title,
            };
        
            popup.close();
        
            $http.put('/update_song/' + song._id, updatedSong)
                .then(function(response) {
                    if (response.data.status === 'success') {
                        alert('Song updated successfully');
                    } else {
                        console.error('Failed to update song: ' + response.data.message);
                    }
                }).catch(function(error) {
                    console.error('Error updating song:', error);
                });
        };
        
        
    
        $scope.closeModal = function() {
            $scope.isModalOpen = false;
        };
    
        $scope.toggleFavorite = function(song) {
            song.isFavorite = !song.isFavorite;
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
            $http.post('/update_song/' + song._id)
            .then(function(response) {
                if (response.data.status === 'success') {
                    console.log('Song updated successfully!');
                    window.location.reload()
                } else {
                    console.error('Failed to update song: ' + response.data.message);
                }
            })
            .catch(function(error) {
                console.error('Error updating song:', error);
            });
        };
    
        $scope.deleteSong = function(song) {
            console.log("Delete song", song);
            $http.post('/delete_song/' + song._id)
            .then(function(response) {
                if (response.data.status === 'success') {
                    console.log('Song deleted successfully!');
                    window.location.reload()
                } else {
                    console.error('Failed to delete song: ' + response.data.message);
                }
            })
            .catch(function(error) {
                // Gestisci gli errori
                console.error('Error deleting song:', error);
            });
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
                        const audioPlayer = document.getElementById('audioPlayer');
                        audioPlayer.src = response.data.preview_url;
                        audioPlayer.style.display = 'block';
                        audioPlayer.play();
                    } else {
                        alert('Error playing song: ' + response.data.message);
                    }
                }, function(error) {
                    alert('Error playing song: ' + error.data.message);
                });
        };

        $scope.stopSong = function() {
            const audioPlayer = document.getElementById('audioPlayer');
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
            audioPlayer.style.display = 'none';
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

