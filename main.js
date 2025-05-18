import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-analytics.js";
import { getAuth} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

  const firebaseConfig = {
    apiKey: "AIzaSyCa0nYZtywHmfTtabCnq8IMt82IiyvDcls",
    authDomain: "the-internet-memes-project.firebaseapp.com",
    projectId: "the-internet-memes-project",
    storageBucket: "the-internet-memes-project.firebasestorage.app",
    messagingSenderId: "994925492834",
    appId: "1:994925492834:web:da0c3228ecfa69e4d16f3b",
    measurementId: "G-VHBNFST01E"
  };


const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
export default auth




