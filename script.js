import { questions } from "/questions.js";

let questionIndex = 0;
let correctAnswers = 0;
let selectedAnswers = [];
let darkMode = true;

const options = document.getElementById("options");
const nextQuestion = document.getElementById("nxt");
const question = document.getElementById("question");
const result = document.querySelector(".result");
const toggleButton = document.querySelector("#toggle-button");



// function för att starta quizet, används även för att restarta då den "resetar" allt
const startQuiz = () => {
  selectedAnswers = [];

  const questionsCtn = document.querySelector('.result-questions');
  questionsCtn.style.display = 'none'

  result.style.display = "none";
  nextQuestion.innerHTML = "Next";
  
  correctAnswers = 0;
  questionIndex = 0;
  renderQuestion();
};

const renderQuestion = () => {
  options.innerHTML = "";

  const currentQuestion = questions[questionIndex];

  question.innerHTML = currentQuestion?.question;
  nextQuestion.classList.add("inactive");
  // kollar om frågan har typen "checkboxes"
  if (currentQuestion?.type !== "checkboxes") {
    renderOptions(currentQuestion);
  } else {
    renderCheckboxOptions(currentQuestion);
  }
};

// funktion för att renderar svarsalternativ
const renderOptions = (currentQuestion) => {
  currentQuestion?.options.forEach((answer) => {
   
    const option = document.createElement("div");
    
    option.innerHTML = answer.text;
    
    // ändrar class när klassen skapas beroende på om det är dark eller light mode
    darkMode
    ? option.classList.add("option")
    : option.classList.add("optionlight");

    if (answer.isCorrect) {
        selectedAnswers[questionIndex] = {
        correctAnswer: answer.text
      };
    } 
    
    // Kollar om isCorrect är true eller false och lägger till en class beroende på vad som stämmer
    option.addEventListener("click", () => {
      selectedAnswers[questionIndex] = {
        ...selectedAnswers[questionIndex],
        question: currentQuestion.question,
        selected: answer.text,
        isCorrect: answer.isCorrect,
        isCheckbox: false,
      };
      
      if (answer.isCorrect) {
        correctAnswers++;
        option.classList.add("correct");
      } else {
        option.classList.add("incorrect");
      }
      // Gör så att "Next"-knappen går att trycka på samt tar bort möjligheten att klicka på resterande alternativ
      nextQuestion.classList.remove("inactive");
      Array.from(options.children).forEach(
        (opt) => (opt.style.pointerEvents = "none")
      );
    });
    
    options.appendChild(option);
  });
};
// funktion för att rendera svaralternativ med "checkboxes"
const renderCheckboxOptions = (currentQuestion) => {
  options.innerHTML = "";
  let correctAnswersArr = []
  
  currentQuestion.options.forEach((answer, index) => {
    const checkboxOption = document.createElement("div");

    if (answer.isCorrect) {
      correctAnswersArr.push(answer.text)
    };
    selectedAnswers[questionIndex] = {
    correctAnswer: correctAnswersArr
  }
    // ändrar class när klassen skapas beroende på om det är dark eller light mode
    darkMode
    ? checkboxOption.classList.add("option")
    : checkboxOption.classList.add("optionlight");
    checkboxOption.classList.add("checkbox-option");
    
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `option-${index}`;
    
    const label = document.createElement("label");
    label.htmlFor = `option-${index}`;
    label.innerHTML = answer.text;
    
    checkboxOption.appendChild(checkbox);
    checkboxOption.appendChild(label);
    options.appendChild(checkboxOption);
  });
  
  const checkboxes = options.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", toggleState);
  });
};

// function som returnerar true eller false beroende på om någon checkbox är .checked
const checkIfAnyChecked = () => {
  const checkboxes = options.querySelectorAll('input[type="checkbox"]');
  // använder mig av .some metoden för att returnera true eller false beroende på om någon av checkboxes är .checked
  return Array.from(checkboxes).some((checkbox) => checkbox.checked);
};

// function för att kolla om checkIfAnyChecked returnerar true eller false
const toggleState = () => {
  const isAnyChecked = checkIfAnyChecked();
  isAnyChecked
    ? nextQuestion.classList.remove("inactive")
    : nextQuestion.classList.add("inactive");
};


const handleCheckboxes = () => {
  const currentQuestion = questions[questionIndex];

  //variabel för att hålla kolla på hur många "rätta" checkboxes som är checked
  let selectedCorrect = 0;
  let answersChecked = [];
  let answerIsCorrect = false;
  // skapar en filtrerad array med bara de korrekta svaren
  let totalCorrect = currentQuestion.options.filter((opt) => opt.isCorrect);

  currentQuestion.options.forEach((answer, index) => {
    const checkbox = document.getElementById(`option-${index}`);
    const isSelected = checkbox.checked;

    if (checkbox.checked) {
      answersChecked.push(answer.text);
    }

    // ökar selectedCorrect med 1 om rätt svar är icheckat
    if (isSelected && answer.isCorrect) {
      selectedCorrect++;
    }
    if (selectedCorrect === totalCorrect.length) {
      answerIsCorrect = true;
    }

    selectedAnswers[questionIndex] = {
      ...selectedAnswers[questionIndex],
      question: currentQuestion.question,
      selected: answersChecked,
      isCorrect: answerIsCorrect,
      isCheckbox: true,
    };
  });
  // om selectedCorrect och längden på totalCorrect är samma har användaren checkat i alla möjliga korrekta svar
  if (answerIsCorrect) {
    correctAnswers++;
  }
  questionIndex++;
  renderQuestion();
};

