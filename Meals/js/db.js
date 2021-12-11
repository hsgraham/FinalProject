// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-app.js";
import { getFirestore, collection, getDocs, getDoc, addDoc, doc, deleteDoc, query, where, updateDoc, onSnapshot
    , enableIndexedDbPersistence } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const db = getFirestore(app);

const mealList = document.querySelector('#meal_list');

const updateButton = document.querySelector('#update_button');
const cancelButton = document.querySelector('#cancel_button');

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

$('#update_button').hide();
$('#cancel_button').hide();
//printMeals();


async function getMeals(db) {
    const mealsCol = collection(db, 'Recipes');
    const mealSnapshot = await getDocs(mealsCol);
    const mealList = mealSnapshot.docs.map(doc => doc.data());
    return mealList;
}

enableIndexedDbPersistence(db)
  .catch((err) => {
      if (err.code == 'failed-precondition') {
          console.log('persistence failed');
      } else if (err.code == 'unimplemented') {
        console.log('persistence is not valid');
      }
  });


const unsub = onSnapshot(collection(db, "Recipes"), (doc) => {
    //console.log(doc.docChanges());
    doc.docChanges().forEach((change) => {
        console.log(change, change.doc.data(), change.doc.id);
        if (change.type === "added") {
            renderMeal(change.doc);
        }
        if (change.type === "removed") {
            
        }
    })
});




function renderMeal(dc) {
    let li = document.createElement("li");
    let recipe_name = document.createElement("span");
    let description = document.createElement("p");
    let edit = document.createElement("a");
    let cross = document.createElement('a');


    li.setAttribute('data-id', dc.id);
    li.setAttribute('class', 'collection-item avatar');
    recipe_name.textContent = dc.data().recipe_name;
    recipe_name.setAttribute('class', 'title');
    description.textContent = dc.data().description;
    edit.setAttribute('class', 'waves-effect waves-light btn-small');
    edit.textContent = 'edit';
    cross.setAttribute('class', 'secondary-content');
    cross.setAttribute('href', '#');
    cross.textContent = 'X';

    li.appendChild(recipe_name);
    li.appendChild(description);
    li.appendChild(edit);
    li.appendChild(cross);

    mealList.appendChild(li);

    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        deleteDoc(doc(db, "Recipes", id))
        printMeals();
    })

    edit.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        console.log('editing = ' + id);
        editRecipe(id);
    })
}

updateButton.addEventListener('click', (e) => {
        e.stopPropagation();
        updateRecipe();
        $('#submit_button').show();
        $('#update_button').hide();
        $('#cancel_button').hide();
        $('#recipe_name').val('');
        $('#description').val('');
        printMeals();		
})

cancelButton.addEventListener('click', (e) => {
    e.stopPropagation();
    cancelEdit();
})

function cancelEdit() {
    $('#submit_button').show();
    $('#update_button').hide();
    $('#cancel_button').hide();
    $('#recipe_name').val('');
    $('#description').val('');
}

async function editRecipe(id) {
    let docRef = doc(db, "Recipes", id);
    let docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        $('#submit_button').hide();
        $('#update_button').show();
        $('#cancel_button').show();

        $('#recipe_name').val(docSnap.data().recipe_name);
        $('#description').val(docSnap.data().description);
        $('#doc_id').val(id);
    } 
}

async function updateRecipe() {
    let myid = $('#doc_id').val();
    const upDoc = doc(db, "Recipes", myid);

    updateDoc(upDoc, {
         recipe_name: $('#recipe_name').val()
         , description: $('#description').val()
    })
}

const form = document.querySelector('#add_meal_form');
form.addEventListener(('submit'), (e) => {
    e.preventDefault();
    const docRef = addDoc(collection(db, "Recipes"), {
        description: form.description.value,
        recipe_name: form.recipe_name.value
    })
    $('#recipe_name').val('');
    $('#description').val('');
    //printMeals();
});

function printMeals() {
    $('#meal_list').html('');
    getDocs(collection(db, "Recipes")).then((snapshot) => {
        snapshot.forEach((doc) => {
            renderMeal(doc)
        })
    })	
}



document.addEventListener("DOMContentLoaded", function(){
    var modals = document.querySelectorAll(".modal");
    M.Modal.init(modals);

    var items = document.querySelectorAll(".collapsible");
    M.Collapsible.init(items);
})