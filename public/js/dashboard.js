window.onload = function(){
  var lang = "",pad,link;
  //style our chat room to material design
  //document.getElementById("pair").disabled = true;
  //do logout link
  document.getElementById('reg').addEventListener("click", function(){
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }, function(error) {
      // An error happened.
    });
  });
  firebase.auth().onAuthStateChanged(function(user) {
    if(user){
      var currentUser = user.uid;
      //get window height
      var h = window.innerHeight - 150;
      //initialize fipad
      function init() {
        // Get Firebase Database reference.
        var firepadRef = getExampleRef();
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
          defaultText: '//You\'ve created a new coding session\n//link: ' + link + '\n// you are now writing '+ lang + ' with Firepad!'
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
          link = window.location + '#' + ref.key; // add it as a hash to the URL.
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
      
      initChat(user);

      if((window.location.href).indexOf("#") == "-1"){
          //document.getElementById("pair").disabled = false;
      }
      else{
        //document.getElementById("pair").disabled = true;
      }
      document.getElementById("pair").addEventListener('click', function(e){
        //ititialize new co edit
        e.preventDefault();
        //lang = document.getElementById('language').value
        if(pad !== undefined){
            pad.setValue("");
            init();
            var session = firebase.database().ref("users/" + user.uid + "/session");
            session.push({
              link: link, 
              lang,lang
            });
            pad.setValue('//You\'ve created a new coding session\n//link: //' + link + '\n you are now writing '+ lang + ' with Firepad!');
        }
        else{
          init();
          pad.setValue('//You\'ve created a new coding session\nlink: //' + link + '\n you are now writing '+ lang + ' with Firepad!');
          var session = firebase.database().ref("users/" + user.uid + "/session");
          session.push({
            link: link,
            lang: lang,
          });
        }
      });
      document.getElementById('language').addEventListener('change', function(){
        lang = this.value
        if(pad !== undefined){
          pad.getSession().setMode("ace/mode/" + this.value);
          var current = pad.getValue();
          pad.setValue(current + '\n // you have now changed the current session language to  '+ lang + '!');
        }
      });
      //start retrieving user sessions
      var ref = firebase.database().ref();
      ref.on("value", function(snapshot) {
         console.log(snapshot.val().users[user.uid]);
      }, function (error) {
         console.log("Error: " + error.code);
      });
    }
  });
}
      
