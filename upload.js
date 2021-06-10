let fileName=localStorage.getItem("fileName");
let dbName=fileName;

function redirectIfExists() {
    let list={};
    chrome.storage.sync.get(`${dbName}`,(data) => {list=data;})
    if (Object.keys(list).length!=0) {
        window.location.href='./results.html';
    }
}
redirectIfExists();

let branchName= fileName.substring(0,fileName.length-2).toUpperCase();
let semName= fileName.substring(fileName.length-2);
fileName=' '+branchName+ ' ' + semName;
document.querySelector(".fileName").innerText=fileName;

document.getElementById('btn-upload').addEventListener('click', (e) => {
    console.log('click');
    e.preventDefault();
    Papa.parse(document.getElementById('upload-csv').files[0], {
        download:true,
        header:false,
        complete: (results) => {
            console.log(results);
            saveToLocal(results);
        }
    })
});

function saveToLocal(data){
    let results={};
    data['data'].shift();
    results[dbName]=data['data']; 
    chrome.storage.sync.set(results);
}
