branchList = Array.from(document.querySelector(".branch-box").children);
semList = Array.from(document.querySelectorAll(".sem-box-container"));

function selected() {
  //clear
  Array.from(this.parentElement.children).forEach((e, i) => {
    if (e.classList[e.classList.length - 1] == "selected") {
      e.classList.toggle("selected");
    }
  });
  this.classList.toggle("selected");
  attlist = document.querySelector(".bottom-box-right").classList;
  if (
    document.querySelectorAll(".selected").length == 2 &&
    attlist[attlist.length - 1] != "white"
  ) {
    attlist.toggle("white");
  }
  if (Array.from(document.querySelectorAll(".selected")).length == 2) {
    fileName = getData();
    localStorage.setItem("fileName", fileName);

    chrome.storage.sync.get(`${fileName}`, (data) => {
      if (
        data[fileName] == undefined ||
        Object.keys(data[fileName]).length == 0
      ) {
        document.querySelector("#submit").innerHTML =
          'Upload <div class="arrow bottom-arrow"></div>';
        document.querySelector("#submit").onclick = () => {
          chrome.tabs.create({
            url: chrome.runtime.getURL("../upload/upload.html"),
          });
        };
      } else {
        document.querySelector("#submit").innerHTML =
          'Take Attendance <div class="arrow bottom-arrow"></div>';
        document.querySelector("#submit").onclick = () => {
          window.location.href = "../results/results.html";
        };
        document.querySelector(".download").onclick = () => {
          download(fileName + "-record");
        };
      }
    });
  }
}

branchList.forEach((e, i) => {
  e.onclick = selected;
});

semList.forEach((e, i) => {
  Array.from(e.children).forEach((e, i) => {
    e.onclick = selected;
  });
});

let fileName;
function getData() {
  let data = document.querySelectorAll(".selected");
  fileName = data[0].innerText.toLowerCase() + data[1].innerText;
  return fileName;
}
document.querySelector("#submit").onclick = getData;
document.querySelector(".settings").onclick = () => {
  window.location.href = "./settings/settings.html";
};
document.querySelector(".download").onclick = () => {};
document.querySelector(".manual").onclick = () => {
  chrome.tabs.create({
    url: "https://github.com/ThejasKiranPS/Attendance_Marker#readme",
  });
};

function moreb() {
  console.log("test");
  let morelist = ["ChE", "PE", "AE", "BE"];
  let branchBox = document.querySelector(".branch-box");
  branchBox.children[5].remove();
  morelist.forEach((b) => {
    branchBox.innerHTML += `<div class="branch clickable">${b}</div>`;
  });
  branchBox.classList.toggle("increase-height");
  branchList = Array.from(document.querySelector(".branch-box").children);
  branchList.forEach((e, i) => {
    e.onclick = selected;
  });
}
document.querySelector(".moreb").onclick = moreb;

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
function fetchDate(length = "min") {
  const d = new Date();
  if (length == "min") {
    return (
      d.getFullYear() + "-" + (parseInt(d.getMonth()) + 1) + "-" +d.getDate()
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