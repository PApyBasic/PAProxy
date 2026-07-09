// ==========================
// PAProxy JavaScript
// ==========================


const sources = [

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


let proxies=[];



// ==========================
// Dark / White Mode
// ==========================


document
.getElementById("themeBtn")
.onclick=function(){


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
// بررسی IP + کشور + ISP
// ==========================


async function checkIP(){


let box =
document.getElementById("userInfo");


box.innerHTML =
"⏳ در حال بررسی IP و ISP...";



try{


let res =
await fetch(
"https://geolocation-db.com/json/"
);


let data =
await res.json();



let ip =
data.IPv4 || "نامشخص";


let country =
data.country_name || "نامشخص";


let isp =
data.ISP || data.org || "نامشخص";



box.innerHTML=`

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
country==="Iran" ||
country==="Azerbaijan"
){


box.innerHTML+=`

<div class="ok">

<br>
✅ اتصال مجاز است

</div>

`;

}

else{


box.innerHTML+=`

<div class="error">

<br>
⚠️ بدون فیلترشکن وارد PAProxy شوید

</div>

`;

}


}

catch{


box.innerHTML =
"❌ خطا در دریافت اطلاعات IP";


}


}





// ==========================
// دریافت پروکسی‌ها
// ==========================


async function loadProxy(){


document.getElementById("proxyList").innerHTML =
"⏳ دریافت پروکسی‌ها...";



let data =
await Promise.all(

sources.map(async url=>{


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



let all=[];



data.forEach(text=>{


all.push(
...text
.split("\n")
.map(x=>x.trim())
.filter(Boolean)
);


});



proxies =
[...new Set(all)]
.filter(x=>

x.includes("proxy") ||
x.includes("tg://") ||
x.includes("t.me/proxy")

);



localStorage.setItem(
"proxies",
JSON.stringify(proxies)
);



showProxies();


}





// ==========================
// نمایش پروکسی‌ها
// ==========================


function showProxies(){


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
onclick="telegram(${index})">

➕ تلگرام

</button>



<button class="copy"
onclick="copyProxy(${index})">

📋 کپی

</button>



<button class="share"
onclick="shareProxy(${index})">

📤 اشتراک

</button>



</div>


`;



});


}




// ==========================
// ۵ پروکسی پیشنهادی
// ==========================


function showSuggestions(){


if(proxies.length<5)
return;



let five =
[...proxies]
.sort(()=>Math.random()-0.5)
.slice(0,5);



let html=`


<div class="card suggest">

<b>
⭐ ۵ پروکسی پیشنهادی
</b>


`;



five.forEach(p=>{


html+=`

<div class="proxy">

${p}

</div>

`;

});


html+="</div>";



document
.getElementById("suggestions")
.innerHTML=html;


}




// ==========================
// دکمه‌ها
// ==========================


function copyProxy(i){


navigator.clipboard.writeText(
proxies[i]
);


alert("✅ کپی شد");


}




function telegram(i){


let p=proxies[i];


if(p.includes("https://t.me/proxy")){


p=p.replace(
"https://t.me/proxy",
"tg://proxy"
);


}


location.href=p;


}





async function shareProxy(i){


if(navigator.share){


await navigator.share({

title:"PAProxy",

text:proxies[i]

});


}

else{


copyProxy(i);

}


}





// ==========================
// جستجو
// ==========================


document
.getElementById("search")
.oninput=function(){


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
// شروع برنامه
// ==========================


let saved =
localStorage.getItem("proxies");


if(saved){


proxies =
JSON.parse(saved);


showProxies();


}



document
.getElementById("loadBtn")
.onclick=loadProxy;



checkIP();