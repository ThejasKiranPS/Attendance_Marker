yearList=document.querySelector('.year-container').children;
yearList= Array.from(yearList);

function hide() {
    yearList.forEach((e,i) => {
        if(i%2==1) {
            cList=e.classList;
            if(cList[cList.length-1]=="flex") {
            e.classList.toggle("flex");
            }
        }
    })
}
function show() {
    hide();
    year=this;
    year=parseInt(this.children[0].innerText)-1;
    semester=yearList[year*2+1];
    semester.classList.toggle("flex");
}

yearList.forEach((e,i) => {
    if (i%2==0) {
        e.onclick=show;
    }
})
