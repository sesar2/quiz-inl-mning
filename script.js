import {questions} from '/questions.js'


let questionIndex = 0;
let correctAnswers = 0;


const container = document.getElementById('quiz-window');
const options = document.getElementById('options');
const nextQuestion = document.getElementById('nxt');
const question = document.getElementById('question')





const renderQuestion= () => {
    
    options.innerHTML = '';
    
    const currentQuestion = questions[questionIndex]
    question.innerHTML = currentQuestion.question;
    nextQuestion.classList.add('inactive')

    
    if(currentQuestion.type !== "checkboxes"){
        currentQuestion.options.forEach((answer) => {
            const option = document.createElement("div");
            option.innerHTML = answer.text;
            option.classList.add("option");
            
            // Kollar om isCorrect är true eller false och lägger till en class beroende på vad som stämmer
            option.addEventListener('click', () => {
                if (answer.isCorrect) {
                    correctAnswers++;
                    option.classList.add("correct");
                } else {
                    option.classList.add("incorrect");
                }
                
                // Disable all options after one is selected
                nextQuestion.classList.remove('inactive')
                Array.from(options.children).forEach(opt => opt.style.pointerEvents = 'none');
            });
            
            options.appendChild(option);
        });
    }
    }
    
    
    const handleClick = () => {
        questionIndex++;
        renderQuestion()
        console.log(correctAnswers)
    }
    
    const renderCheckboxQuestions = () => {

    }



nextQuestion.addEventListener('click', handleClick);

renderQuestion()
