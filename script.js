import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";



const firebaseConfig = {
    apiKey: "AIzaSyD9YeKvdZ01ZdT4VfyUGvEOnYzf4y9FP14",
    authDomain: "mikaela-dictionary.firebaseapp.com",
    projectId: "mikaela-dictionary",
    storageBucket: "mikaela-dictionary.firebasestorage.app",
    messagingSenderId: "61198533985",
    appId: "1:61198533985:web:cc7cf9e89b0b3e735cb120",
    measurementId: "G-S2HYRQ72PZ"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);




let dictionary = {};




async function loadQuestions() {

    try {

        const querySnapshot =
            await getDocs(
                collection(db, "questions")
            );


        dictionary = {};


        querySnapshot.forEach((doc) => {

            const data = doc.data();

            if (data.question && data.answer) {

                dictionary[data.question] =
                    data.answer;

            }

        });


        console.log(
            "Dictionary loaded:",
            dictionary
        );


    } catch (error) {

        console.error(
            "Error loading questions:",
            error
        );


        document.getElementById("result").innerHTML =
            "<p class='error-message'>" +
            "Could not load questions." +
            "</p>";

    }
}





function searchWord() {

    const searchInput =
        document.getElementById("searchInput");

    const result =
        document.getElementById("result");


    const search =
        searchInput.value
            .toLowerCase()
            .trim()
            .replace(/[?.!,]/g, "");


    if (search === "") {

        result.innerHTML =
            "Please enter a question.";

        return;
    }


    let foundQuestion = null;
    let foundAnswer = null;


  
    for (const question in dictionary) {

        const cleanQuestion =
            question
                .toLowerCase()
                .replace(/[?.!,]/g, "");


        if (cleanQuestion === search) {

            foundQuestion = question;
            foundAnswer = dictionary[question];

            break;
        }


        
        if (cleanQuestion.includes(search)) {

            foundQuestion = question;
            foundAnswer = dictionary[question];

            break;
        }


       
        const searchWords =
            search.split(/\s+/);

        const questionWords =
            cleanQuestion.split(/\s+/);


        const allWordsFound =
            searchWords.every(word =>
                questionWords.includes(word)
            );


        if (allWordsFound) {

            foundQuestion = question;
            foundAnswer = dictionary[question];

            break;
        }
    }


    if (foundQuestion) {

        result.innerHTML =
            "<strong>" +
            foundQuestion +
            "</strong>" +
            "<br><br>" +
            foundAnswer;

    } else {

        result.innerHTML =
            "Answer not found.";

    }
}



async function addWord() {

    const wordInput =
        document.getElementById("wordInput");

    const definitionInput =
        document.getElementById("definitionInput");

    const result =
        document.getElementById("result");


    const word =
        wordInput.value
            .toLowerCase()
            .trim()
            .replace(/[?.!,]/g, "");


    const definition =
        definitionInput.value.trim();


    if (word === "" || definition === "") {

        result.innerHTML =
            "<p class='error-message'>" +
            "Please enter both the question and answer." +
            "</p>";

        return;
    }


    
    result.innerHTML =
        "<p class='saving-message'>" +
        "Saving question..." +
        "</p>";


    try {

       
        const docRef =
            await addDoc(
                collection(db, "questions"),
                {
                    question: word,
                    answer: definition,
                    createdAt: new Date()
                }
            );


       
        dictionary[word] =
            definition;


        console.log(
            "Successfully saved:",
            docRef.id
        );


        result.innerHTML =
            "<p class='success-message'>" +
            "✓ Question successfully saved!" +
            "</p>";


       
        wordInput.value = "";
        definitionInput.value = "";


    } catch (error) {

        console.error(
            "Firebase save error:",
            error
        );


        result.innerHTML =
            "<p class='error-message'>" +
            "✗ Question could not be saved." +
            "<br><small>" +
            error.message +
            "</small>" +
            "</p>";

    }
}




window.searchWord = searchWord;
window.addWord = addWord;



loadQuestions();
