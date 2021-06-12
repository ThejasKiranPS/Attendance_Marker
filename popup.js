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
    if (Array.from(document.querySelectorAll('.selected')).length == 2) {
        let data= document.querySelectorAll(".selected");
        fileName= data[0].innerText.toLowerCase() + data[1].innerText;
        localStorage.setItem("fileName",fileName);


        chrome.storage.sync.get(`${fileName}`, (data) => {
            if (data[fileName] == undefined || Object.keys(data[fileName]).length == 0) {
                document.querySelector('#submit').innerHTML='Upload <div class="arrow bottom-arrow"></div>';
                document.querySelector('#submit').onclick=() => {     chrome.tabs.create({ url: chrome.runtime.getURL('../upload/upload.html') }) };
                }
            else {
            document.querySelector('#submit').innerHTML='Take Attendance <div class="arrow bottom-arrow"></div>';
            document.querySelector('#submit').onclick=() => { window.location.href = '../results/results.html'; };

            }
        })
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
    window.location.href='./checkdata/checkdata.html';
}
document.querySelector("#submit").onclick=getData;
document.querySelector(".settings").onclick=() => {
    window.location.href='./settings/settings.html';
};

function moreb() {
    console.log('test');
    let morelist=['ChE','PE','AE','BE'];
    let branchBox=document.querySelector(".branch-box");
    branchBox.children[5].remove();
    morelist.forEach((b) => {
        branchBox.innerHTML+=`<div class="branch clickable">${b}</div>`;
    });
    branchBox.classList.toggle('increase-height');
    branchList= Array.from(document.querySelector(".branch-box").children);
    branchList.forEach(
        (e,i) => {
            e.onclick=selected;
        }
    )
}
document.querySelector(".moreb").onclick=moreb;
