function cleardb() {
    let branches=[
        'cse',
        'me',
        'eee',
        'ece',
        'ce'
    ];
    let dbName='';
    let results={};
    branches.forEach((branch) => {
        for (let s=1;s<=8;s++) {
            results={}
            results[`${branch}s${s}`]={}; 
            chrome.storage.sync.set(results,() => {
                chrome.storage.sync.get(`${branch}s${s}`,(datat) => {
                    console.log(datat);
                })
            });
            console.log('db cleared');
            console.log(branch,s);
        }
    })
}
document.querySelector('.cleardb').onclick = cleardb;
document.querySelector('.goback').onclick = () => {
    window.location.href='../popup.html';
};
document.querySelector('.bmac').onclick = () => {
    console.log('red');
    chrome.tabs.create({ url:'https://github.com/ThejasKiranPS'});

};