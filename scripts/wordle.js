const testWord = "Humming"
const letterCount = testWord.length;

document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("start-button");
  const wordleBox = document.getElementById("wordle-box");
  for(let i = 0; i < letterCount; i++){
    const wordleLetter = document.createElement("div");
    wordleLetter.classList.add("wordle-box-child");
    wordleLetter.textContent = "";
    wordleBox.appendChild(wordleLetter);
  }

  startButton.addEventListener("click", () =>{
    startButton.remove();
    play();
  })

})

function play(){
  const letters = document.querySelectorAll(".wordle-box-child");
  var letterIdx = 0;
  letters[0].style.opacity = "1";
  const body = document.body;

  body.addEventListener("keypress", (event) => {
    if(!((event.keyCode >= 65 && event.keyCode <= 90) || (event.keyCode >= 97 && event.keyCode <= 122))){
      return;
    }
    letters[letterIdx].style.opacity = ".5";
    letters[letterIdx].textContent = (event.key).toUpperCase();
    if(letterIdx < letters.length - 1){
      letterIdx++;
    }
    letters[letterIdx].style.opacity = "1";
  })

  body.addEventListener("keydown", (event) => {
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
  })

  body.addEventListener("keydown", (event) => {
    if(!(event.key == "Enter")){
      return;
    }
    for(let i = 0; i < letters.length; i++){
      if(letters[i].textContent == " " || letters[i].textContent == ""){
        return;
      }
    }
    submit();
  })

  body.addEventListener("keydown", (event) => {
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
  })

  function submit(){
    
    var capWord = testWord.toUpperCase().toString();
    var indexMatches = [];
    var letterCount = {};

    for(let i = 0; i < capWord.length; i++){
      const letter = capWord.charAt(i);
      if(!letterCount[letter]){
        letterCount[letter] = 0;
      }
      letterCount[letter]++
    }
    
    letters.forEach((element, index) => {
      const letter = element.textContent.charAt(0).toUpperCase();
      if(letter == capWord.charAt(index)){
        element.style.boxShadow = "0 0 25px 3px green";
        indexMatches.push(index);
        letterCount[letter]--;
      }
    });

    letters.forEach((element, index) => {
      const letter = element.textContent.charAt(0).toUpperCase();
      if(!indexMatches.includes(index)){
        if(letterCount[letter] > 0){
          element.style.boxShadow = "0 0 25px 3px yellow";
        }
        else{
          element.style.boxShadow = "0 0 25px 3px red";
        }
      }
    })
  }

  
}