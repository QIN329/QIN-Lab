const polaris = document.getElementById("polaris");

polaris.onclick = function(){

    document.body.classList.add("warp");

    setTimeout(()=>{

        window.location.href = "home.html";

    },1500);

};