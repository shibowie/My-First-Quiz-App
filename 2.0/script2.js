const startButton = document.querySelector("#start-btn");
const questionElement = document.querySelector("#question");
const answerButtons = document.querySelector("#answer-buttons");
const nextButton = document.querySelector("#next-btn");
const questionContainer = document.querySelector("#question-container");
const showResultBtn = document.querySelector("#show-results-btn");
const resultContainer = document.querySelector("#result-container");
const darkModeToggle = document.querySelector(".switch input[type='checkbox']");

darkModeToggle.addEventListener("click", darkMode);
startButton.addEventListener("click", startGame);
nextButton.addEventListener("click", nextQuestion);
showResultBtn.addEventListener("click", showResults);

let score = 0;
let currentQuestionIndex = 0;
let userAnswers = [];


function darkMode() {
    document.body.classList.toggle("dark-mode-body");
    document.querySelector(".container").classList.toggle("dark-mode-container");
    darkModeToggle.classList.toggle("dark-mode-btn");
}

function startGame() {
    startButton.classList.add("hide");
    nextButton.classList.remove("hide");
    questionContainer.classList.remove("hide");

    showQuestion(questionsArr[currentQuestionIndex]);
}

function countPoints() {
    score = 0;

    userAnswers.forEach(item => {
        item.answers.forEach(answer => {
            if (answer.correct && answer.selected) {
                score++;
            }
        });
    });
}

function saveAnswer(questionIndex) {
    const checkedInputs = [
        ...document.querySelectorAll('[name="answer"]:checked')
    ];

    const answers = questionsArr[questionIndex].answers.map((answer, index) => {
        const wasSelected = checkedInputs.some(
            input => parseInt(input.id.replace("answer", "")) === index
        );

        return {
            text: answer.text || answer.img || "unknown",
            correct: answer.correct,
            selected: wasSelected
        };
    });

    userAnswers.push({
        question: questionsArr[questionIndex].question,
        answers
    });
}

function nextQuestion() {
    saveAnswer(currentQuestionIndex);

    if (currentQuestionIndex === questionsArr.length - 1) {
        showResults();
        return;
    }

    currentQuestionIndex++;
    showQuestion(questionsArr[currentQuestionIndex]);
}

function showQuestion(question) {
    questionElement.innerText = question.question;
    answerButtons.innerHTML = "";

    question.answers.forEach((answer, index) => {
        if (question.type === "imageChoice") {
            const input = document.createElement("input");
            input.type = "radio";
            input.name = "answer";
            input.id = "answer" + index;
            input.classList.add("radio-img");
            input.dataset.correct = answer.correct;

            const label = document.createElement("label");
            label.htmlFor = input.id;

            const img = document.createElement("img");
            img.src = answer.img;
            img.classList.add("img-answer");
            label.appendChild(img);

            answerButtons.append(input, label);
        } else {
            const button = document.createElement("input");
            const answerType = question.type === "oneCorrect" ? "radio" : "checkbox";
            button.type = answerType;
            button.name = "answer";
            button.id = "answer" + index;
            button.classList.add("buttons");
            button.dataset.correct = answer.correct;

            const label = document.createElement("label");
            label.htmlFor = button.id;
            label.innerText = answer.text;
            
            answerButtons.append(button, label);
        }
    });
}

function maxPoints() {
    return questionsArr
        .flatMap(question => question.answers)
        .filter(answer => answer.correct)
        .length;
}

function setColourGrade() {
    const max = maxPoints();
    const percent = ((score / max) * 100);
    
    if (percent < 50) {
        resultContainer.style.color = "crimson";
        return "Not good enough!";
    } else if (percent < 75) {
        resultContainer.style.color = "chocolate";
        return "Acceptable";
    } else {
        resultContainer.style.color = "mediumseagreen";
        return "Well done!";
    }
}

function renderReview() {
    const container = document.querySelector("#results");
    if (!container) return;

    container.innerHTML = "";

    userAnswers.forEach(item => {
        const qDiv = document.createElement("div");
        qDiv.classList.add("review-question");

        const h4 = document.createElement("h4");
        h4.innerText = item.question;
        qDiv.appendChild(h4);

        const ul = document.createElement("ul");

        item.answers.forEach(answer => {
            const li = document.createElement("li");
            li.innerText = answer.text;

            if (answer.correct && answer.selected) {
                li.style.color = "mediumseagreen";
                li.innerText += " ✔ (ditt svar)";
            }
            else if (!answer.correct && answer.selected) {
                li.style.color = "crimson";
                li.innerText += " ✖ (ditt svar)";
            }
            else if (answer.correct && !answer.selected) {
                li.style.color = "dodgerblue";
                li.innerText += " ✔ (rätt svar)";
            }

            ul.appendChild(li);
        });

        qDiv.appendChild(ul);
        container.appendChild(qDiv);
    });
}

