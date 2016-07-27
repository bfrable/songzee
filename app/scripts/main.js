(function(){

    'use strict';

    var app = {
        apiKey: 'mlDStpZPbG9VNejA'
    };

    var getJSON = function(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("get", url, true);
        xhr.responseType = "json";

        xhr.onload = function() {
          var status = xhr.status;
          if (status == 200) {
            callback(null, xhr.response);
          } else {
            callback(status);
          }
        };

        xhr.send();
    };

    var locations = {
        getInput: function() {
            var input = document.querySelector('input');

            input.addEventListener('input', function() {
                app.query = this.value;

                if (app.query.length > 3) {
                    locations.getLocations();
                }

                if (!app.query.length) {
                    locations.clearLocations();
                }
            });
        },

        getLocations: function() {
            var url = 'http://api.songkick.com/api/3.0/search/locations.json?query=' + app.query + '&apikey=' + app.apiKey;

            getJSON(url, function(err, data){
                if (err != null) {
                    console.log('something went wrong');
                } else {
                    var results = data.resultsPage.results.location;
                    app.store = [];

                    if (results) {
                        results.forEach(function(obj) {
                            app.store.push([obj.city.displayName + ' ' + obj.metroArea.state.displayName, obj.metroArea.id]);
                        });

                        locations.displayLocations();
                    }
                }
            });
        },

        displayLocations: function() {
            app.locationsContainer =  document.getElementsByClassName('results')[0];
            var list      = document.createElement('ul');

            list.className = 'locations';

            for (var i = 0; i < app.store.length; i++) {
                var item = document.createElement('li');
                var link = document.createElement('a');

                locations.clearLocations();
                link.setAttribute('data-id', app.store[i][1]);
                link.appendChild(document.createTextNode(app.store[i][0]));
                item.appendChild(link);
                list.appendChild(item);
            }

            app.locationsContainer.appendChild(list);

            events.getEvents();
        },

        clearLocations: function() {
            app.locationsContainer.innerHTML = '';
        }
    };

    var events = {
        getEvents: function() {
            var dataSelector = document.querySelectorAll('.results a');

            for (var i = 0; i < dataSelector.length; i++) {
                dataSelector[i].addEventListener('click', function() {
                    var id  = this.getAttribute('data-id');
                    var url = 'http://api.songkick.com/api/3.0/events.json?location=sk:' + id + '&apikey=mlDStpZPbG9VNejA&min_date=2016-07-28&max_date=2016-07-28';

                    getJSON(url, function(err, data){
                        if (err != null) {
                            console.log('something went wrong');
                        } else {
                            var results = data.resultsPage.results.event;

                            app.store = [];

                            if (results) {
                                events.clearEvents();

                                document.body.className = 'events-open';

                                results.forEach(function(obj) {
                                    app.store.push([obj.displayName, obj.venue.displayName, obj.location.city]);
                                });

                                events.displayEvents();
                            } else {
                                alert('no events!');
                            }
                        }
                    });
                });
            }
        },

        displayEvents: function() {
            app.eventsContainer = document.createElement('div');
            var list      = document.createElement('ul');

            app.eventsContainer.className = 'events-container';
            list.className                = 'events';

            for (var i = 0; i < app.store.length; i++) {
                var item = document.createElement('li');

                item.appendChild(document.createTextNode(app.store[i][0]));
                list.appendChild(item);
            }

            app.eventsContainer.appendChild(list);
            document.body.appendChild(app.eventsContainer);
        },

        clearEvents: function() {
            if (document.body.classList.contains('events-open')) {
                app.eventsContainer.innerHTML = '';
            }
        }
    }

    var init = function() {
        locations.getInput();
    };

    init();

}());
