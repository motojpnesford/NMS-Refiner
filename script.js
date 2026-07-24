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
    { text: "INITIALIZING...", progress: 2 },
    { text: "CONNECTING TO ATLAS NETWORK...", progress: 8 },
    { text: "VERIFYING DATABASE...", progress: 15 },
    { text: "LOADING REFINER DATA...", progress: 33 },
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

    setTimeout(nextStep,900);

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

<div class="entryLabel">

ATLAS DATABASE ENTRY

</div>

<div class="entryLine"></div>

<div class="headerInfo">

    <div class="iconArea">

        <img src="images/icons/${item.icon}.png"
             class="itemIcon">

    </div>

    <div class="titleCenter">

      <h2 id="itemTitle"></h2>

        <p>${getCategoryEnglish(item.category)}</p>

    </div>

</div>
`;
const title = document.getElementById("itemTitle");

decodeText(title, item.name);
    
    itemBody.innerHTML = `

${recipeForThisItem ? `

    <h3>◆ REQUIRED MATERIALS
    <span class="jp">必要素材</span></h3>

    <ul>

        ${recipeForThisItem.ingredients.map(i => `<li>${getItemName(i.item)} ×${i.amount}</li>`).join("")}

    </ul>

` : ""}
        <h3>◆ ACQUISITION
          <span class="jp">入手方法</span></h3>

        <ul>

            ${item.obtain.map(o=>`<li>${o}</li>`).join("")}

        </ul>

        <h3>◆ REFINING
          <span class="jp">増やし方</span></h3>

        ${
            recipesFound.length
            ?

            recipesFound.map(recipe=>`

                <p>

                ${recipe.ingredients.map(i=>`${getItemName(i.item)} ×${i.amount}`).join(" + ")}

                <br>

                ↓

                <br>

                ${getItemName(recipe.result.item)} ×${recipe.result.amount}

                </p>

            `).join("")

            :

            "<p>ありません。</p>"

        }

        <h3>◆ TIPS　
          <span class="jp">攻略のコツ</span></h3>

        <ul>

            ${item.tips.map(t=>`<li>${t}</li>`).join("")}

        </ul>

    <h3>◆ NOTES　
      <span class="jp">メモ</span></h3>

<ul>

${item.notes ? item.notes.map(n=>`<li>${n}</li>`).join("") : "<li>なし</li>"}

</ul>

<h3>◆ CRAFTING
  <span class="jp">この資源から作れるもの</span></h3>

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

function decodeText(element, text){

    let index = 0;

    const placeholder = "□";

    const timer = setInterval(()=>{

        element.textContent =
            text.substring(0,index)
            + placeholder.repeat(text.length-index);

        index++;

        if(index > text.length){

            clearInterval(timer);

            element.textContent = text;

        }

    },60);

}
    });