function showResults() {
    countPoints();
    renderReview();

    nextButton.classList.add("hide");
    questionContainer.classList.add("hide");
    showResultBtn.classList.add("hide");
    resultContainer.classList.remove("hide");
    
    const grade = setColourGrade();
    const gradeMessage = document.createElement("h2");
    gradeMessage.innerText = `${grade}`;
    resultContainer.appendChild(gradeMessage);

    const showScore = document.createElement("p");
    showScore.innerText = `You scored ${score} out of ${maxPoints()}`;
    resultContainer.appendChild(showScore);
}




const questionsArr = [
    {   type: "oneCorrect",
        question: "Rubik's Cube was the first toy advertised on TV.",
        answers: [
            { text: "True", correct: false },
            { text: "False", correct: true }]
    },
    {   type: "oneCorrect",
        question: "At a mass dancing epidemic in France, people danced uncontrollably for days",
        answers: [
            { text: "True", correct: true },
            { text: "False", correct: false }]
    },
    {   type: "oneCorrect",
        question: "Australia once carried out a military operation attempting to control the emu population using machine guns.",
        answers: [
            { text: "True", correct: true },
            { text: "False", correct: false }]
    },
    {   type: "oneCorrect",
        question: "The shortest war in history lasted 58 minutes.",
        answers: [
            { text: "True", correct: false },
            { text: "False", correct: true }]
    },
    {   type: "oneCorrect",
        question: "Early macarons were originally made with mashed potatoes instead of almonds.",
        answers: [
            { text: "True", correct: false },
            { text: "False", correct: true }]
    },

    {   type: "oneCorrect",
        question: "In Switzerland, there was a pastry that was long regulated by the state and could only be baked by:",
        answers: [
            { text: "Military chefs", correct: false },
            { text: "Church bakers", correct: false },
            { text: "Licensed pastry chefs", correct: true },
            { text: "Oath-taking disciples", correct: false }]
    },
    {   type: "oneCorrect",
        question: "Who is the face behind Michael Myers legendary mask in Halloween?",
        answers: [
            { text: "William Shatner", correct: true },
            { text: "Leonard Nimoy", correct: false },
            { text: "Patrick Stewart", correct: false },
            { text: "That's someone's real face?!?", correct: false }]
    },
    {   type: "oneCorrect",
        question: "What is a group of lemurs called?",
        answers: [
            { text: "Parliament", correct: false },
            { text: "Colony", correct: false },
            { text: "Conspiracy", correct: true },
            { text: "Gang", correct: false }]
    },
    {   type: "imageChoice",
        question: "Which of these are Scotland's national animal?",
        answers: [
            { img: "images/lion.png", text: "Lion", correct: false },
            { img: "images/unicorn.png", text: "Unicorn", correct: true },
            { img: "images/dragon.png", text: "Dragon", correct: false },
            { img: "images/british-bulldog.png", text: "British Bulldog", correct: false }]
    },
    {   type: "oneCorrect",
        question: "In The Matrix, what code was used to fill the green “digital rain”?",
        answers: [
            { text: "Random ASCII", correct: false },
            { text: "Japanese recipes", correct: true },
            { text: "Keanu Reeves' handwriting samples", correct: false },
            { text: "Old Linux scripts", correct: false }]},

    {   type: "multipleCorrect", 
        question: "Which strange food combinations were popular centuries ago?",
        answers: [
            { text: "Croissants dipped in bone broth for breakfast", correct: false },
            { text: "Pancakes spread with mashed garlic cloves", correct: false },
            { text: "Sweet pies filled with fish and sugar", correct: true },
            { text: "Hot chocolate mixed with beer", correct: true }]
    },
    {   type: "multipleCorrect", 
        question: "Which of these were real laws in Victorian Britain?",
        answers: [
            { text: "It was illegal to pretend to be a ghost", correct: true },
            { text: "You could be prosecuted for wearing pants that were too colorful", correct: true },
            { text: "It was forbidden to wear a pumpkin on your head after 6 p.m.", correct: false },
            { text: "Scarecrows couldn't be too scary", correct: false }]
    },
    {   type: "multipleCorrect", 
        question: "In October of 2000, what was stolen from the family mausoleum of J. Sigfrid Edström in Västerås?",
        answers: [
            { text: "a Skull", correct: true },
            { text: "A golden cross", correct: false },
            { text: "Two urns with ashes", correct: true },
            { text: "Four copper candlestick", correct: false }]
    },
    {   type: "multipleCorrect", 
        question: "Which of these movies is enspired by Ed Gein?",
        answers: [
            { text: "Psycho", correct: true },
            { text: "The Clovehitch Killer", correct: false },
            { text: "The Texas Chain Saw Massacre", correct: true },
            { text: "The Silence of the Lambs", correct: true }]
    },
    {   type: "multipleCorrect", 
        question: "Which of these foods were actually used as medicines in the past?",
        answers: [
            { text: "Ketchup as a cure for diarrhea", correct: true },
            { text: "Ice cream for treating frostbite", correct: false },
            { text: "Whipped cream recommended to treat muscle cramps", correct: false },
            { text: "Chocolate as a treatment for stomach issues", correct: true }]
    }
];