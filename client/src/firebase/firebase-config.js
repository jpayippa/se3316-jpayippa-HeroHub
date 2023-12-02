import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
    apiKey: "AIzaSyDtmrZch-Ql3BwE2qriJG2q7rbR0KHQg8s",
    authDomain: "se3316-jpayippa-lab4.firebaseapp.com",
    projectId: "se3316-jpayippa-lab4",
    storageBucket: "se3316-jpayippa-lab4.appspot.com",
    messagingSenderId: "990436535152",
    appId: "1:990436535152:web:efa5d7c16e16cd6167fdb5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
