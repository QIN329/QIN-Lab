const cursor = document.getElementById("cursorStar");


document.addEventListener(
    "mousemove",
    (e)=>{

        cursor.style.left =
        e.clientX - 7 + "px";


        cursor.style.top =
        e.clientY - 7 + "px";


    }
);