import { questions } from "/questions.js";

let questionIndex = 0;
let correctAnswers = 0;
let selectedAnswers = []

const options = document.getElementById("options");
const nextQuestion = document.getElementById("nxt");
const question = document.getElementById("question");
const result = document.querySelector(".result");

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

// funktion för att renderar svarsalternativ
const renderOptions = (currentQuestion) => {
  currentQuestion?.options.forEach((answer) => {
    const option = document.createElement("div");

    option.innerHTML = answer.text;
    option.classList.add("option");

    // Kollar om isCorrect är true eller false och lägger till en class beroende på vad som stämmer
    option.addEventListener("click", () => {
      selectedAnswers[questionIndex] = {
        question: currentQuestion.question,
        selected: answer.text,
        isCorrect: answer.isCorrect
      }

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

  currentQuestion.options.forEach((answer, index) => {
    

    const checkboxOption = document.createElement("div");
    checkboxOption.classList.add("option");
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

const handleClick = () => {
  console.log(questionIndex);
  const currentQuestion = questions[questionIndex];

  // körs bara om type = checkboxes
  if (currentQuestion?.type === "checkboxes") {
    //variabel för att hålla kolla på hur många "rätta" checkboxes som är checked
    let selectedCorrect = 0;
    let answersChecked = []
    let isCorrect = false
    // skapar en filtrerad array med bara de korrekta svaren
    let totalCorrect = currentQuestion.options.filter((opt) => opt.isCorrect);

    currentQuestion.options.forEach((answer, index) => {
      const checkbox = document.getElementById(`option-${index}`);
      const isSelected = checkbox.checked;
      
      if(checkbox.checked){
        answersChecked.push(answer.text)
      }

      // ökar selectedCorrect med 1 om rätt svar är icheckat
      if (isSelected && answer.isCorrect) {
        selectedCorrect++;
      }

      selectedAnswers[questionIndex] = {
        question: currentQuestion.question,
        selected: answersChecked,
        isCorrect: isCorrect,
    };

    });
    // om selectedCorrect och längden på totalCorrect är samma har användaren checkat i alla möjliga korrekta svar
    if (selectedCorrect === totalCorrect.length) {
      correctAnswers++;
    }
    questionIndex++;
    renderQuestion();
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
  console.log(selectedAnswers)
  result.style.display = "flex";
  question.innerHTML = `Congratulations! You got ${correctAnswers} questions correct`;

  const score = document.getElementById('score')
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
};
// function för att starta quizet, används även för att restarta då den "resetar" allt
const startQuiz = () => {
  nextQuestion.innerHTML = "Next";
  correctAnswers = 0;
  questionIndex = 10;
  renderQuestion();
};

startQuiz();
