import "./css/style.css";

import {
  addProvnceVillageBorderLineImg,
  addProvnceBorderLineImg,
  viewer,
  villageBorderImgLayer,
  ESRIIMG,
} from "./cesium/cesiumInit.js";

window.onload = function () {
  import("./localSelect/localSelect.js").then(({ initLocalSelect }) => {
    initLocalSelect();
  });
};

document.querySelector(".cesium-baseLayerPicker-selected").addEventListener(
  "click",
  (e) => {
    import("./cesium/cesiumProvideModel.js").then(
      ({
        ESRIStreet,
        ESRINation,
        TIANDITUTERR,
        TIANDITUIMG,
        TIANDITUVECTOR,
        AMAPImage,
        AMAPVector,
        AMAPVCva,
        baiduImg,
        baiduNormal,
        baiduDark,
        baiduNote,
        GOOGLEIMG,
        GOOGLEPATHIMG,
        GOOGLEPATHPLUSIMG,
      }) => {
        viewer.baseLayerPicker.viewModel.imageryProviderViewModels.push(
          ...[
            // SentinelLandCover2021,
            ESRIIMG,
            ESRIStreet,
            ESRINation,
            TIANDITUTERR,
            TIANDITUIMG,
            TIANDITUVECTOR,
            AMAPImage,
            AMAPVector,
            AMAPVCva,
            baiduImg,
            baiduNormal,
            baiduDark,
            baiduNote,
            GOOGLEIMG,
            GOOGLEPATHIMG,
            GOOGLEPATHPLUSIMG,
          ]
        );
      }
    );
  },
  { once: true }
);

let tempImgLayer = null,
  tempVillageImgLayer = villageBorderImgLayer;

const localForm = document.querySelector("#localForm");
localForm.addEventListener("submit", (event) => {
  event.preventDefault();
  let submitter = event.submitter;
  let handler = submitter.id;

  if (handler) {
    const localFormData = new FormData(localForm);

    import("./localSelect/localSelect.js").then(({ queryLocalData }) => {
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
    });
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
    import("./cesium/cesiumInit.js").then(({ toggleBorderLineLayer }) => {
      toggleBorderLineLayer(tempImgLayer);
    });
  });

document
  .querySelector("#villageBorderLayerToggleBtn>div")
  .addEventListener("click", (e) => {
    e.target.classList.contains("inactive")
      ? e.target.classList.remove("inactive")
      : e.target.classList.add("inactive");
    import("./cesium/cesiumInit.js").then(({ toggleBorderLineLayer }) => {
      toggleBorderLineLayer(tempVillageImgLayer, 0.5);
    });
  });

document
  .querySelector("#villageBorderImgLayerControl")
  .addEventListener("change", (e) => {
    tempVillageImgLayer.alpha = e.target.value / 100;
  });
