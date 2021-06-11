function cleardb() {
    let branches=[
        'cse',
        'me',
        'eee',
        'ece',
        'ce'
    ];
    let dbName='';
    branches.forEach((branch) => {
        for (let s=1;s<=8;s++) {
            results[`${branch}s${s}`]={}; 
            chrome.storage.sync.set(results);
        }
    })
}
