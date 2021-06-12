let absentees='';
let present=[];
let presents='';


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
    if(pList==null) {
      alert('please open the list of students in google meet');
      return
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
  console.log('data saved');
}

checkAttendance().then(() => {


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
      if(sitem[1]==undefined) {
          item="";
          if (sitem[0]=="") {
            absent.splice(absent.indexOf(sitem), 1);
          }
      }
      else {
      item=sitem[1].toLowerCase();
      }
    if (participants.indexOf(item) != -1) {
      present.push(sitem[0]);
      absent.splice(absent.indexOf(sitem), 1);
      notRecognised.splice(notRecognised.indexOf(item), 1);
    }
  });
  console.log(absent);
  console.log(notRecognised);
  console.log(present);
  console.log('---------')



  absent.forEach((student) => {
    absentees+= `<div class="box item-box">${student[0]}</div>`;
  })
  present.forEach((student) => {
    presents+= `<div class="box item-box">${student}</div>`;
  })
  let notRs='';
  notRecognised.forEach((student) => {
    notRs+= `<div class="box item-box">${student}</div>`;

  })
  document.querySelector(".notR").innerHTML+=notRs;
  document.querySelector(".absent").innerHTML+=absentees;

  document.querySelector(".abs-box").innerHTML+=' ( '+absent.length + ' )';
  document.querySelector(".prs-box").innerHTML+=' ( '+present.length + ' )';
  document.querySelector(".ncount").innerHTML+=' ( '+notRecognised.length + ' )';

}
});

function setAbs() {
  document.querySelector(".absent").innerHTML=absentees;
  let absBtn=document.querySelector('.abs-box');
  let prsBtn=document.querySelector('.prs-box');
  if (Array.from(absBtn.classList).indexOf('rselect') != -1) {
    return
  }
  else {
    absBtn.classList.toggle('rselect');
    prsBtn.classList.toggle('gselect');

  }
}
function setPresent() {
  document.querySelector(".absent").innerHTML=presents;
  let absBtn=document.querySelector('.abs-box');
  let prsBtn=document.querySelector('.prs-box');
  if (Array.from(prsBtn.classList).indexOf('gselect') != -1) {
    return
  }
  else {
    absBtn.classList.toggle('rselect');
    prsBtn.classList.toggle('gselect');

  }
}
document.querySelector('.abs-box').onclick=setAbs;
document.querySelector('.prs-box').onclick=setPresent;