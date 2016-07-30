(function(){
    'use strict';

    var app = window.songzee = (window.songzee || {});
    
    var self = app.main = {

        getJSON: function(url, callback) {
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
        },
    };

    return self;

}());
