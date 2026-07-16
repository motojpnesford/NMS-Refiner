const text=document.getElementById("bootText");
const bar=document.getElementById("bar");

const steps=[
["INITIALIZING...",25],
["CONNECTING TO DATABASE...",55],
["VERIFYING RECIPES...",80],
["WELCOME TRAVELLER",100]
];

let i=0;

function nextStep(){

text.innerHTML=steps[i][0];

bar.style.width=steps[i][1]+"%";

i++;

if(i<steps.length){

setTimeout(nextStep,700);

}else{

setTimeout(()=>{

document.getElementById("boot").style.display="none";

document.getElementById("main").style.display="block";

document.body.style.overflow="auto";

},900);

}

}

nextStep();
