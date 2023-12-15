const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";

const input = document.getElementById("inputWord");
const btnSearch = document.querySelector(".searchbtn");
const soundElement = document.getElementById("sound");
const resultPanel = document.querySelector(".resultpanel");

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

               let meanings = buildMeanings(data);
               console.log(meanings);

               let sections = buildSections(meanings, phonetics);
               console.log(sections);

               resultPanel.innerHTML = `
                    <div class="word">
                         <h1 id="word">${word}</h1>
                         <button class="soundbtn" onclick="playAudio()">
                              <i class="bi bi-volume-up-fill"></i>
                         </button>
                    </div>`;

               carousel.innerHTML = `
                    <div class="slider">
                        ${sections}
                    </div>
                    <div class="controls">
                         <span class="arrow left">
                              <span class="material-symbols-outlined">arrow_back_ios</span>
                         </span>
                         <span class="arrow right">
                              <span class="material-symbols-outlined">arrow_forward_ios</span>
                         </span>
                    </div>
                `;

               soundElement.setAttribute("src", `${sound}`);
          })
          .catch(() => {
               carousel.innerHTML = `<h2 id="error">WORD NOT FOUND</h2>`;
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
          data.forEach((item) => (result = loopSearch(item.phonetics, "text")));
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

class Meaning {
     constructor(partOfSpeech, meaning, example) {
          this.partOfSpeech = partOfSpeech;
          this.meaning = meaning;
          this.example = example;
     }
}

function buildMeanings(data) {
     let result = [];
     data.forEach((item) => {
          item.meanings.forEach((meaning) => {
               meaning.definitions.forEach((definition) => {
                    result.push(new Meaning(meaning.partOfSpeech, definition.definition, definition.example));
               });
          });
     });
     return result;
}

function buildSections(meanings, phonetics) {
     let result = [];
     meanings.forEach((meaning) => {
          result.push(
               `<section>
                    <div class="details">
                         <p id="pos">${meaning.partOfSpeech || ""}</p>
                         <p id="phonetics">${phonetics || ""}</p>
                    </div>
                    <div id="meaning" class="meaning"><p>${meaning.meaning}</p></div>
                    <div id="example" class="example">${meaning.example || ""}</div>  
               </section>`
          );
     });
     return result.join("\n");
}

// ================================ CAROUSEL ================================
const carousel = document.querySelector(".carousel");
const slider = document.querySelector(".slider");

const prev = document.querySelector(".prev");
const next = document.querySelector(".next");

const sections = document.querySelectorAll("section");
const sectionsLength = sections.length;

// Dynamically set slider and sections dimensions to have a good carousel effect
slider.style.width = `${sectionsLength * 100}%`;
sections.forEach((section) => {
     section.style.width = `${100 / sectionsLength}%`;
     section.style.flexBasis = `${100 / sectionsLength}%`;
});

let direction = -1;

prev.addEventListener("click", () => {
     if (direction === -1) {
          slider.appendChild(slider.firstElementChild);
          direction = 1;
     }
     carousel.style.justifyContent = "flex-end";
     slider.style.transform = "translate(20%)";
});

next.addEventListener("click", () => {
     if (direction === 1) {
          slider.prepend(slider.lastElementChild);
          carousel.style.justifyContent = "flex-start";
          direction = -1;
     }
     slider.style.transform = "translate(-20%)";
});

slider.addEventListener("transitionend", () => {
     if (direction === -1) {
          slider.appendChild(slider.firstElementChild);
     } else {
          slider.prepend(slider.lastElementChild);
     }

     slider.style.transition = "none";
     slider.style.transform = "translate(0%)";
     setTimeout(() => {
          slider.style.transition = "all 0.5s";
     });
});
