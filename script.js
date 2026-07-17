
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
// =========================
// items.json 読み込み
// =========================

let items = [];

fetch("database/items.json")
    let recipes = [];

fetch("database/recipes.json")
    .then(response => response.json())
    .then(data => {

        recipes = data;

    });
    .then(response => response.json())
    .then(data => {

        items = data;

    });

// =========================
// 検索
// =========================

const searchBox = document.getElementById("searchBox");
const result = document.getElementById("result");

searchBox.addEventListener("keydown", function(e){

    if(e.key !== "Enter") return;

    const keyword = searchBox.value.trim();

    const item = items.find(i => i.name === keyword);

    const recipesFound = recipes.filter(r => r.result.item === item.id);
    
    if(!item){

        result.innerHTML = "見つかりませんでした。";

        return;

    }

   result.innerHTML = `
<h2>${item.name}</h2>

<p>${item.category}</p>

<h3>攻略のコツ</h3>

<ul>
${item.tips.map(t=>`<li>${t}</li>`).join("")}
</ul>

<h3>入手方法</h3>

<ul>
${item.obtain.map(o=>`<li>${o}</li>`).join("")}
</ul>

<h3>増やし方</h3>

${
recipesFound.length
?
recipesFound.map(recipe=>`

<p>

${recipe.ingredients.map(i=>`${i.item} ×${i.amount}`).join(" + ")}

↓

${recipe.result.item} ×${recipe.result.amount}

</p>

`).join("")
:
"<p>ありません</p>"
}
`;
        <h2>${item.name}</h2>

        <p>${item.category}</p>

        <h3>攻略のコツ</h3>

        <ul>
            ${item.tips.map(t=>`<li>${t}</li>`).join("")}
        </ul>
    `;

});
