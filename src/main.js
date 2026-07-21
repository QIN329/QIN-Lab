import "./style.css";

const app=document.querySelector("#app");

app.innerHTML=`

<main class="universe">

    <!-- 背景星空 -->
    <div id="stars"></div>

    <!-- 小熊座 -->
    <div class="ursa">

        <span class="star s1"></span>
        <span class="star s2"></span>
        <span class="star s3"></span>
        <span class="star s4"></span>
        <span class="star s5"></span>
        <span class="star s6"></span>

        <!-- 北极星 -->
        <span class="star polaris"></span>

    </div>

    <!-- 对话 -->
    <div class="dialog">

        <div class="love">
            I LOVE
        </div>

        <div class="know">
            I KNOW
        </div>

    </div>

</main>

`;

// ======================
// 北极星 Hover
// ======================

const polaris=document.querySelector(".polaris");

polaris.addEventListener("mouseenter",()=>{
    polaris.classList.add("active");
});

polaris.addEventListener("mouseleave",()=>{
    polaris.classList.remove("active");
});

// ======================
// 生成20颗背景星
// ======================

const stars=document.querySelector("#stars");

const colors=[
    "#ffffff",
    "#f5f8ff",
    "#d8ecff",
    "#fff8df"
];

for(let i=0;i<20;i++){

    const star=document.createElement("span");

    star.className="bg-star";

    star.style.left=Math.random()*100+"%";
    star.style.top=Math.random()*100+"%";

    const size=1+Math.random()*3;

    star.style.width=size+"px";
    star.style.height=size+"px";

    star.style.background=colors[Math.floor(Math.random()*colors.length)];

    star.style.animationDuration=(4+Math.random()*4)+"s";

    star.style.animationDelay=Math.random()*5+"s";

    stars.appendChild(star);
}

// ======================
// 点击北极星
// ======================

const know=document.querySelector(".know");

let started=false;

polaris.addEventListener("click",()=>{
    if(started)return;

    started=true;

    know.classList.add("show");
});