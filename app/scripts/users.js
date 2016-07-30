(function() {
    'use strict';

    var app = window.songzee = (window.songzee || {});

    app.songzee = {
        apiKey: 'mlDStpZPbG9VNejA',
        loginStatus: document.querySelector('.login-status')
    };

    var self = app.users = {
        auth: function() {
            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                    window.songzee.loggedIn = true;
                    self.getUserProfile();
                }
            });
        },

        getUserProfile: function() {

            console.log('user profile init');

            app.songzee.info = {};
            app.songzee.user = firebase.auth().currentUser;
            var status = document.querySelector('.login-status');

            if (app.songzee.user != null) {
                app.songzee.info.name     = app.songzee.user.displayName;
                app.songzee.info.email    = app.songzee.user.email;
                app.songzee.info.photoUrl = app.songzee.user.photoURL;
                app.songzee.info.id       = app.songzee.user.uid;

                app.songzee.loginStatus.setAttribute('data-loggedIn', true);
                app.songzee.loginStatus.innerHTML = '<div class="profile-photo"><img src="' + app.songzee.info.photoUrl + '" /></div>'

            }
        },

        checkLogin: function() {
            if (window.songzee.loggedIn) {
                self.getData();
            }
        },

        getLocations: function() {
            firebase.database().ref('/users/' + app.songzee.info.id + '/locations').on('value', function(snapshot){
                var locations = snapshot.val();
                console.log(snapshot.val());

                for(var u in locations) {

                    for(var location in locations[u]) {

                        console.log(locations[u][location].name);
                    }
                }
            });
        },

        getEvents: function() {
            console.log('events');
        },

        getData: function() {
            self.getLocations();
            self.getEvents();
        },
    }

    var init = function() {
        self.auth();

        setTimeout(function(){
            self.checkLogin();
        }, 1000);
    };

    init();
}());
