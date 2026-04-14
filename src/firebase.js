// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDpS7on8RzFHctczV_2psHEwDs1KusGjIc",
  authDomain: "streamyy-178ad.firebaseapp.com",
  projectId: "streamyy-178ad",
  storageBucket: "streamyy-178ad.firebasestorage.app",
  messagingSenderId: "974205651438",
  appId: "1:974205651438:web:544d646a95740e300e26ff",
  measurementId: "G-82L6613VEG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);