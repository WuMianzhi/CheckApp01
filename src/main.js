import "./css/style.css";
import { queryLocalData } from "./localSelect/localSelect.js";
// import { zipDataDownload } from "./localSelect/getZipData.js";
import {
  addProvnceVillageBorderLineImg,
  addProvnceBorderLineImg,
  viewer,
  toggleBorderLineLayer,
  villageBorderImgLayer,
} from "./cesium/cesiumInit.js";

window.onload = function () {  
  import("./localSelect/localSelect.js").then(({ initLocalSelect }) => {
    initLocalSelect();
  });
}

let tempImgLayer = null,
  tempVillageImgLayer = villageBorderImgLayer;

const localForm = document.querySelector("#localForm");
localForm.addEventListener("submit", (event) => {
  event.preventDefault();
  let submitter = event.submitter;
  let handler = submitter.id;

  if (handler) {
    const localFormData = new FormData(localForm);
    // import("./localSelect/localSelect.js").then(({ initLocalSelect }) => {
    //   initLocalSelect();
    // });

    // 查询数据
    queryLocalData(localFormData);

    // 按省份添加边界数据
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
    tempVillageImgLayer.show = false;
    tempVillageImgLayer.alpha = borderLayerAlpha;

    if (tempImgLayer != null) {
      layerAlpha = tempImgLayer.alpha;
      viewer.imageryLayers.remove(tempImgLayer);
      tempImgLayer = null;
    }
    tempImgLayer = addProvnceBorderLineImg(viewer, provnCode.split("_")[0]);
    tempImgLayer.alpha = layerAlpha;
  } else {
    alert(
      "An unknown or unaccepted payment type was selected. Please try again.",
      "OK"
    );
  }
});

// 异步导入
document.querySelector("#dataDown").addEventListener("click", function () {
  import("./localSelect/getZipData.js").then(({ zipDataDownload }) => {
    zipDataDownload();
  });
});

document
  .querySelector("#borderLayerToggleBtn")
  .addEventListener("click", () => {
    toggleBorderLineLayer(tempImgLayer);
  });

document
  .querySelector("#villageBorderLayerToggleBtn>div")
  .addEventListener("click", (e) => {
    e.target.classList.contains("inactive")
      ? e.target.classList.remove("inactive")
      : e.target.classList.add("inactive");
    toggleBorderLineLayer(tempVillageImgLayer, 0.5);
  });

document
  .querySelector("#villageBorderImgLayerControl")
  .addEventListener("change", (e) => {
    tempVillageImgLayer.alpha = e.target.value / 100;
  });
