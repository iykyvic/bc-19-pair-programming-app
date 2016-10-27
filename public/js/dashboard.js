window.onload = function(){
  var lang = "",pad,link;
  //style our chat room to material design
  document.getElementById("sessionlinks").visibility= "hidden";
  document.getElementById("alertlang").style.display= "none";
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
      lang = "javascript";
      //initialize fipad
      function init() {
        // Get Firebase Database reference.
        var firepadRef = getExampleRef();
        // Create ACE
        var editor = ace.edit("firepad-container");
        pad = editor;
        editor.setTheme("ace/theme/monokai");
        //editor.$blockScrolling = Infinity;
        var session = editor.getSession();
        session.setUseWrapMode(true);
        session.setUseWorker(false);
        session.setMode("ace/mode/" + lang);document.getElementById('language').value = session.getMode();;
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
          window.location = link;
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
      init();
      document.getElementById('linked').setAttribute("src", window.location);
      document.getElementById('linked').textContent = window.location;
      //do the init on button click
      document.getElementById("pair").addEventListener('click', function(e){
        //ititialize new co edit
        e.preventDefault();
        this.disabled = true;
        //lang = document.getElementById('language').value
        if(pad !== undefined && lang !=""){
            pad.setValue("");
            init();
            var session = firebase.database().ref("users/" + user.uid + "/session");
            session.push({
              link: link, 
              lang,lang
            });
            pad.setValue('//You\'ve created a new coding session\n//link: //' + link + '\n you are now writing '+ lang + ' with Firepad!');
            document.getElementById('linked').setAttribute("src", link);
            document.getElementById('linked').textContent = link;
            document.getElementById("alertlang").style.display= "none";
            window.location = link;
        }/*
        else if(lang != ""){
          init();
          pad.setValue('//You\'ve created a new coding session\nlink: //' + link + '\n you are now writing '+ lang + ' with Firepad!');
          var session = firebase.database().ref("users/" + user.uid + "/session");
          session.push({
            link: link,
            lang: lang,
          });
          document.getElementById('linked').setAttribute("src", link);
          document.getElementById('linked').textContent = link;
          document.getElementById("alertlang").style.display = "none";
          console.log(link)
          window.location = link;
        }*/
        else if(lang == ""){
            document.getElementById("alertlang").style.display= "block";
        }
      });
      document.getElementById('language').addEventListener('change', function(){
        lang = this.value;
          pad.getSession().setMode("ace/mode/" + this.value);
          var current = pad.getValue();
          pad.setValue(current + '\n // you have now changed the current session language to  '+ lang + '!');
      });
      //start retrieving user sessions
      var ref = firebase.database().ref('users/' + user.uid + "/session");
      ref.on("value", function(snapshot) {
        var sessions = snapshot.val();
        for (session in sessions){
          document.getElementById("sessionlinks").innerHTML += '<tr id="'+ session + '"><td>' + sessions[session].lang + '</td><td>'+ sessions[session].link + '</td>' + '<td><a class="btn btn-success btn-sm" href="' + sessions[session].link + '">GO TO SESSION</a></td><td><button id="'+ session + 'btn" class="btn btn-sm btn-danger">DELETE</button></td></tr>';
            //console.log(sessions[session].lang, sessions[session].link)
           document.getElementById(session + "btn").addEventListener('click', function(){
            document.getElementById(session).parentNode.removeChild(document.getElementById(session));
            //var sessiondel = firebase.database().ref("users/" + user.uid + "/session");
            //sessiondel.child(session)
           }); 
        }
      }, function (error) {
         console.log("Error: " + error.code);
      });
      //show link on share click
      document.getElementById("message").addEventListener('click', function(){
        if(document.getElementById("sessionlinks").visibility == "hidden"){
          document.getElementById("sessionlinks").visibility= "visible";
        }
        else{
            document.getElementById("sessionlinks").visibility= "hidden";
        }
      })
    }
  });
}
      
