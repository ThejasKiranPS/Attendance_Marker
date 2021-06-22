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
  ////console.log(data);
  //console.log("data saved");
}

checkAttendance().then(() => {
  let dbName = localStorage.getItem("fileName");
  chrome.storage.sync.get(`${dbName}`, (data) => {
    let students = data[dbName];
    chrome.storage.sync.get("participants", (data1) => {
      let participants = [...new Set(data1["participants"])];
      ////console.log(participants);
      //console.log(students);
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
        present.push(sitem);
        absent.splice(absent.indexOf(sitem), 1);
        notRecognised.splice(notRecognised.indexOf(item), 1);
      }
    });
    // console.log(absent);
    // console.log(notRecognised);
    // console.log(present);
    displayResults(dbName, students, absent, present, notRecognised);
  }
});

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
  csvH = "";
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
      d.getDate()+ "-" + (parseInt(d.getMonth()) + 1) + "-" +d.getFullYear()
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
    //console.log(record);
    if (Object.keys(record).length == 0) {
      //console.log("adding");
      newRecord(dbName, students);
    }
    updateRecord(dbName, attendance);
    //console.log("updated");
    //console.log(record);
  });
}

function displayResults(dbName, students, absent, present, notRecognised) {
  //console.log(absent,present,notRecognised);
  function setActions() {
    //console.log('fncalled');
    let abtns = document.querySelectorAll(".absent-container");
    Array.from(abtns).forEach((e) => {
      e.onmouseover = () => {
        e.children[1].classList.toggle("slide-show");
      };
      e.onmouseout = () => {
        e.children[1].classList.toggle("slide-show");
      };
      e.children[1].onclick = () => {
        console.log('delete btn callled');
        const index = Array.from(abtns).indexOf(e);
        present.push(absent[index]);
        absent.splice(index, 1);
        //console.log(absent);
        //console.log(present);
        displayResults(dbName, students, absent, present, notRecognised);
      };
    });
  }

  //console.log('settingactions');
  //console.log(absent,present,notRecognised);
  absentees = "";
  presents = "";
  absent.forEach((student) => {
    absentees += `<div class="absent-container clickable"><div class="box item-box">${student[0]}</div><div class="remove-container">delete</div></div>`;
  });
  present.forEach((student) => {
    presents += `<div class="box item-box">${student[0]}</div>`;
  });
  let notRs = "";
  notRecognised.forEach((student) => {
    notRs += `<div class="box item-box">${student}</div>`;
  });
  document.querySelector(".notR").innerHTML = notRs;
  setAbs();
  //number of students
  document.querySelector(".abs-box").innerHTML =
    "Absent ( " + absent.length + " )";
  document.querySelector(".prs-box").innerHTML =
    "Present ( " + present.length + " )";
  document.querySelector(".ncount").innerHTML =
    "Not Recognised ( " + notRecognised.length + " )";
  setActions();

  function setAbs() {
    document.querySelector(".absent").innerHTML = absentees;
    let absBtn = document.querySelector(".abs-box");
    let prsBtn = document.querySelector(".prs-box");
    if (Array.from(absBtn.classList).indexOf("rselect") != -1) {
      return;
    } else {
      setActions();
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
  document.querySelector(".mark-attendance").onclick = () => {
    markAttendance(students, absent, dbName + "-record");
    document.querySelector(".mark-attendance").innerText = "Marked";
  };
}

function newRecord(dbName, students) {
  let csvH = createcsvH(students);
  let record = {};
  record[dbName] = {
    data: [{ name: csvH }],
    dateList: [],
  };
  console.log(record);
  chrome.storage.sync.set(record);
  console.log("added");
}

function updateRecord(dbName, attendance) {
  chrome.storage.sync.get(dbName, (recordData) => {
    let data = recordData[dbName]["data"];
    let dateList = recordData[dbName]["dateList"];
    let date = fetchDate();
    //recordData[date] = attendance;
    console.log(dateList);
    console.log(dateList[dateList.length - 1]);
    console.log(dateList.length);
    if (dateList[dateList.length - 1] != date || dateList.length == 0) {
      dateList.push(date);
      data.push({ [date]: attendance });
    } else {
      dateList.pop();
      dateList.push(date);
      data.pop();
      data.push({ [date]: attendance });
    }
    let record = {};
    record[`${dbName}`] = {
      data: data,
      dateList: dateList,
    };
    console.log(record);
    console.log("updated");
    chrome.storage.sync.set(record);
  });
}
