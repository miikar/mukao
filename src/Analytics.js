import firebase from 'firebase';

firebase.initializeApp({
    apiKey: "AIzaSyC1srSNTx7WYYnGixIJX_VYWRUoWCmx_KA",
    authDomain: "mukaoapp.firebaseapp.com",
    databaseURL: "https://mukaoapp.firebaseio.com",
    projectId: "mukaoapp",
    storageBucket: "mukaoapp.appspot.com",
    messagingSenderId: "796537592518"
})

const db = firebase.firestore();

const sendIntervalData = (payload) => {
    db.collection("interval").add(payload);
}

export {
    sendIntervalData,
};