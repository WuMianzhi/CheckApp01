import "./css/style.css";
import { initLocalSelect, queryLocalData } from "./localSelect/localSelect.js";
import { zipDataDownload } from "./localSelect/getZipData.js";

initLocalSelect();

const localForm = document.querySelector("#localForm");
localForm.addEventListener("submit", (event) => {
  event.preventDefault();
  let submitter = event.submitter;
  let handler = submitter.id;

  if (handler) {
    const localFormData = new FormData(localForm);
    queryLocalData(localFormData);
  } else {
    alert(
      "An unknown or unaccepted payment type was selected. Please try again.",
      "OK"
    );
  }
});

document.querySelector("#dataDown").addEventListener("click", zipDataDownload);
