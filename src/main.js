import "./css/style.css";
import { initLocalSelect, queryLocalData } from "./localSelect/localSelect.js";
import { zipDataDownload } from "./localSelect/getZipData.js";
import {
  addProvnceVillageBorderLineImg,
  addProvnceBorderLineImg,
  viewer,
  toggleBorderLineLayer,
  villageBorderImgLayer,
} from "./cesium/cesiumInit.js";

initLocalSelect();
let tempImgLayer = null,
  tempVillageImgLayer = villageBorderImgLayer;
const localForm = document.querySelector("#localForm");
localForm.addEventListener("submit", (event) => {
  event.preventDefault();
  let submitter = event.submitter;
  let handler = submitter.id;

  if (handler) {
    const localFormData = new FormData(localForm);
    queryLocalData(localFormData);
    let provnCode = document.querySelector("#provinceSelect").value;
    let layerAlpha = 1,
      borderLayerAlpha = 0.5;

    if (tempVillageImgLayer != null) {
      borderLayerAlpha = tempVillageImgLayer.alpha;
      viewer.imageryLayers.remove(tempVillageImgLayer);
      tempVillageImgLayer = null;
    }
    tempVillageImgLayer = addProvnceVillageBorderLineImg(
      viewer,
      provnCode.split("_")[0],
      1
    );
    tempVillageImgLayer.alpha = borderLayerAlpha;
    console.log(tempImgLayer, layerAlpha);
    if (tempImgLayer != null) {
      layerAlpha = tempImgLayer.alpha;
      viewer.imageryLayers.remove(tempImgLayer);
      tempImgLayer = null;
    }
    tempImgLayer = addProvnceBorderLineImg(viewer, provnCode.split("_")[0]);
    tempImgLayer.alpha = layerAlpha;

    // addProvnceBorderLine(viewer, provnCode.split("_")[0]);
  } else {
    alert(
      "An unknown or unaccepted payment type was selected. Please try again.",
      "OK"
    );
  }
});

document.querySelector("#dataDown").addEventListener("click", zipDataDownload);
document
  .querySelector("#borderLayerToggleBtn")
  .addEventListener("click", () => {
    toggleBorderLineLayer(tempImgLayer);
  });

document
  .querySelector("#villageBorderLayerToggleBtn")
  .addEventListener("click", () => {
    toggleBorderLineLayer(tempVillageImgLayer, 0.5);
  });

document
  .querySelector("#villageBorderImgLayerControl")
  .addEventListener("change", (e) => {
    tempVillageImgLayer.alpha = e.target.value / 100;
    console.log(tempVillageImgLayer.alpha);
  });
