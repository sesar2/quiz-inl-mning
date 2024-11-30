import { questions } from "/questions.js";

let questionIndex = 0;
let correctAnswers = 0;

const container = document.getElementById("quiz-window");
const options = document.getElementById("options");
const nextQuestion = document.getElementById("nxt");
const question = document.getElementById("question");


// funktion för att renderar svarsalternativ
const renderOptions = (currentQuestion) => {
    currentQuestion.options.forEach((answer) => {
    const option = document.createElement("div");

    option.innerHTML = answer.text;
    option.classList.add("option");

    // Kollar om isCorrect är true eller false och lägger till en class beroende på vad som stämmer
    option.addEventListener("click", () => {
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
    currentQuestion.options.forEach((answer) => {
      const checkboxOption = document.createElement("div");
      checkboxOption.classList.add("option");
      checkboxOption.classList.add("checkbox-option");
  
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
  
      const label = document.createElement("label");
      label.htmlFor = "checkbox";
      label.innerHTML = answer.text;
  
      checkboxOption.appendChild(checkbox);
      checkboxOption.appendChild(label);
      options.appendChild(checkboxOption);
    });
  };

const renderQuestion = () => {
  options.innerHTML = "";

  const currentQuestion = questions[questionIndex];
  question.innerHTML = currentQuestion.question;
  nextQuestion.classList.add("inactive");
// kollar om frågan har typen "checkboxes"
  if (currentQuestion.type !== "checkboxes") {
    renderOptions(currentQuestion);
  } else {
    renderCheckboxOptions(currentQuestion);
  }

};

const handleClick = () => {
  questionIndex++;
  renderQuestion();
  console.log(correctAnswers);
};

nextQuestion.addEventListener("click", handleClick);

renderQuestion();
