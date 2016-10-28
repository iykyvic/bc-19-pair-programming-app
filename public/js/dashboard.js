window.onload = function(){
  var lang = '',pad,link;
  $('#mymodal').modal('show');
  //style our chat room to material design
  document.getElementById("alertlang").style.display= "none";
  //do user sign out 
  (function logout(){
    document.getElementById('reg').addEventListener("click", function(){
      firebase.auth().signOut().then(function() {
        // Sign-out successful.
      }, function(error) {
        // An error happened.
      });
    });
  })();
  firebase.auth().onAuthStateChanged(function(user) {
    if(user){
      var currentUser = user.uid;
      //get window height
      var h = window.innerHeight - 150;
      //initialize fipad
      function init() {
        // Get Firebase Database reference.
        var firepadRef = getExampleRef();
        if(lang == undefined || lang == null || lang == ""){
          lang = "javascript";
        }
        // Create ACE
        var editor = ace.edit("firepad-container");
        pad = editor;
        editor.setTheme("ace/theme/monokai");
        editor.$blockScrolling = Infinity;
        var session = editor.getSession();
        session.setUseWrapMode(true);
        session.setUseWorker(false);
        session.setMode("ace/mode/" + lang);
        //// Create Firepad.
        
        var firepad = Firepad.fromACE(firepadRef, editor, {
          userId: currentUser,
          defaultText: '//You\'ve created a new coding session\n//you are now writing '+ lang + ' with Firepad!'
        });
        document.getElementById('firepad-container').style.height = h + "px";
        document.getElementById('linked').setAttribute("src", link);
        document.getElementById('linked').textContent = link;
        document.getElementById("alertlang").style.display= "none";
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
          link = window.location + '#' + ref.key; // add it as a hash to the URL.
          var session = firebase.database().ref("users/" + user.uid + "/session");
          session.push({
            link: link, 
             uid:  currentUser
          });
          window.location = '/dashboard' + '#' + ref.key;
        }
        if (typeof console !== 'undefined') {
          //console.log('Firebase data: ', ref.toString());
        }
        return ref;
      }
      //chat init
      (function initChat() {
        // Get a Firebase Database ref
        var chatRef = firebase.database().ref("chat");
        // Create a Firechat instance
        var chat = new FirechatUI(chatRef, document.getElementById("firechat-wrapper"));
        chat.setUser(user.uid, user.displayName);
      })();
      
      init();
      document.getElementById('linked').setAttribute("src", window.location);
      document.getElementById('linked').textContent = window.location;
      //change pad mode on select
      (function langChange(){
        document.getElementById('language').addEventListener('change', function(){
          lang = this.value;
          if(pad != undefined){
            pad.getSession().setMode("ace/mode/" + this.value);
            var current = pad.getValue();
            pad.setValue(current + '\n // you have now changed the current session language to  '+ lang + '!');
          }
        });
      })();

      //start retrieving user sessions
      (function pairPad(){
        //create user database node
        var ref = firebase.database().ref('users/' + user.uid + "/session");

        //listen to database event change
        ref.on("value", function(snapshot) {
          var sessions = snapshot.val();
          for (session in sessions){
            if(currentUser == sessions[session].uid){
              document.getElementById("sessionlinks").innerHTML += '<tr id="'+ session + '"><td>'+ sessions[session].link + '</td>' + '<td><a class="btn btn-success btn-sm" href="' + sessions[session].link + '" target="_blank">GO TO SESSION</a></td><td><button id="'+ session + 'btn" class="btn btn-sm btn-danger">DELETE</button></td></tr>';
              //delete user session on button click
              document.getElementById(session + "btn").addEventListener('click', function(){
                document.getElementById(session).parentNode.removeChild(document.getElementById(session))
                ref.child(session).remove()
                if(window.location == sessions[session].link){
                  window.location = '/dashboard'
                }
              }); 
            }
          }
        },function (error) {
            console.log("Error: " + error.code);
        });
      })();

    }
  });
}
      
