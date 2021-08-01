var firebaseConfig = {
    apiKey: "AIzaSyBjSfhWG1tqqBAEwveu5rm-j5RPL7fBOBY",
    authDomain: "my-chat-app-ac3b5.firebaseapp.com",
    projectId: "my-chat-app-ac3b5",
    storageBucket: "my-chat-app-ac3b5.appspot.com",
    messagingSenderId: "783247609528",
    appId: "1:783247609528:web:a402e671cc81648fa4ee4d",
    measurementId: "G-X7MQ40STCL"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  var userImage = "https://nyc.uds.edu.gh/wp-content/uploads/2018/10/dummy-profile.png"

  var db = firebase.firestore();

  var form = document.querySelector('#enterMessage');
  var chatSection = document.querySelector('.chat-section')
  var signOut = document.querySelector('.sign-out')
  var headerImage = document.querySelector('.header-image')
  var headerName = document.querySelector('.header-name')
  var userDetails;

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
     
      var uid = user.uid;
      userDetails = user;
      headerImage.src = user.photoURL;
      headerName.innerText = user.displayName; 
     } else {
      window.location = 'login.html'
    }
  });

  // signout section

  signOut.addEventListener('click',function(e){
    firebase.auth().signOut();
  })

// add message
  form.addEventListener('submit',function(e){
      e.preventDefault()
      let message_value = form.message.value;
      let date = new Date();
      let date_value = `${date.getHours()}:${date.getMinutes()} | ${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`

      db.collection("chats").add({
        UserMessage: message_value,
        user_name: userDetails.displayName,
        user_image: userDetails.photoURL,
        date: date_value,
        uid:userDetails.uid
        
    })
    .then((docRef) => {
        let message_obj = {
        userMessage: message_value,
        user_name: userDetails.displayName,
        user_image: userDetails.photoURL,
        date: date_value,
        uid:userDetails.uid

        }
        addMessageChat(message_obj);
        console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
        console.error("Error occured: ", error);
    });
  })


  getMessages();
  function getMessages(){
    db.collection("chats").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          // console.log(`${doc.id} => ${doc.data().msg}`);
       
      addMessageChat(doc.data());
      });
  });
  }

  function addMessageChat(msg){
    //   creating required elements
      let user_image = document.createElement('img');
      let user_name = document.createElement('h5');
      let message_element = document.createElement('p');
      let date = document.createElement('small');
      let chat_div = document.createElement('div');
      let single_chat = document.createElement('div')


    //  adding values to the created elwments
      user_image.src = msg.user_image;
      message_element.innerText = msg.userMessage;
      user_name.innerText = msg.user_name;
      date.innerText = msg.date;


    //   adding classes
    user_image.classList.add('avatar');
    chat_div.classList.add('message-details');
    single_chat.classList.add('single-chat')
    
    if (msg.uid === userDetails.uid){
      single_chat.classList.add('my-chat')
    }


    //   appending child elements
      chat_div.append(user_name);
      chat_div.append(message_element);
      chat_div.append(date);

      single_chat.append(user_image);
      single_chat.append(chat_div);

      chatSection.append(single_chat);
      chatSection.scrollTop = chatSection.scrollHeight;


  }
  
