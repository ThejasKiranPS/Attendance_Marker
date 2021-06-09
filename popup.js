yearList=document.querySelector('.year-container').children;
yearList= Array.from(yearList);

function show() {
    year=this;
    year=parseInt(this.children[0].innerText)-1;
    semester=yearList[year*2+1];
    semester.classList.toggle("flex")
}

yearList.forEach((e,i) => {
    if (i==0) {
        e.onclick=show;
    }
})
