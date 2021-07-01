function cleardb() {
  if(sBranch.value=='Everything') {
    chrome.storage.sync.clear();
  }
  else {
    let key = sBranch.value+sSem.value;
    chrome.storage.sync.remove(key);
  }
  document.querySelector(".feedback").classList.toggle("no-display");
}
document.querySelector(".cleardb").onclick = cleardb;
document.querySelector(".goback").onclick = () => {
  window.location.href = "../popup.html";
};
document.querySelector(".bmac").onclick = () => {
  console.log("red");
  chrome.tabs.create({ url: "https://github.com/ThejasKiranPS" });
};
function listAll() {
  console.log("testing");
  let pList = document.querySelector('[aria-label="Participants"]');
  if (pList == null) {
    console.log(pList);
    alert("please open the list of students in google meet");
    return;
  } else {
    let list = [];
    Array.from(pList.children).forEach((child, index) => {
      list.push(
        child.children[0].children[1].children[0].children[0].innerText
      );
    });
    return list;
  }
}

function downloadStudentsList(sList) {
  var element = document.createElement("a");
  let filename = "studentsList.csv";
  function downloadList(list) {
    let csvText = processList(list);
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(csvText)
    );
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
  downloadList(sList);
}
function processList(list) {
  let csvText = "name,gname\n";
  list.forEach((student) => {
    csvText += student + "," + student + "\n";
  });
  return csvText.slice(0, -1);
}

async function saveParticipants() {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: getParticipants,
  });
}

function getParticipants() {
  function listAll() {
    let pList = document.querySelector('[aria-label="Participants"]');
    if (pList == null) {
      alert("please open the list of students in google meet");
      return;
    }

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
  ////console.log(data);
  //console.log("data saved");
}
function startDownload() {
  saveParticipants().then(() => {
    chrome.storage.sync.get("participants", (data) => {
      let participants = [...new Set(data["participants"])];
      console.log(participants);
      downloadStudentsList(participants);
    });
  });
}

let sBranch = document.querySelector("#branch-select");
let sSem = document.querySelector("#sem-select");
const branches = [
  "Everything",
  "cse",
  "me",
  "eee",
  "ece",
  "ce",
  "che",
  "pe",
  "ae",
  "be",
];
branches.forEach((b) => {
  sBranch.innerHTML += `<option value="${b}"> ${b} </option>`;
});
for (let i = 1; i < 9; i++) {
  sSem.innerHTML += `<option value="s${i}"> s${i} </option>`;
}
sBranch.onchange = () => {
  if (sBranch.value == "Everything") {
    sSem.classList.add("no-display");
  }
  else {
    sSem.classList.remove("no-display");
  }
};
document.querySelector('.get-participants').onclick= startDownload;