const handleClick = () => {
  const currentQuestion = questions[questionIndex];

  // körs bara om type = checkboxes
  if (currentQuestion?.type === "checkboxes") {
    handleCheckboxes();
  } else {
    questionIndex++;
    renderQuestion();
  }

  if (questionIndex === 15) {
    renderResults();
  } else {
    renderQuestion();
  }
  if (questionIndex > 15) {
    startQuiz();
  }
};

nextQuestion.addEventListener("click", handleClick);

// function för att rendera resultaten
const renderResults = () => {
  console.log(selectedAnswers);
  const buttonctn = document.querySelector('.button-container')
  const showRestultBtn = document.createElement('button')
  showRestultBtn.classList.add('showRestultBtn')
  showRestultBtn.innerHTML = 'Show Results'
  showRestultBtn.addEventListener('click', renderQuestionResults)
  result.style.display = "flex";
  question.innerHTML = `Congratulations! You got ${correctAnswers} questions correct`;

  const score = document.getElementById("score");
  score.classList.add("score");

  score.innerHTML = `${correctAnswers} / ${questions.length}`;
  // använder ternary operator som if statement för att bestämma vilken färg resultat-texten har beroende på användarens score
  correctAnswers > 10
    ? (score.style.color = "green")
    : correctAnswers <= 10 && correctAnswers > 5
    ? (score.style.color = "orange")
    : (score.style.color = "red");

  nextQuestion.innerHTML = "Restart";
  nextQuestion.classList.remove("inactive");
  result.appendChild(score);
  buttonctn.appendChild(showRestultBtn)
};

// function för att rendera resultatet från varje besvarad fråga
const renderQuestionResults = () => {

result.style.display = "none";

const showRestultBtn = document.querySelector('.showRestultBtn')
showRestultBtn.style.display = 'none'
const questionsCtn = document.querySelector('.result-questions');
questionsCtn.style.display = 'flex'

// foreach loop som skapar element för varje fråga
selectedAnswers.forEach(question => {
  
  const questionCtn = document.createElement('div');
  questionCtn.classList.add('question-container');
  questionsCtn.appendChild(questionCtn);
  
  const questionResult = document.createElement('h2');
  questionResult.innerHTML = `Q: ${question.question}`; 
  questionCtn.appendChild(questionResult);
  
  const yourAnswerCtn = document.createElement('div'); 
  yourAnswerCtn.classList.add('your-ans');
  const yourAnswerText = document.createElement('h3');
  const yourAnswer = document.createElement('h3');
  yourAnswer.style.color = question.isCorrect ? 'green' : 'red'
  
  yourAnswerText.innerHTML = 'You answered:';
  yourAnswer.innerHTML = question.isCheckbox ?  question.selected.join(',   ') : question.selected

  yourAnswerCtn.appendChild(yourAnswerText);
  yourAnswerCtn.appendChild(yourAnswer);
  questionCtn.appendChild(yourAnswerCtn); 
  
  
  const correctAnswerCtn = document.createElement('div'); 
  correctAnswerCtn.classList.add('corr-ans');
  const correctAnswerText = document.createElement('h3');
  const correctAnswer = document.createElement('h3');
  correctAnswer.style.color = 'green'

  correctAnswerText.innerHTML = question.isCheckbox ? 'Correct Answers:' : 'Correct Answer:'
  correctAnswer.innerHTML = question.isCheckbox ?  question.correctAnswer.join(',   ') : question.correctAnswer

  correctAnswerCtn.appendChild(correctAnswerText);
  correctAnswerCtn.appendChild(correctAnswer);
  questionCtn.appendChild(correctAnswerCtn);
  
});
}

// function för att sätta på lightmode
const goLight = () => {
  const body = document.querySelector("body");
  const quiz = document.querySelector(".quiz-window");
  const options = document.querySelectorAll(".option");
  body.style.backgroundColor = "#bfd8ff";
  body.style.color = "black";
  quiz.style.backgroundColor = "white";

  options.forEach((option) => {
    option.classList.remove("option");
    option.classList.add("optionlight");
  });
};
// function för att sätta på darkmode
const goDark = () => {
  const body = document.querySelector("body");
  const quiz = document.querySelector(".quiz-window");
  const options = document.querySelectorAll(".optionlight");

  body.style.backgroundColor = "#15202b";
  body.style.color = "white";
  quiz.style.backgroundColor = "#22303c";

  options.forEach((option) => {
    option.classList.remove("optionlight");
    option.classList.add("option");
  });
};
// function för att toggla mellan light och darkmode beroende på om en checkbox är checked
const toggle = (event) => {
  if (event.target.checked) {
    darkMode = true;
    goDark();
  } else {
    darkMode = false;
    goLight();
  }
};
toggleButton.addEventListener("click", toggle);

// körs i början för att starta quizet
startQuiz();
