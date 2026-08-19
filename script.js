import { initializeApp }
    from "https://www.gstatic.com/firebasejs/12.17.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs
}
    from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";




const firebaseConfig = {
    apiKey: "AIzaSyD9YeKvdZ01ZdT4VfyUGvEOnYzf4y9FP14",
    authDomain: "mikaela-dictionary.firebaseapp.com",
    projectId: "mikaela-dictionary",
    storageBucket: "mikaela-dictionary.firebasestorage.app",
    messagingSenderId: "61198533985",
    appId: "1:61198533985:web:cc7cf9e89b0b3e735cb120",
    measurementId: "G-S2HYRQ72PZ"
};




const app = initializeApp(firebaseConfig);

const db = getFirestore(app);




let dictionary = {};



async function loadDictionary() {

    try {

        const querySnapshot = await getDocs(
            collection(db, "questions")
        );

        dictionary = {};

        querySnapshot.forEach((doc) => {

            const data = doc.data();

            if (data.question && data.answer) {

                dictionary[data.question] = data.answer;

            }

        });

        console.log("Dictionary loaded:", dictionary);

    } catch (error) {

        console.error(
            "Error loading dictionary:",
            error
        );

    }
}



function searchWord() {

    let searchInput =
        document.getElementById("searchInput");

    let result =
        document.getElementById("result");


    let sentence =
        searchInput.value
            .toLowerCase()
            .trim()
            .replace(/[?.!,]/g, "");


    if (sentence === "") {

        result.innerHTML =
            "Please enter a question.";

        return;
    }


    let userWords =
        sentence.split(/\s+/);


    let bestMatch = null;

    let highestScore = 0;


    for (let question in dictionary) {

        let questionWords =
            question
                .toLowerCase()
                .split(/\s+/);


        let matchedWords = 0;


        for (let word of userWords) {

            if (questionWords.includes(word)) {

                matchedWords++;

            }

        }


        let score =
            matchedWords / questionWords.length;


        if (score > highestScore) {

            highestScore = score;

            bestMatch = question;

        }

    }


    
    if (
        bestMatch &&
        highestScore >= 0.5
    ) {

        result.innerHTML =
            "<strong>" +
            bestMatch +
            "</strong><br><br>" +
            dictionary[bestMatch];

    } else {

        result.innerHTML =
            "Answer not found.";

    }

}




function showSuggestions() {

    let searchInput =
        document.getElementById("searchInput");

    let suggestions =
        document.getElementById("suggestions");


    let searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    if (searchText === "") {

        suggestions.innerHTML = "";

        return;
    }


    let matches = [];


    for (let question in dictionary) {

        if (question.includes(searchText)) {

            matches.push(question);

        }

    }


    if (matches.length === 0) {

        suggestions.innerHTML =
            "<p>No possible questions found.</p>";

        return;
    }


    suggestions.innerHTML = "";


    matches.forEach(function(question) {

        let suggestion =
            document.createElement("div");


        suggestion.className =
            "suggestion";


        suggestion.textContent =
            question;


        suggestion.onclick =
            function() {

                searchInput.value =
                    question;

                suggestions.innerHTML =
                    "";

                searchWord();

            };


        suggestions.appendChild(
            suggestion
        );

    });

}



async function addWord() {

    let word =
        document.getElementById("wordInput")
        .value
        .toLowerCase()
        .trim()
        .replace(/[?.!,]/g, "");


    let definition =
        document.getElementById("definitionInput")
        .value
        .trim();


    if (
        word === "" ||
        definition === ""
    ) {

        alert(
            "Please enter both the question and answer."
        );

        return;
    }


    try {

     
        const docRef =
            await addDoc(
                collection(db, "questions"),
                {
                    question: word,
                    answer: definition
                }
            );


        console.log(
            "Question added:",
            docRef.id
        );


    
        dictionary[word] =
            definition;


        alert(
            "Question successfully added!"
        );


    
        document.getElementById(
            "wordInput"
        ).value = "";


        document.getElementById(
            "definitionInput"
        ).value = "";


    } catch (error) {

        console.error(
            "Error adding question:",
            error
        );


        alert(
            "Could not save the question.\n\n" +
            error.message
        );

    }

}




loadDictionary();



window.searchWord =
    searchWord;

window.showSuggestions =
    showSuggestions;

window.addWord =
    addWord;