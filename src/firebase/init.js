// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBNRlwHmMrzr0BzLzfo-dlH3tEY53DuF7k",
  authDomain: "week7-dda.firebaseapp.com",
  projectId: "week7-dda",
  storageBucket: "week7-dda.firebasestorage.app",
  messagingSenderId: "56980101562",
  appId: "1:56980101562:web:addd00ffa74363d48a2583"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(firebaseApp);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(firebaseApp);

// Export the Firebase services for use in other parts of the application
export { auth, db };
export default firebaseApp; 