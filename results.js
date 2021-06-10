async function checkAttendance() {
    let [tab] = await chrome.tabs.query({active:true, currentWindow:true});
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        function: getParticipants,
    });
}
function getParticipants() {
    function listAll() {
        pList=document.querySelector('[aria-label="Participants"]');
        let list=[]
        Array.from(pList.children).forEach((child,index) => {list.push(child.children[0].children[1].children[0].children[0].innerText);});
        return list;
    }
    let data={};
    data['participants']=listAll();
    chrome.storage.sync.set(data);
}
checkAttendance();
