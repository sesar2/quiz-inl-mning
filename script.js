import {questions} from '/questions.js'



let questionIndex = 0;
let correctAnswers = 0;


const container = document.getElementById('quiz-window');
const options = document.getElementById('options');
const nextQuestion = document.getElementById('nxt');
const question = document.getElementById('question')


question.innerHTML = questions[questionIndex].question;

questions[questionIndex].options.forEach(answer => {
    const option = document.createElement("div")
    option.innerHTML = answer.text
    option.classList.add("option")
    options.appendChild(option)
});