(function() {
    'use strict';

    var app = window.songzee = (window.songzee || {});

    app.songzee = {
        apiKey: 'mlDStpZPbG9VNejA',
        loginStatus: document.querySelector('.login-status')
    };

    var self = app.events = {
        getEvents: function() {
            var dataSelector = document.querySelectorAll('.results li > a');

            for (var i = 0; i < dataSelector.length; i++) {
                dataSelector[i].addEventListener('click', function() {
                    var id  = this.getAttribute('data-id');
                    var url = 'http://api.songkick.com/api/3.0/events.json?location=sk:' + id + '&apikey=mlDStpZPbG9VNejA&min_date=2016-07-30&max_date=2016-07-30';

                    app.main.getJSON(url, function(err, data){
                        if (err != null) {
                            console.log('something went wrong');
                        } else {
                            var results       = data.resultsPage.results.event;
                            app.songzee.store = [];

                            if (results) {
                                self.clearEvents();

                                document.body.className = 'events-open';

                                results.forEach(function(obj) {
                                    app.songzee.store.push([obj.displayName, obj.venue.displayName, obj.location.city]);
                                });

                                self.displayEvents();
                            } else {
                                alert('no events!');
                            }
                        }
                    });
                });
            }
        },

        displayEvents: function() {
            app.songzee.eventsContainer = document.createElement('div');
            var list                    = document.createElement('ul');

            app.songzee.eventsContainer.className = 'events-container';
            list.className = 'events';

            for (var i = 0; i < app.songzee.store.length; i++) {
                var item = document.createElement('li');

                item.appendChild(document.createTextNode(app.songzee.store[i][0]));
                item.innerHTML += '<br /><strong>' + app.songzee.store[i][1] + '</strong>';
                list.appendChild(item);
            }

            app.songzee.eventsContainer.appendChild(list);
            document.body.appendChild(app.songzee.eventsContainer);
        },

        clearEvents: function() {
            if (document.body.classList.contains('events-open')) {
                app.songzee.eventsContainer.innerHTML = '';
            }
        }
    };
}());
