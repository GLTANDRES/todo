import firebase from "firebase/app";
import "firebase/app";
import "firebase/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyAJkTfMQjrtwF1OzeKJno46iy0Z5PqAmNQ",
  authDomain: "todo-b0971.firebaseapp.com",
  projectId: "todo-b0971",
});
let db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });

export default db;
