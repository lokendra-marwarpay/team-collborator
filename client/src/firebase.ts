import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyB1fH6ISOGTla0kOoWHJDxLG2KgHDaA_vo",
    authDomain: "team-collaborator-52841.firebaseapp.com",
    projectId: "team-collaborator-52841",
    storageBucket: "team-collaborator-52841.firebasestorage.app",
    messagingSenderId: "478258879973",
    appId: "1:478258879973:web:01508022bc910ae55aa30c",
    measurementId: "G-QYT0S4Q522"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
