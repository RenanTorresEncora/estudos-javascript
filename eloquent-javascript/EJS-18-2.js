const textArea = document.querySelector("#page-textarea");
const pageSelector = document.querySelector("#page-selector");
const saveChangesBtn = document.querySelector("#submit-changes");

const url = "http://127.0.0.1:8000/";
fetch(url)
  .then((response) => response.text())
  .then((files) => {
    for (let file of files.split("\n")) {
      let option = document.createElement("option");
      option.textContent = file;
      pageSelector.appendChild(option);
    }
    loadCurrentFile();
  });

function loadCurrentFile() {
  fetch(pageSelector.value)
    .then((resp) => resp.text())
    .then((file) => (textArea.value = file));
}

pageSelector.addEventListener("change", loadCurrentFile);

saveChangesBtn.addEventListener("click", () => {
    fetch(url+pageSelector.value, {method: "PUT",
    body: textArea.value});
});
