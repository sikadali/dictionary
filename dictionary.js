const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";

let input = document.getElementById("inputWord");
let btnSearch = document.querySelector(".searchbtn");
let btnSound = document.querySelector(".soundbtn");
let soundElement = document.getElementById("sound");
let resultPanel = document.querySelector(".resultpanel");

input.addEventListener("keypress", (e) => {
     if (e.key === "Enter") {
          e.preventDefault();
          btnSearch.click();
     }
});

btnSearch.addEventListener("click", () => {
     let inputWord = input.value;

     console.log(inputWord);
     fetch(`${url}${inputWord}`)
          .then((response) => response.json())
          .then((data) => {
               console.log(data);

               let word = data[0].word;
               let phonetics = getPhonetics(data);
               let sound = getAudio(data);

               let partOfSpeech = data[0].meanings[0].partOfSpeech;
               let meaning = data[0].meanings[0].definitions[0].definition;
               let example = data[0].meanings[0].definitions[0].example;

               resultPanel.innerHTML = `
                    <div class="word">
                        <h1 id="word">${word}</h1>
                        <button class="soundbtn" onclick="playAudio()">
                            <i class="bi bi-volume-up-fill"></i>
                        </button>
                    </div>
                    <div class="details">
                        <p id="pos">${partOfSpeech || ""}</p>
                        <p id="phonetics">${phonetics || ""}</p>
                    </div>
                    <div id="meaning" class="meaning"><p>${meaning}</p></div>
                    <div id="example" class="example">${example || ""}</div>   
            `;

               soundElement.setAttribute("src", `${sound}`);
               console.log(sound);
          })
          .catch(() => {
               resultPanel.innerHTML = `<h2 id="error">WORD NOT FOUND</h2>`;
          });
});

function getAudio(data) {
     for (let item of data) {
          return loopSearch(item.phonetics, "audio");
     }
}

function getPhonetics(data) {
     let result = loopSearch(data, "phonetic");
     if (!result) {
          for (let item of data) {
               result = loopSearch(item.phonetics, "text");
          }
     }
     return result;
}

function loopSearch(array, keyPropName) {
     let counter = 0;
     while (counter < array.length) {
          if (array[counter][keyPropName]) {
               return array[counter][keyPropName];
          }
          counter++;
     }
}

function playAudio() {
     soundElement.play();
}
