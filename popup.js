branchList= Array.from(document.querySelector(".branch-box").children);
semList=Array.from(document.querySelectorAll(".sem-box-container"));
function selected() {
    //clear
    Array.from(this.parentElement.children).forEach((e,i) => {
        if (e.classList[e.classList.length-1]=="selected") {
            e.classList.toggle("selected");
        }
    })
    this.classList.toggle("selected");
    attlist=document.querySelector(".bottom-box-right").classList;
    if (document.querySelectorAll(".selected").length == 2 && attlist[attlist.length-1] !='white') {
        attlist.toggle("white");
    }
}
branchList.forEach(
    (e,i) => {
        e.onclick=selected;
    }
)
semList.forEach(
    (e,i) => {
        Array.from(e.children).forEach((e,i) => {
            e.onclick=selected;
        })
    }
    )
let fileName;
function getData() {
    let data= document.querySelectorAll(".selected");
    fileName= data[0].innerText.toLowerCase() + data[1].innerText;
    localStorage.setItem("fileName",fileName);
    window.location.href='./upload.html';
}
document.querySelector("#submit").onclick=getData;
