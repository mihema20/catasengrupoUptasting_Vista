const firebaseConfig = {
	apiKey: "AIzaSyDW64hc9sDOPpXwe_UuUMhIY1ryGMpdIXw",
    authDomain: "catasengrupouptasting.firebaseapp.com",
    projectId: "catasengrupouptasting",
    storageBucket: "catasengrupouptasting.appspot.com",
    messagingSenderId: "666633230836",
    appId: "1:666633230836:web:2744cd1fb5c3ae124d81a1"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();