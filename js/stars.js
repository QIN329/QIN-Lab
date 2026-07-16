const stars = document.querySelectorAll(".star");

stars.forEach(star => {

    star.addEventListener("mouseenter", () => {

        star.style.transform = "scale(1.8)";
        star.style.boxShadow = "0 0 30px #8ecbff";

    });

    star.addEventListener("mouseleave", () => {

        star.style.transform = "scale(1)";
        star.style.boxShadow = "0 0 10px white";

    });

});