async function checkAttendance() {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: getParticipants,
  });
}

function getParticipants() {
  function listAll() {
    pList = document.querySelector('[aria-label="Participants"]');
    let list = [];
    Array.from(pList.children).forEach((child, index) => {
      list.push(
        child.children[0].children[1].children[0].children[0].innerText
      );
    });
    return list;
  }
  let data = {};
  data["participants"] = listAll();
  chrome.storage.sync.set(data);
}
checkAttendance();

let dbName = localStorage.getItem("fileName");
chrome.storage.sync.get(`${dbName}`, (data) => {
  let students = data[dbName];
  chrome.storage.sync.get("participants", (data1) => {
    let participants = [...new Set(data1["participants"])];
    console.log(participants);
    console.log(students);
    participants.forEach((item,index) => { participants[index]=item.toLowerCase();});
    getAbs(students,participants);
  });
});



function getAbs(students, participants) {
    let absent=[...students];
    let notRecognised=[...participants];

  students.forEach((sitem, index) => {
      item=sitem[1].toLowerCase();
    if (participants.indexOf(item) != -1) {
      absent.splice(absent.indexOf(sitem), 1);
      notRecognised.splice(notRecognised.indexOf(item), 1);
    }
  });
  console.log(absent);
  console.log(notRecognised);
}
