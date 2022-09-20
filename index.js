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
  let baseChars = "abcdefghijklmnopqrstuvwxyz";
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

  sliderOutput.textContent = slider.value;

  function savePass() {
    let formData = {};
    userForm.querySelectorAll("input").forEach((singleInput, index) => {
      if (singleInput.type === "checkbox") {
        formData[index] = singleInput.checked;
      } else {
        formData[index] = singleInput.value;
      }
      localStorage.setItem("formData", JSON.stringify(formData));
    });

    const passWraper = createMyElement("div", {
      textContent: password.join(""),
    });
    const saveBtn = createMyElement("button", { textContent: "Save" });

    content.append(passWraper, saveBtn);

    saveBtn.addEventListener("click", () => {
      content.innerHTML = null;
      const saveForm = createMyElement("form", { id: "saveForm" });
      const passLabel = createMyElement("label", {
        textContent: "GENERATED PASSWORD",
      });
      const passWrap = createMyElement("div", {
        textContent: password.join(""),
      });
      const pageInput = createMyElement("input", { name: "webUrl" });
      const userNameInput = createMyElement("input", { name: "userName" });
      const pageLabel = createMyElement("label", {
        textContent: "Insert page URL",
      });
      const userNameLabel = createMyElement("label", {
        textContent: "Insert User name",
      });
      const saveBtn = createMyElement("button", {
        textContent: "SAVE",
        type: "submit",
      });

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

    const lineWrap = createMyElement("div", { classList: "line" });

    Object.entries(singleObj).forEach((valueArr) => {
      const infoBlock = createMyElement("div", {});
      if (valueArr[0] === "password") {
        infoBlock.textContent = "•".repeat(valueArr[1].length);
        infoBlock.setAttribute("id", "password");
        currentPassword = valueArr[1];
      } else {
        infoBlock.textContent = valueArr[1];
      }
      lineWrap.append(infoBlock);
    });

    const btnWrap = createMyElement("div", {});
    const showPassBtn = createMyElement("button", { textContent: "SHOW PASS" });

    function showHide(parent, child) {
      parent.append(child);
      parent.firstChild.remove();
      let passBox = "";
      if (child.textContent === "HIDE") {
        passBox = currentPassword;
      } else {
        passBox = "•".repeat(currentPassword.length);
      }
      document.querySelectorAll("#password")[index].textContent = passBox;
    }

    showPassBtn.addEventListener("click", () => {
      const hideBtn = createMyElement("button", { textContent: "HIDE" });
      showHide(btnWrap, hideBtn);

      hideBtn.addEventListener("click", () => {
        showHide(btnWrap, showPassBtn);
      });
    });

    btnWrap.append(showPassBtn);
    lineWrap.append(btnWrap);
    contentDiv.append(lineWrap);
  });
}

function createMyElement(tag, attributes) {
  const myElement = document.createElement(tag);

  Object.entries(attributes).forEach((singleAttribute) => {
    myElement[singleAttribute[0]] = singleAttribute[1];
  });

  return myElement;
}

window.addEventListener("DOMContentLoaded", (e) => {
  if (localStorage.getItem("pass")) {
    let passData = JSON.parse(localStorage.getItem("pass"));
    passData.forEach((singleObj) => {
      dataList.push(singleObj);
    });
    renderContacts(passData);
  }
  if (localStorage.getItem("formData")) {
    const allInputs = userForm.querySelectorAll("input");
    let formData = JSON.parse(localStorage.getItem("formData"));
    Object.entries(formData).forEach((singleInput) => {
      if (allInputs[singleInput[0]].type === "checkbox") {
        allInputs[singleInput[0]].checked = singleInput[1];
      } else {
        allInputs[singleInput[0]].value = Number(singleInput[1]);
        sliderOutput.textContent = singleInput[1];
      }
    });
  }
});
