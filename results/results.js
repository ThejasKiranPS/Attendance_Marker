let absentees = "";
let present = [];
let presents = "";

async function checkAttendance() {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: getParticipants,
  });
}

function getParticipants() {
  function listAll() {
    pList = document.querySelector('[aria-label="Participants"]');
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
  console.log(data);
  console.log("data saved");
}

checkAttendance().then(() => {
  let dbName = localStorage.getItem("fileName");
  chrome.storage.sync.get(`${dbName}`, (data) => {
    let students = data[dbName];
    chrome.storage.sync.get("participants", (data1) => {
      let participants = [...new Set(data1["participants"])];
      console.log(participants);
      console.log(students);
      participants.forEach((item, index) => {
        participants[index] = item.toLowerCase();
      });
      getAbs(students, participants);
    });
  });

  function getAbs(students, participants) {
    let absent = [...students];
    let notRecognised = [...participants];

    students.forEach((sitem, index) => {
      if (sitem[1] == undefined) {
        item = "";
        if (sitem[0] == "") {
          absent.splice(absent.indexOf(sitem), 1);
        }
      } else {
        item = sitem[1].toLowerCase();
      }
      if (participants.indexOf(item) != -1) {
        present.push(sitem[0]);
        absent.splice(absent.indexOf(sitem), 1);
        notRecognised.splice(notRecognised.indexOf(item), 1);
      }
    });
    // console.log(absent);
    // console.log(notRecognised);
    // console.log(present);
    // console.log('---------');
    displayResults(absent, present, notRecognised);
    document.querySelector(".mark-attendance").onclick = () => {
      markAttendance(students, absent, dbName + "-record");
      document.querySelector(".mark-attendance").innerText='Marked';
    };
  }
});

function setAbs() {
  document.querySelector(".absent").innerHTMLdbdata = absentees;
  let absBtn = document.querySelector(".abs-box");
  let prsBtn = document.querySelector(".prs-box");
  if (Array.from(absBtn.classList).indexOf("rselect") != -1) {
    return;
  } else {
    absBtn.classList.toggle("rselect");
    prsBtn.classList.toggle("gselect");
  }
}
function setPresent() {
  document.querySelector(".absent").innerHTML = presents;
  let absBtn = document.querySelector(".abs-box");
  let prsBtn = document.querySelector(".prs-box");
  if (Array.from(prsBtn.classList).indexOf("gselect") != -1) {
    return;
  } else {
    absBtn.classList.toggle("rselect");
    prsBtn.classList.toggle("gselect");
  }
}
document.querySelector(".abs-box").onclick = setAbs;
document.querySelector(".prs-box").onclick = setPresent;

function getAttendance(students, absent) {
  let attendance = [];
  for (let i = 0; i < students.length; i++) {
    attendance.push(1);
    students[i] = students[i][0];
  }
  // console.log('afterthis');
  // console.log(students);
  // console.log(absent);
  absent.forEach((value) => {
    attendance[students.indexOf(value[0])] = 0;
  });

  return attendance.toString();
}

function createcsvH(data) {
  csvH = "name,";
  data.forEach((value) => {
    csvH += value + ",";
  });
  csvH = csvH.substring(0, csvH.length - 1);
  return csvH;
}
function fetchDate(length = "min") {
  const d = new Date();
  if (length == "min") {
    return (
      d.getDate() + "-" + (parseInt(d.getMonth()) + 1) + "-" + d.getFullYear()
    );
  } else {
    return (
      d.getDate() +
      "-" +
      (parseInt(d.getMonth()) + 1) +
      "-" +
      d.getFullYear() +
      "_" +
      d.getHours() +
      ":" +
      d.getMinutes()
    );
  }
}
function markAttendance(students, absent, dbName) {
  let attendance = getAttendance(students, absent);
  chrome.storage.sync.get(dbName, (record) => {
    if (Object.keys(record).length == 0) {
      console.log("adding");
      newRecord(dbName, students);
    }
    updateRecord(dbName, attendance);
    console.log("updated");
    console.log(record);
  });
}

function download(recordName) {
  var element = document.createElement("a");
  let filename = recordName + "_" + fetchDate("max") + ".csv";
  chrome.storage.sync.get(recordName, (data) => {
    downloadRecord(data[recordName]);
  });
  function downloadRecord(record) {
    let csvText = processCsv(record);
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
}
function processCsv(record) {
  let csvText = "";
  csvText += record.csvH;
  for (const i in record) {
    if (i != "csvH") {
      csvText += "\n" + i + ",";
      csvText += record[i].toString();
    }
  }
  return csvText;
}
function displayResults(absent, present, notRecognised) {
  absent.forEach((student) => {
    absentees += `<div class="box item-box">${student[0]}</div>`;
  });
  present.forEach((student) => {
    presents += `<div class="box item-box">${student}</div>`;
  });
  let notRs = "";
  notRecognised.forEach((student) => {
    notRs += `<div class="box item-box">${student}</div>`;
  });
  document.querySelector(".notR").innerHTML += notRs;
  document.querySelector(".absent").innerHTML += absentees;

  //number of students
  document.querySelector(".abs-box").innerHTML += " ( " + absent.length + " )";
  document.querySelector(".prs-box").innerHTML += " ( " + present.length + " )";
  document.querySelector(".ncount").innerHTML +=
    " ( " + notRecognised.length + " )";
}

function newRecord(dbName, students) {
  let csvH = createcsvH(students);
  let record = {};
  record[dbName] = { csvH: csvH };
  console.log(record);
  chrome.storage.sync.set(record);
  console.log("added");
}

function updateRecord(dbName, attendance) {
  chrome.storage.sync.get(dbName, (recordData) => {
    recordData = recordData[dbName];
    let date = fetchDate();
    date = "19-9-2021";
    recordData[date] = attendance;
    let record = {};
    record[`${dbName}`] = recordData;
    chrome.storage.sync.set(record);
  });
}
