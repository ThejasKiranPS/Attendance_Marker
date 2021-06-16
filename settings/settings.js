function cleardb() {
    chrome.storage.sync.clear();
    document.querySelector('.feedback').classList.toggle('no-display');
}
document.querySelector('.cleardb').onclick = cleardb;
document.querySelector('.goback').onclick = () => {
    window.location.href='../popup.html';
};
document.querySelector('.bmac').onclick = () => {
    console.log('red');
    chrome.tabs.create({ url:'https://github.com/ThejasKiranPS'});
};