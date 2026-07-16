const polaris =
document.getElementById(
"polaris"
);



let enter=false;



polaris.addEventListener(
"click",
()=>{


if(enter)

return;



enter=true;




// 开始宇宙收缩

setTimeout(()=>{


document.body.classList.add(
"galaxy-transition"
);



},3000);







// 进入下一页

setTimeout(()=>{


window.location.href =
"home.html";



},5500);



});