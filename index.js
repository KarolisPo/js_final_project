const content = document.querySelector(".content");
const slider = document.querySelector(".slider");
const sliderOutput = document.querySelector(".sliderOutput");
const userForm = document.querySelector("#userInputForm");

let dataList = [];

sliderOutput.textContent = slider.value;
slider.oninput = function () {
  sliderOutput.innerHTML = this.value;
};

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

let charactersObj = {
  capLetters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  specChar: "!#$%&'*+/|><?_[]",
};

userForm.addEventListener("submit", (e) => {
  content.innerHTML = null;
  baseChars = "abcdefghijklmnopqrstuvwxyz";
  e.preventDefault();
  const passLength = document.querySelector("#passLength");

  password = [];

  document.querySelectorAll(".chkBox").forEach((singleCheck, index) => {
    if (singleCheck.checked) {
      switch (index) {
        case 0:
          baseChars += charactersObj.capLetters;
          break;
        case 1:
          baseChars += charactersObj.numbers.repeat(2);
          break;
        case 2:
          baseChars += charactersObj.specChar.repeat(3);
          break;
      }
    }
  });

  for (let i = 0; i < passLength.value; i++) {
    password.push(baseChars.split("")[getRandomInt(baseChars.length)]);
  }

  console.log(password.join(""));
  sliderOutput.textContent = slider.value;

  function savePass() {
    const passWraper = document.createElement("div");
    const saveBtn = document.createElement("button");

    saveBtn.textContent = "SAVE";
    passWraper.textContent = password.join("");
    content.append(passWraper, saveBtn);

    saveBtn.addEventListener("click", () => {
      e.target.reset();
      content.innerHTML = null;
      const saveForm = document.createElement("form");
      const passLabel = document.createElement("label");
      const passWrap = document.createElement("div");
      const pageInput = document.createElement("input");
      const userNameInput = document.createElement("input");
      const pageLabel = document.createElement("label");
      const userNameLabel = document.createElement("label");
      const saveBtn = document.createElement("button");

      passLabel.textContent = "GENERATED PASSWORD";
      passWrap.textContent = password.join("");
      pageLabel.textContent = "Insert page url";
      userNameLabel.textContent = "Insert user name";
      saveBtn.textContent = "SAVE";

      saveForm.setAttribute("id", "saveForm");
      userNameInput.setAttribute("name", "userName");
      pageInput.setAttribute("name", "webUrl");
      saveBtn.setAttribute("type", "submit");

      saveForm.append(
        passLabel,
        passWrap,
        pageLabel,
        pageInput,
        userNameLabel,
        userNameInput,
        saveBtn
      );

      content.append(saveForm);

      saveForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const passObject = {};
        saveForm.querySelectorAll("input").forEach((singleInput) => {
          passObject[`${singleInput.getAttribute("name").toLowerCase()}`] =
            singleInput.value;
        });
        passObject.password = password.join("");
        dataList.push(passObject);
        renderContacts(dataList);
        localStorage.setItem("pass", JSON.stringify(dataList));
      });
    });
  }

  savePass();
});

function renderContacts(objArray) {
  const contentDiv = document.querySelector(".passTable");
  contentDiv.innerHTML = null;
  
  objArray.forEach((singleObj, index) => {
    let currentPassword = "";

    const lineWrap = document.createElement("div");
    lineWrap.classList.add("line");

    Object.entries(singleObj).forEach((valueArr) => {
      const infoBlock = document.createElement("div");
      if (valueArr[0] === "password") {
        infoBlock.textContent = "•".repeat(valueArr[1].length);
        infoBlock.setAttribute("id", "password");
        currentPassword = valueArr[1];
      } else {
        infoBlock.textContent = valueArr[1];
      }
      lineWrap.append(infoBlock);
    });

    const btnWrap = document.createElement("div");
    const showPassBtn = document.createElement("button");
    showPassBtn.textContent = "SHOW PASSWORD";

    showPassBtn.addEventListener("click", () => {
      const hideBtn = document.createElement("button");
      hideBtn.textContent = "HIDE";
      btnWrap.append(hideBtn);
      btnWrap.firstChild.remove();
      document.querySelectorAll("#password")[index].textContent =
        currentPassword;

      hideBtn.addEventListener("click", () => {
        btnWrap.append(showPassBtn);
        btnWrap.firstChild.remove();
        document.querySelectorAll("#password")[index].textContent = "•".repeat(
          currentPassword.length
        );
      });
    });

    btnWrap.append(showPassBtn);
    lineWrap.append(btnWrap);
    contentDiv.append(lineWrap);
  });
}

window.addEventListener("DOMContentLoaded", (e) => {
  if (localStorage.getItem("pass")) {
    let passData = JSON.parse(localStorage.getItem("pass"));
    passData.forEach((singleObj) => {
      dataList.push(singleObj);
    });
    renderContacts(passData);
  }
});

console.log(dataList);
