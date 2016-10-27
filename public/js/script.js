// Initialize Firebase
var config = {
  apiKey: "AIzaSyAgEWBu9C4mN65UhsiXuQgss-0Cna7QDzI",
  authDomain: "pair-programming-app-c63af.firebaseapp.com",
  databaseURL: "https://pair-programming-app-c63af.firebaseio.com",
  storageBucket: "pair-programming-app-c63af.appspot.com",
  messagingSenderId: "306543927717"
};
firebase.initializeApp(config);

$(document).ready(function() {
    // This command is used to initialize some elements and make them work properly
    $.material.init();
});
//check if user is signed in
    firebase.auth().onAuthStateChanged(function(user) {
      var locale = window.location.pathname;
      if (user) {
      	if(locale == "/" || locale == "/about"){
      		document.getElementById('reg').innerHTML = "Logout";
      		document.getElementById('reg').setAttribute("href", "#");
	        document.getElementById('call').setAttribute("href", "/dashboard");
	        document.getElementById('call').innerHTML = "Dashboard";
	        document.getElementById('reg').addEventListener("click", function(){
	        	firebase.auth().signOut().then(function() {
				  // Sign-out successful.
				}, function(error) {
				  // An error happened.
				});
	        });
      	}
      	if(locale == "/sign-in"){
      		document.getElementsByTagName('body')[0].style.visibility = "hidden";
      		window.location.href = "/dashboard";
      	}
     
      } 
      else {
      	if(locale == "/dashboard"){
      		//window.location = "/sign-in";
      		window.location.href = "/sign-in";
      	}
        document.getElementById('reg').innerHTML = "Sign In";
      	document.getElementById('reg').setAttribute("href", "/sign-in");
        document.getElementById('call').setAttribute("href", "/sign-in");
        document.getElementById('call').innerHTML = "START HERE";
      }
    });
