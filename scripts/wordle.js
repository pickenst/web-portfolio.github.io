var letterCount = 0;
const wordSrc = "./wordbank.json";
const correctColor = "rgb(0, 80, 92)"

document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("start-button");
  const footer = document.getElementById("wordle-box-footer");
  const wordleBox = document.getElementById("wordle-box");
  const lengthSelector = document.getElementById("length-selector");
  updateLetters();
  
  lengthSelector.addEventListener("input", () =>{
    updateLetters();
  })

  startButton.addEventListener("click", () =>{
    footer.remove();
    play();
  })

  function updateLetters(){
    letterCount = lengthSelector.value;
    wordleBox.innerHTML = "";
    for(let i = 0; i < letterCount; i++){
      const wordleLetter = document.createElement("div");
      wordleLetter.classList.add("wordle-box-child");
      wordleLetter.textContent = "";
      wordleBox.appendChild(wordleLetter);
    }
  }
})

async function play(){
  const word = await generateWord();
  const letters = document.querySelectorAll(".wordle-box-child");
  var letterIdx = 0;
  letters[0].style.opacity = "1";
  const body = document.body;

  body.addEventListener("keypress", inputEvent);
  body.addEventListener("keydown", backEvent);
  body.addEventListener("keydown", spaceEvent);
  body.addEventListener("keydown", moveEvent);

  function inputEvent(event){
    if(!((event.keyCode >= 65 && event.keyCode <= 90) || (event.keyCode >= 97 && event.keyCode <= 122))){
      return;
    }
    letters[letterIdx].style.opacity = ".5";
    letters[letterIdx].textContent = (event.key).toUpperCase();
    if(letterIdx < letters.length - 1){
      letterIdx++;
    }
    letters[letterIdx].style.opacity = "1";
  }
  
  function spaceEvent(event){
    if(!(event.key == "Enter")){
      return;
    }
    for(let i = 0; i < letters.length; i++){
      if(letters[i].textContent == " " || letters[i].textContent == ""){
        return;
      }
    }
    submit();
  }

  function moveEvent(event){
    const key = event.key;
    var incr = 0;
    if(!(key == "ArrowLeft" || key == "ArrowRight")){
      return;
    }
    if(key == "ArrowLeft" && letterIdx > 0){
      incr--;
    }
    if(key == "ArrowRight" && letterIdx < letters.length - 1){
      incr++;
    }

    letters[letterIdx].style.opacity = ".5";
    letterIdx += incr;
    letters[letterIdx].style.opacity = "1";
  }

  function backEvent(){
    if(!(event.key == "Backspace")){
      return;
    }
    letters[letterIdx].style.opacity = ".5";
    if(letterIdx == 0 || !(letters[letterIdx].textContent == "")){
      letters[letterIdx].textContent = ""
    }
    else{
      letters[letterIdx - 1].textContent = "";
    }
    if(letterIdx > 0){
      letterIdx--;
    }
    letters[letterIdx].style.opacity = "1";
  }

  function submit(){
    var capWord = word.toUpperCase().toString();
    var indexMatches = [];
    var letterCount = {};

    for(let i = 0; i < capWord.length; i++){
      const letter = capWord.charAt(i);
      if(!letterCount[letter]){
        letterCount[letter] = 0;
      }
      letterCount[letter]++
    }

    let win = true;
    
    letters.forEach((element, index) => {
      const letter = element.textContent.charAt(0).toUpperCase();
      if(letter == capWord.charAt(index)){
        element.style.boxShadow = "0 0 25px 3px " + correctColor;
        indexMatches.push(index);
        letterCount[letter]--;
      }
      else{
        win = false;
      }
    });

    letters.forEach((element, index) => {
      const letter = element.textContent.charAt(0).toUpperCase();
      if(!indexMatches.includes(index)){
        if(letterCount[letter] > 0){
          element.style.boxShadow = "0 0 25px 3px gray";
        }
        else{
          element.style.boxShadow = "0 0 25px 3px black"
        }
      }
    });

    const answerBox = document.getElementById("answer-box");
    var userAnswer = document.createElement("div");
    userAnswer.classList.add("answer-box-word");
    letters.forEach(element => {
      var letter = element.textContent.charAt(0);
      var shadow = (element.style.boxShadow).split(' ').reverse().slice(4).reverse().join(' ');
      var answerLetter = document.createElement("div");
      answerLetter.classList.add("answer-box-letter");
      answerLetter.textContent = letter;
      answerLetter.style.boxShadow = "0 0 3px 1px " + shadow;
      userAnswer.appendChild(answerLetter);
    })
    answerBox.appendChild(userAnswer);

    if(win){
      winSequence();
      return;
    }
  }

  function winSequence(){
    body.removeEventListener("keypress", inputEvent);
    body.removeEventListener("keydown", backEvent);
    body.removeEventListener("keydown", spaceEvent);
    body.removeEventListener("keydown", moveEvent);
    letters.forEach(element => {
      element.style.opacity = 1;
    })
  }
}

function generateWord(){
  return fetch(wordSrc)
    .then(response => response.json())
    .then(data => {
      let key = letterCount.toString();
      var randomIndex = Math.floor(Math.random() * data[key].length);
      console.log(data[key][randomIndex]);
      return data[key][randomIndex];
    })
    .catch(error => {
      console.error("ERROR CATCHING WORDBANK JSON")
    });
}