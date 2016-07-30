// Initialize Firebase
var setup = {
  apiKey: "AIzaSyD9ILn_g2_ivqAPw9odhB-ao_cQi6Qvsxk",
  authDomain: "songzee-5227e.firebaseapp.com",
  databaseURL: "https://songzee-5227e.firebaseio.com",
  storageBucket: "",
};

var fb = {};

firebase.initializeApp(setup);

var provider = new firebase.auth.GoogleAuthProvider();

firebase.auth().onAuthStateChanged(function(user) {
  if (!user) {
      firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        fb.token = result.credential.accessToken;
        // The signed-in user info.
        fb.user = result.user;
      }).catch(function(error) {
        // Handle Errors here.
        fb.errorCode = error.code;
        fb.errorMessage = error.message;
        // The email of the user's account used.
        fb.email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        fb.credential = error.credential;
      });
  }
});
