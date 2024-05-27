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
            $scope.selectedSongid = song._id;
            $scope.isModalOpen = true;
        };

        $scope.openEditor = function(song) {
            // URL dell'endpoint Flask per l'aggiornamento della canzone
            var updateEndpoint = '/update_song/' + song._id;
        
            // Apri una finestra popup solo se è consentito dal browser
            var popup = window.open(updateEndpoint, '_blank', 'width=400,height=400');
            if (popup) {
                console.log('Popup opened successfully:', popup);
                popup.onload = function() {
                    console.log('Popup loaded successfully');
                    // Carica il contenuto nella finestra popup
                    popup.document.write('<html><head><title>Modifica Brano</title></head><body>');
                    popup.document.write('<h2>Title: <input type="text" id="title" value="' + song.TrackName + '"></h2>');
                    popup.document.write('<p>Artist: <input type="text" id="artist" value="' + song.ArtistName + '"></p>');
                    popup.document.write('<button id="saveButton">Save</button>');
                    popup.document.write('</body></html>');
        
                    // Aggiungi un evento click al pulsante Save
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
        
                        // Effettua una richiesta PUT all'endpoint Flask
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
                            // Gestisci la risposta
                            console.log('Response:', data);
                            if (data.status === 'success') {
                                alert('Song updated successfully!');
                                // Chiudi la finestra popup dopo l'aggiornamento
                                popup.close();
                            } else {
                                alert('Failed to update song: ' + data.message);
                            }
                        })
                        .catch(function(error) {
                            console.error('Error:', error);
                            console.log('Response:', error.response); // Output dettagliato della risposta
                            alert('An error occurred while updating the song.');
                        });
                        
                        
                    });
                };
            } else {
                alert('Please enable pop-ups for this site');
            }
        };
        

        $scope.addSongEditor = function(song) {
            let popup = window.open('', '_blank', 'width=400,height=400');
            popup.document.write('<html><head><title>Aggiungi Brano</title></head><body>');
            popup.document.write('<h2>Title: <input type="text" id="title" value="' + song.TrackName + '"></h2>');
            popup.document.write('<p>Artist: <input type="text" id="artist" value="' + song.ArtistName + '"></p>');
            popup.document.write('<p>Genres: <input type="text" id="genres" value="' + song.Genres + '"></p>');
            popup.document.write('<p>Duration: ' + song.duration_ms + ' ms</p>');
            popup.document.write('<p>Popularity: ' + song.Popularity + '</p>');
            popup.document.write('<p>Danceability: ' + song.danceability + '</p>');
            popup.document.write('<p>Energy: ' + song.energy + '</p>');
            popup.document.write('<p>Speechiness: ' + song.speechiness + '</p>');
            popup.document.write('<p>Instrumentalness: ' + song.instrumentalness + '</p>');
            popup.document.write('<p>Valence: ' + song.valence + '</p>');
            popup.document.write('<button onclick="window.opener.updateSong(' + song.id + ')">Save</button>');
            popup.document.write('</body></html>');
        };

        $scope.updateSong = function(song) {
            // Recupera il riferimento al popup
            let popup = window.open('', '_blank');
        
            // Verifica se il popup è stato correttamente aperto
            if (!popup || popup.closed || typeof popup.closed == 'undefined') {
                alert('Please enable pop-ups for this site');
                return;
            }
        
            // Recupera i valori dal popup
            let title = popup.document.getElementById('title').value;
            let artist = popup.document.getElementById('artist').value;
            let genres = popup.document.getElementById('genres').value;
        
            console.log("Title:", title);
            console.log("Artist:", artist);
            console.log("Genres:", genres);
        
            let updatedSong = {
                ArtistName: artist,
                TrackName: title,
                Genres: genres
                // Aggiungi altri campi se necessario
            };
        
            // Chiudi il popup dopo aver recuperato i valori
            popup.close();
        
            // Invia la richiesta di aggiornamento al backend
            $http.put('/update_song/' + song._id, updatedSong)
                .then(function(response) {
                    if (response.data.status === 'success') {
                        alert('Song updated successfully');
                    } else {
                        console.error('Failed to update song: ' + response.data.message);
                    }
                }).catch(function(error) {
                    // Gestisci gli errori
                    console.error('Error updating song:', error);
                });
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
                // Gestisci gli errori
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

