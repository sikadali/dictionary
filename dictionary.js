const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";

let btnSearch = document.querySelector(".searchbtn");
let btnSound = document.querySelector(".soundbtn");
let soundElement = document.getElementById("sound");
let resultPanel = document.querySelector(".resultpanel");

btnSearch.addEventListener("click", () => {
     let inputWord = document.getElementById("inputWord").value;

     console.log(inputWord);
     fetch(`${url}${inputWord}`)
          .then((response) => response.json())
          .then((data) => {
               console.log(data);
               let word = data[0].word;
               let phonetics = data[0].phonetic;
               let partOfSpeech = data[0].meanings[0].partOfSpeech;
               let meaning = data[0].meanings[0].definitions[0].definition;
               let example = data[0].meanings[0].definitions[0].example;
               let sound = data[0].phonetics[0].audio;

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

function playAudio() {
     soundElement.play();
}
