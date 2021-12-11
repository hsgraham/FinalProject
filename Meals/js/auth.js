import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-app.js";

import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged  } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyC5CRMm7oLk_BcgInCQ1D9NMnOUn8FchXI",
    authDomain: "meals-c24c0.firebaseapp.com",
    projectId: "meals-c24c0",
    storageBucket: "meals-c24c0.appspot.com",
    messagingSenderId: "976943404388",
    appId: "1:976943404388:web:83e9981ffe8cd4a41f9671",
    measurementId: "G-5498WSG4N5"
};
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');

const setupUI = (user) => {
    if (user) {
        loggedInLinks.forEach((item) => (item.style.display = "block"));
        loggedOutLinks.forEach((item) => (item.style.display = "none"));
    }
    else {
        loggedInLinks.forEach((item) => (item.style.display = "none"));
        loggedOutLinks.forEach((item) => (item.style.display = "block"));
    }
}

const signupForm = document.querySelector("#signup-form");
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('User logged in: ' + user.email);
        setupUI(user);
    }
    else {
        console.log('user is logged out');
        setupUI();
    }
});



signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("SDF:KJHSD:VFKNJSDF:LKNJSD:FLKJ:SJF:DFJ:JSF");
    const email = signupForm["signup-email"].value;
    const password = signupForm["signup-password"].value;
    console.log(email, password);
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(user);
            const modal = document.querySelector("#modal-signup");
            M.Modal.getInstance(modal).close();
            signupForm.reset();
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorMessage) {
            console.log('error = ' + errorCode, errorMessage);
        }
    })
});

const logout = document.querySelector("#logout");
logout.addEventListener("click", (e) => {
    e.preventDefault();
    signOut(auth)
        .then(() => {
            console.log('signed out');
        })
        .catch((error) => {
            console.log(error);
        })
});

const loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = loginForm["login-email"].value;
    const password = loginForm["login-password"].value;
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(user);
            const modal = document.querySelector("#modal-login");
            M.Modal.getInstance(modal).close();
            loginForm.reset();
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            if (errorMessage) {
                console.log('error = ' + errorCode, errorMessage);
            }
        })
});