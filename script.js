const boot = document.getElementById("boot");
const bootText = document.getElementById("bootText");
const progressBar = document.getElementById("progressBar");
const main = document.getElementById("main");

const searchBox = document.getElementById("searchBox");

const itemHeader = document.getElementById("itemHeader");
const itemBody = document.getElementById("itemBody");

// =========================
// 起動画面
// =========================

const steps = [
    { text: "INITIALIZING...", progress: 20 },
    { text: "CONNECTING TO ATLAS NETWORK...", progress: 45 },
    { text: "VERIFYING DATABASE...", progress: 70 },
    { text: "LOADING REFINER DATA...", progress: 90 },
    { text: "WELCOME TRAVELLER", progress: 100 }
];

let current = 0;

function nextStep(){

    bootText.textContent = steps[current].text;
    progressBar.style.width = steps[current].progress + "%";

    current++;

    if(current < steps.length){

        setTimeout(nextStep,700);

    }else{

        setTimeout(showMainScreen,900);

    }

}

function showMainScreen(){

    boot.style.transition = "opacity 1.2s ease";
    boot.style.opacity = "0";

    setTimeout(()=>{

        boot.style.display="none";

        main.style.display="block";
        main.style.opacity="0";
        main.style.transition="opacity 1.2s ease";

        requestAnimationFrame(()=>{

            main.style.opacity="1";

        });

    },1200);

}

window.addEventListener("load",()=>{

    setTimeout(nextStep,600);

});

// =========================
// データベース
// =========================

let items = [];
let recipes = [];
let crafting = [];
Promise.all([

    fetch("database/items.json").then(r=>r.json()),
    fetch("database/recipes.json").then(r=>r.json()),
    fetch("database/crafting.json").then(r=>r.json())

]).then(data=>{

    items = data[0];
    recipes = data[1];
    crafting = data[2];

});

// =========================
// 共通関数
// =========================

function getItemName(id){

    const item = items.find(i=>i.id===id);

    return item ? item.name : id;

}

function getCategoryEnglish(category){

    switch(category){

        case "基本資源":
            return "BASIC RESOURCE";

        case "クラフト素材":
            return "CRAFTING MATERIAL";

        default:
            return "UNKNOWN";
    }

}

// =========================
// 検索
// =========================

searchBox.addEventListener("keydown",function(e){

    if(e.key !== "Enter") return;

    const keyword = searchBox.value.trim();

    const item = items.find(i=>i.name===keyword);

    if(!item){

        itemHeader.innerHTML = `
            <h2>NOT FOUND</h2>
            <p>DATABASE ERROR</p>
        `;

        itemBody.innerHTML = `
            <p class="resultMessage">
                データが見つかりませんでした。
            </p>
        `;

        return;

    }

    const recipesFound = recipes.filter(r=>r.result.item===item.id);
    const craftingFound = crafting.filter(c =>
    c.ingredients.some(i => i.item === item.id)
            
);
    const recipeForThisItem = crafting.find(c => c.result.item === item.id);

    itemHeader.innerHTML = `

        <h2>◇ ${item.name} ◇</h2>

        <p>${getCategoryEnglish(item.category)}</p>

    `;

    itemBody.innerHTML = `

${recipeForThisItem ? `

    <h3>◆ REQUIRED MATERIALS</h3>

    <ul>

        ${recipeForThisItem.ingredients.map(i => `<li>${getItemName(i.item)} ×${i.amount}</li>`).join("")}

    </ul>

` : ""}
        <h3>■ 入手方法</h3>

        <ul>

            ${item.obtain.map(o=>`<li>${o}</li>`).join("")}

        </ul>

        <h3>■ 増やし方</h3>

        ${
            recipesFound.length
            ?

            recipesFound.map(recipe=>`

                <p>

                ${recipe.ingredients.map(i=>`${getItemName(i.item)} ×${i.amount}`).join(" + ")}

                <br><br>

                ↓

                <br><br>

                ${getItemName(recipe.result.item)} ×${recipe.result.amount}

                </p>

            `).join("")

            :

            "<p>ありません。</p>"

        }

        <h3>■ 攻略のコツ</h3>

        <ul>

            ${item.tips.map(t=>`<li>${t}</li>`).join("")}

        </ul>

    <h3>■ メモ</h3>

<ul>

${item.notes ? item.notes.map(n=>`<li>${n}</li>`).join("") : "<li>なし</li>"}

</ul>

<h3>■ この資源から作れるもの</h3>

${
craftingFound.length

?

`<ul>

${craftingFound.map(c=>`

<li>

${getItemName(c.result.item)}

</li>

`).join("")}

</ul>`

:

"<p>ありません。</p>"

}
     
    `;

});
