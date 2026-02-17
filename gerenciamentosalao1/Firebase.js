import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyCVOSZPrtYGbdvcIvGE6Y6cuI5RygnqsM",
  authDomain: "aplicativoreactnative-3e139.firebaseapp.com",
  databaseURL: "https://aplicativoreactnative-3e139-default-rtdb.firebaseio.com",
  projectId: "aplicativoreactnative-3e139",
  storageBucket: "aplicativoreactnative-3e139.appspot.com",
  messagingSenderId: "232737014416",
  appId: "1:232737014416:web:83e3875db00d0f73a68e15"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;