// ==========================
// PAProxy APP.JS
// ==========================


const proxySources = [

"https://raw.githubusercontent.com/SoliSpirit/mtproto/master/all_proxies.txt",

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




// ==========================
// تغییر حالت Dark / White
// ==========================


document
.getElementById("themeBtn")
.onclick = ()=>{


document.body.classList.toggle("light");


localStorage.setItem(
"theme",
document.body.className
);


};



if(localStorage.getItem("theme")){

document.body.className =
localStorage.getItem("theme");

}




// ==========================
// بررسی IP + Country + ISP
// ==========================


async function checkIP(){


const box =
document.getElementById("userInfo");


box.innerHTML =
"⏳ در حال بررسی IP و ISP...";



try{


let response =
await fetch(
"https://pinip.net/api?format=json"
);



let data =
await response.json();



let ip =
data.ip || "نامشخص";


let country =
data.country || "نامشخص";


let isp =
data.isp || "نامشخص";



box.innerHTML = `

🌐 IP:
<br>
<b>${ip}</b>

<br><br>

🌍 کشور:
<br>
<b>${country}</b>

<br><br>

📡 ISP:
<br>
<b>${isp}</b>

`;



if(
country.includes("Iran") ||
country.includes("Azerbaijan")
){


box.innerHTML += `

<div class="ok">

<br>
✅ اتصال مجاز است

</div>

`;

}

else{


box.innerHTML += `

<div class="error">

<br>
⚠️ بدون فیلترشکن وارد PAProxy شوید

</div>

`;

}


}

catch(error){


box.innerHTML =
"❌ خطا در دریافت اطلاعات IP";


}


}





// ==========================
// دریافت پروکسی‌ها
// ==========================


async function loadProxy(){


let list =
document.getElementById("proxyList");


list.innerHTML =
"⏳ در حال دریافت پروکسی‌ها...";



let responses =
await Promise.all(

proxySources.map(async url=>{


try{


let r =
await fetch(url);


return await r.text();


}

catch{


return "";

}


})

);



let all = [];



responses.forEach(text=>{


all.push(

...text
.split("\n")
.map(x=>x.trim())
.filter(Boolean)

);


});



proxies =
[...new Set(all)]
.filter(proxy=>

proxy.includes("t.me/proxy") ||
proxy.includes("tg://proxy")

);



localStorage.setItem(
"PAProxy",
JSON.stringify(proxies)
);



showProxy();


}





// ==========================
// نمایش پروکسی‌ها
// ==========================


function showProxy(){


document.getElementById("count").innerHTML =

"تعداد پروکسی: " + proxies.length;



showSuggestions();



let box =
document.getElementById("proxyList");


box.innerHTML="";



proxies.slice(0,100)
.forEach((proxy,index)=>{


box.innerHTML += `

<div class="proxy-card">


<b>
🚀 پروکسی ${index+1}
</b>


<div class="proxy">

${proxy}

</div>



<button class="telegram"
onclick="openTelegram(${index})">

➕ اضافه به تلگرام

</button>



<button class="copy"
onclick="copyProxy(${index})">

📋 کپی

</button>



<button class="share"
onclick="shareProxy(${index})">

📤 اشتراک‌گذاری

</button>


</div>

`;

});


}





// ==========================
// ۵ پروکسی پیشنهادی
// ==========================


function showSuggestions(){


if(proxies.length < 5)
return;



let items =
[...proxies]
.sort(()=>Math.random()-0.5)
.slice(0,5);



let html = `

<div class="card suggest">

<b>
⭐ ۵ پروکسی پیشنهادی
</b>

`;



items.forEach(proxy=>{


html += `

<div class="proxy">

${proxy}

</div>

`;

});



html += "</div>";



document
.getElementById("suggestions")
.innerHTML = html;


}





// ==========================
// عملیات پروکسی
// ==========================


function copyProxy(index){


navigator.clipboard.writeText(
proxies[index]
);


alert("✅ کپی شد");


}




function openTelegram(index){


let proxy =
proxies[index];


if(proxy.includes("https://t.me/proxy")){


proxy =
proxy.replace(
"https://t.me/proxy",
"tg://proxy"
);


}


window.location.href = proxy;


}





async function shareProxy(index){


if(navigator.share){


await navigator.share({

title:"PAProxy 🚀",

text:proxies[index]

});


}

else{


copyProxy(index);


}


}





// ==========================
// جستجو
// ==========================


document
.getElementById("search")
.oninput = function(){


let value =
this.value.toLowerCase();



document
.querySelectorAll(".proxy-card")
.forEach(card=>{


card.style.display =
card.innerText
.toLowerCase()
.includes(value)
?
"block"
:
"none";


});


};





// ==========================
// بارگذاری ذخیره شده
// ==========================


let saved =
localStorage.getItem("PAProxy");


if(saved){


proxies =
JSON.parse(saved);


showProxy();


}





// ==========================
// شروع برنامه
// ==========================


document
.getElementById("loadBtn")
.onclick = loadProxy;



checkIP();