(function() {
    'use strict';

    var app = window.songzee = (window.songzee || {});

    app.songzee = {
        apiKey: 'mlDStpZPbG9VNejA',
        loginStatus: document.querySelector('.login-status')
    };

    window.songzee.store = [];

    var self = app.locations = {

        getInput: function() {
            // store elements in variables
            var input = document.querySelector('input'),
                form  = document.querySelector('form');

            // disable submit
            form.addEventListener('submit', function(e){
                e.preventDefault();
            })

            // listen to input field for change
            input.addEventListener('input', function(e) {
                app.query = this.value;

                // get locations if value is greater than 3
                if (app.query.length > 3) {
                    self.getLocations();
                }

                // clear locations list if field is empty
                if (!app.query.length) {
                    self.clearLocations();
                }
            });
        },

        getLocations: function() {
            var url = 'http://api.songkick.com/api/3.0/search/locations.json?query=' + app.query + '&apikey=' + app.songzee.apiKey;

            app.main.getJSON(url, function(err, data){
                if (err != null) {
                    console.log('something went wrong');
                } else {
                    var results = data.resultsPage.results.location;

                    if (results) {
                        results.forEach(function(obj) {
                            window.songzee.store.push([obj.city.displayName + ' ' + obj.metroArea.state.displayName, obj.metroArea.id]);
                        });

                        self.displayLocations();
                    }
                }
            });
        },

        displayLocations: function() {
            app.songzee.locationsContainer =  document.getElementsByClassName('results')[0];
            var list      = document.createElement('ul');

            var ref = firebase.database().ref('users/' + app.songzee.info.id + '/locations/');

            list.className = 'locations';

            for (var i = 0; i < window.songzee.store.length; i++) {
                var item = document.createElement('li');
                var link = document.createElement('a');

                var value = window.songzee.store[i][1];

                self.clearLocations();

                link.setAttribute('data-id', window.songzee.store[i][1]);
                link.appendChild(document.createTextNode(window.songzee.store[i][0]));
                item.appendChild(link);

                ref.once('value', function(snapshot) {

                    if (!snapshot.hasChild(value.toString())) {
                        item.innerHTML += ' <span data-id="' + window.songzee.store[i][1] + '" data-name="' + window.songzee.store[i][0] + '" data-subscribed="false" class="subscribe">Subscribe</span>';
                    }
                    else {
                        item.innerHTML += ' <span data-id="' + window.songzee.store[i][1] + '" data-name="' + window.songzee.store[i][0] + '" data-subscribed="true" class="subscribe">Unsubscribe</span>';
                    }
                });

                list.appendChild(item);
            }

            app.songzee.locationsContainer.appendChild(list);

            app.events.getEvents();
            self.subscribe();
        },

        subscribe: function() {

            var dataSelector = document.querySelectorAll('span.subscribe');
            var ref = firebase.database().ref('users/' + app.songzee.info.id + '/locations/');

            for (var i = 0; i < dataSelector.length; i++) {
                dataSelector[i].addEventListener('click', function update() {

                    var _self = this

                    var data = {
                        id: _self.getAttribute('data-id'),
                        subscribed: _self.getAttribute('data-subscribed'),
                        name: _self.getAttribute('data-name')
                    }

                    var _save = function() {
                        ref.once('value', function(snapshot) {
                            if (!snapshot.hasChild(data.id)) {
                                ref.child(data.id).push({
                                    id: data.id,
                                    name: data.name
                                });

                                _self.innerHTML = 'Unsubscribe';
                                _self.className = 'unsubscribe';
                                _self.setAttribute('data-subscribed', true);
                            }
                        });
                    };

                    var _delete = function() {
                        ref.on('value', function(snapshot) {
                            if (snapshot.hasChild(data.id)) {
                                ref.child(data.id).remove();

                                _self.innerHTML = 'Subscribe';
                                _self.Classname = 'subscribe';
                                _self.setAttribute('data-subscribed', false);
                            }
                        });
                    };

                    if (data.subscribed == 'true') {
                        console.log('test');
                        _delete();
                    } else {
                        _save();
                    }
                });
            }
        },

        clearLocations: function() {
            app.songzee.locationsContainer.innerHTML = '';
        },
    };

    self.getInput();
}());
