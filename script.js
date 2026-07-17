alert("script.js 読み込み成功");
const boot = document.getElementById("boot");
const bootText = document.getElementById("bootText");
const progressBar = document.getElementById("progressBar");
const main = document.getElementById("main");

const steps = [
    { text: "INITIALIZING...", progress: 20 },
    { text: "CONNECTING TO ATLAS NETWORK...", progress: 45 },
    { text: "VERIFYING DATABASE...", progress: 70 },
    { text: "LOADING REFINER DATA...", progress: 90 },
    { text: "WELCOME TRAVELLER", progress: 100 }
];

let current = 0;

function nextStep() {

    bootText.textContent = steps[current].text;
    progressBar.style.width = steps[current].progress + "%";

    current++;

    if (current < steps.length) {

        setTimeout(nextStep, 700);

    } else {

        setTimeout(showMainScreen, 900);

    }

}

function showMainScreen() {

    boot.style.transition = "opacity 1.2s ease";
    boot.style.opacity = "0";

    setTimeout(() => {

        boot.style.display = "none";

        main.style.display = "block";
        main.style.opacity = "0";
        main.style.transition = "opacity 1.2s ease";

        requestAnimationFrame(() => {
            main.style.opacity = "1";
        });

    }, 1200);

}

window.addEventListener("load", () => {

    setTimeout(nextStep, 600);

});
fetch("database.json")
  .then(response => response.json())
  .then(data => {
   alert(data[0].name);
  });
