window.onload = function(){

  //do logout link
  document.getElementById('reg').addEventListener("click", function(){
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }, function(error) {
      // An error happened.
    });
  });
  //get current user
  firebase.auth().onAuthStateChanged(function(user) {
    if(user){
      var currentUser = user.uid;
      //get window height
      var h = window.innerHeight - 90;
      //initialize fipad
      function init() {
        // Get Firebase Database reference.
        var firepadRef = getExampleRef();
        // Create ACE
        var editor = ace.edit("firepad-container");
        editor.setTheme("ace/theme/monokai");
        //editor.$blockScrolling = Infinity;
        var session = editor.getSession();
        session.setUseWrapMode(true);
        session.setUseWorker(false);
        session.setMode("ace/mode/javascript");
        //// Create Firepad.
        
        var firepad = Firepad.fromACE(firepadRef, editor, {
          userId: currentUser,
          defaultText: '// JavaScript Editing with Firepad!\nfunction go() {\n  var message = "Hello, world.";\n  console.log(message);\n}'
        });
        document.getElementById('firepad-container').style.height = h + "px";
      }
      // Helper to get hash from end of URL or generate a random one.
      function getExampleRef() {
        var ref = firebase.database().ref();
        var hash = window.location.hash.replace(/#/g, '');
        if (hash) {
          ref = ref.child(hash);
        } 
        else {
          ref = ref.push(); // generate unique location.
          window.location = window.location + '#' + ref.key; // add it as a hash to the URL.
        }
        if (typeof console !== 'undefined') {
          //console.log('Firebase data: ', ref.toString());
        }
        return ref;
      }
      //chat init
        function initChat(user) {
          // Get a Firebase Database ref
          var chatRef = firebase.database().ref("chat");
          // Create a Firechat instance
          var chat = new FirechatUI(chatRef, document.getElementById("firechat-wrapper"));
          chat.setUser(user.uid, user.displayName);
        }
      init();
      initChat(user);
      document.getElementById("pair").addEventListener('click', function(){
        //ititialize new co edit
           
      });
    }
  });
}
      
