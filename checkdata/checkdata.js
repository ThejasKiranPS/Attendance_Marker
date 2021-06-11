let dbName = localStorage.getItem("fileName");
chrome.storage.sync.get(`${dbName}`, (data) => {
    if (Object.keys(data[dbName]).length != 0) {

            console.log('redirecting');
            window.location.href = '../results/results.html';
        }
})
let uplbtn = document.querySelector('.upload-db');
uplbtn.onclick = () => {
    console.log('clicked');
    chrome.tabs.create({ url: chrome.runtime.getURL('../upload/upload.html') });
}