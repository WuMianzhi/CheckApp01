import "./css/style.css";
import { initLocalSelect, queryLocalData } from "./localSelect/localSelect.js";
import { zipDataDownload } from "./localSelect/getZipData.js";
import {
  addProvnceBorderLineImg,
  viewer,
} from "./cesium/cesiumInit.js";

initLocalSelect();
let tempImgLayer = null;
const localForm = document.querySelector("#localForm");
localForm.addEventListener("submit", (event) => {
  event.preventDefault();
  let submitter = event.submitter;
  let handler = submitter.id;

  if (handler) {
    const localFormData = new FormData(localForm);
    queryLocalData(localFormData);
    let provnCode = document.querySelector("#provinceSelect").value;
    if (tempImgLayer === tempImgLayer) {
      viewer.imageryLayers.remove(tempImgLayer);
      tempImgLayer = null;
    }
    tempImgLayer = addProvnceBorderLineImg(viewer, provnCode.split("_")[0]);

    // addProvnceBorderLine(viewer, provnCode.split("_")[0]);
  } else {
    alert(
      "An unknown or unaccepted payment type was selected. Please try again.",
      "OK"
    );
  }
});

document.querySelector("#dataDown").addEventListener("click", zipDataDownload);
