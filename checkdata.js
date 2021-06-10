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
let uplbtn = document.querySelector('.upload-db');
uplbtn.onclick = () => {
    console.log('clicked');
    chrome.tabs.create({url: chrome.runtime.getURL('upload.html')});
}