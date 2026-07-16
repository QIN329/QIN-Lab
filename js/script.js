const cursor = document.querySelector(".cursor");

document.addEventListener("mousemove",(e)=>{
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
});

const stars = document.querySelectorAll(".shell");
const polaris = document.querySelector(".polaris");
const message = document.querySelector(".message-box");

const jokes = [
    "<span class=\"emoji emoji2716\"></span> Nope. This star is just pretending.",
    "<span class=\"emoji emoji2716\"></span> Wrong star. It looks important though.",
    "<span class=\"emoji emoji2716\"></span> Almost. The universe disagrees.",
    "<span class=\"emoji emoji2716\"></span> Sorry, I am only decoration.",
    "<span class=\"emoji emoji2716\"></span> Nice try.",
    "<span class=\"emoji emoji2716\"></span> Please ask Polaris."
];

let normalStars = [];

stars.forEach(star=>{
    if(!star.classList.contains("polaris")){
        normalStars.push(star);
    }
});

document.addEventListener("mousemove",(e)=>{

    stars.forEach(star=>{

        const rect = star.getBoundingClientRect();

        const x = rect.left + rect.width/2;
        const y = rect.top + rect.height/2;

        const distance = Math.sqrt(
            (e.clientX-x)**2+
            (e.clientY-y)**2
        );

        if(distance < 120){
            star.classList.add("near");
        }else{
            star.classList.remove("near");
        }

    });

});

normalStars.forEach((star,index)=>{

    star.addEventListener("click",()=>{

        message.innerHTML = jokes[index];

        message.style.display = "block";

        setTimeout(()=>{
            message.style.display = "none";
        },1800);

    });

});

const galaxy = document.querySelector(".text-galaxy");

polaris.addEventListener("click",()=>{

    document.body.classList.add("entering");

    for(let i=0;i<120;i++){

        let word = document.createElement("span");

        word.innerHTML =
        i%2===0
        ?
        "I LOVE"
        :
        "I KNOW";

        let angle = Math.random()*Math.PI*2;

        let radius = Math.random()*600+200;

        word.style.left =
        50+
        Math.cos(angle)*radius/10
        +
        "%";

        word.style.top =
        50+
        Math.sin(angle)*radius/10
        +
        "%";

        word.style.animationDelay =
        (i*0.03)+"s";

        galaxy.appendChild(word);

    }

    setTimeout(()=>{

        window.location.href =
        "home.html";

    },5200);

});