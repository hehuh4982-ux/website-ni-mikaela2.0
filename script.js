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

    let result =
        document.getElementById("result");


   
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

       
        const docRef = await addDoc(
            collection(db, "questions"),
            {
                question: word,
                answer: definition
            }
        );


        dictionary[word] =
            definition;


    
        result.innerHTML =
            "<p class='success-message'>" +
            "✓ Question successfully saved!" +
            "</p>";


        console.log(
            "Successfully saved:",
            docRef.id
        );


       
        document.getElementById(
            "wordInput"
        ).value = "";

        document.getElementById(
            "definitionInput"
        ).value = "";


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
