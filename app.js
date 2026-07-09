const sources = [

"https://raw.githubusercontent.com/V2RAYCONFIGSPOOL/TELEGRAM_PROXY_SUB/refs/heads/main/telegram_proxy_no1.txt",

"https://raw.githubusercontent.com/V2RAYCONFIGSPOOL/TELEGRAM_PROXY_SUB/refs/heads/main/telegram_proxy_no2.txt",

"https://raw.githubusercontent.com/V2RAYCONFIGSPOOL/TELEGRAM_PROXY_SUB/refs/heads/main/telegram_proxy_no3.txt",

"https://raw.githubusercontent.com/V2RAYCONFIGSPOOL/TELEGRAM_PROXY_SUB/refs/heads/main/telegram_proxy_no4.txt",

"https://raw.githubusercontent.com/V2RAYCONFIGSPOOL/TELEGRAM_PROXY_SUB/refs/heads/main/telegram_proxy_no5.txt",

"https://raw.githubusercontent.com/V2RAYCONFIGSPOOL/TELEGRAM_PROXY_SUB/refs/heads/main/telegram_proxy_no6.txt",

"https://raw.githubusercontent.com/V2RAYCONFIGSPOOL/TELEGRAM_PROXY_SUB/refs/heads/main/telegram_proxy_no7.txt",

"https://raw.githubusercontent.com/V2RAYCONFIGSPOOL/TELEGRAM_PROXY_SUB/refs/heads/main/telegram_proxy_no8.txt",

"https://raw.githubusercontent.com/V2RAYCONFIGSPOOL/TELEGRAM_PROXY_SUB/refs/heads/main/telegram_proxy_no9.txt",

"https://raw.githubusercontent.com/V2RAYCONFIGSPOOL/TELEGRAM_PROXY_SUB/refs/heads/main/telegram_proxy_no10.txt"

];


let proxies = [];



/* تشخیص IP و کشور */

async function checkCountry(){

try{


const res = await fetch(
"https://ipwho.is/"
);


const data = await res.json();


document.getElementById("ip").innerHTML =
"IP: " + data.ip;


document.getElementById("country").innerHTML =
"کشور: " + data.country + " " + data.flag?.emoji;



const alertBox =
document.getElementById("country-alert");



if(data.country_code === "IR"){

alertBox.className="alert hidden";

}



else if(data.country_code === "AZ"){


alertBox.className="alert az";

alertBox.innerHTML=

`
🇦🇿
برخی کاربران ایرانی با آی‌پی آذربایجان دیده می‌شوند.
<br>
احتمالاً به‌دلیل تغییر مسیر ترافیک یا سرورهای واسط شبکه است.
<br>
این باعث دسترسی متفاوت به بعضی سرویس‌ها بدون VPN شده.
<br>
اما به معنی رفع کامل محدودیت اینترنت نیست.
`;


}



else{


alertBox.className="alert vpn";


alertBox.innerHTML=

`
⚠️
فیلترشکن روشن است لطفاً خاموش کنید
`;

}


}catch(e){

console.log(
"IP Error",
e
);

}

}




/* دریافت پروکسی ها */


async function loadProxies(){


const list =
document.getElementById("proxy-list");


list.innerHTML =
`
<div class="loading">
در حال دریافت پروکسی...
</div>
`;



let all=[];



await Promise.all(

sources.map(async(url)=>{


try{


const res =
await fetch(url);



const text =
await res.text();



const items =
text
.split("\n")
.map(x=>x.trim())
.filter(x=>x);



all.push(...items);



}

catch(e){

console.log(
"Failed:",
url
);

}


})

);



proxies =
[...new Set(all)];



localStorage.setItem(
"proxies",
JSON.stringify(proxies)
);



renderProxies();



}





/* نمایش پروکسی ها */


function renderProxies(items=proxies){


const list =
document.getElementById("proxy-list");


document.getElementById("proxy-count")
.innerText =
items.length;



if(items.length===0){

list.innerHTML=
`
<div class="loading">
پروکسی موجود نیست
</div>
`;

return;

}



list.innerHTML="";



items.forEach(proxy=>{


let card =
document.createElement("div");


card.className=
"proxy-card";



card.innerHTML=
`

<span>${proxy}</span>

<button class="copy-btn">
کپی
</button>

`;



card
.querySelector("button")
.onclick=()=>{

navigator.clipboard.writeText(proxy);

};



list.appendChild(card);



});


}




/* جستجو */


function searchProxy(){


const value =
document
.getElementById("search")
.value
.toLowerCase();



const result =
proxies.filter(p=>
p.toLowerCase()
.includes(value)
);



renderProxies(result);


}




/* پاک کردن */


function clearProxies(){


proxies=[];


localStorage.removeItem(
"proxies"
);


renderProxies();


}



/* شروع */


window.onload=()=>{


checkCountry();



const saved =
localStorage.getItem(
"proxies"
);



if(saved){


proxies =
JSON.parse(saved);



renderProxies();


}


};