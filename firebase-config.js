import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

export const firebaseConfig = {
    apiKey: "AIzaSyC8CVZ0YhDE7iJxD4-Os2ScyRcPNgJ4tUc",
    authDomain: "controle-doc-911fc.firebaseapp.com",
    projectId: "controle-doc-911fc",
    storageBucket: "controle-doc-911fc.firebasestorage.app",
    messagingSenderId: "485010489036",
    appId: "1:485010489036:web:3e56eff4d94b57009e8c69",
    measurementId: "G-2B06P2BXZL"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
