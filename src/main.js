import "./css/style.css";

import {
  addProvnceVillageBorderLineImg,
  addProvnceBorderLineImg,
  viewer,
  villageBorderImgLayer,
  toggleBorderLineLayer,
  ESRIIMG,
} from "./cesium/cesiumInit.js";
import { addAlphaAndIcon } from "./cesium/customCesium.js";

// 点击展开图层的时候异步加载对应的 js 模块
document.querySelector(".cesium-baseLayerPicker-selected").addEventListener(
  "click",
  (e) => {
    import(
      /* webpackChunkName: "cesiumProvideModel" */ "./cesium/cesiumProvideModel.js"
    ).then(
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

    import(
      /* webpackChunkName: "localSelect" */ "./localSelect/localSelect.js"
    ).then(({ queryLocalData }) => {
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
  import(
    /* webpackChunkName: "getZipData" */ "./localSelect/getZipData.js"
  ).then(({ zipDataDownload }) => {
    zipDataDownload();
  });
});

window.onload = function () {
  import(
    /* webpackChunkName: "localSelect" */ "./localSelect/localSelect.js"
  ).then(({ initLocalSelect }) => {
    initLocalSelect();
  });

  import(
    /* webpackChunkName: "cesiumImagerLayer" */ "./cesium/cesiumImageryLayer.js"
  ).then(
    ({
      TIANDITUCN,
      SentinelLandCover2021,
      ESALandCover,
      ESALandCover2021,
      WSF2019,
    }) => {
      // 添加额外的 imagerylayers
      [
        TIANDITUCN,
        SentinelLandCover2021,
        ESALandCover,
        ESALandCover2021,
        WSF2019,
      ].map((extrasImageryLayer) =>
        viewer.scene.imageryLayers.add(extrasImageryLayer)
      );

      // 构造额外添加的按钮
      const extraBtns = [
        {
          bntObj: {
            id: "mapOpen",
            classList: ["cesium-toolbar-icon", "map-btn", "active-btn"],
            fn: () => {
              [
                "https://map.baidu.com/",
                "https://map.qq.com/",
                "https://map.tianditu.gov.cn/",
                "https://ditu.amap.com/",
                "https://dmfw.mca.gov.cn/online/map.html?keyWordPlaceName=&isIndex=true",
              ].map((web) => window.open(web));
            },
            title: "打开第三方地图",
          },
          addControl: false,
          controlObj: null,
        },
        {
          bntObj: {
            id: "borderLayerToggleBtn",
            classList: ["cesium-toolbar-icon", "border-btn", "inactive"],
            fn: () => toggleBorderLineLayer(tempImgLayer),
            title: "乡镇边界数据",
          },
          addControl: false,
          controlObj: null,
        },
        {
          bntObj: {
            id: "zhujiLayerToggleBtn",
            classList: ["cesium-toolbar-icon", "zhuji-btn"],
            fn: () => (TIANDITUCN.show = !TIANDITUCN.show),
            title: "显示/关闭 注记",
          },
          controlObj: null,
          addControl: false,
        },
        {
          bntObj: {
            id: "villageBorderLayerToggleBtn",
            classList: [
              "cesium-toolbar-icon",
              "village-border-btn",
              "inactive",
            ],
            fn: function () {
              document.querySelector("#villageBorderImgLayerControl").disabled =
                !document.querySelector("#villageBorderImgLayerControl")
                  .disabled;
              toggleBorderLineLayer(tempVillageImgLayer, 0.5);
            },
            title: "村级边界",
          },
          addControl: true,
          controlObj: {
            classList: ["village-border-alpha-control-container"],
            defaultAlpha: 50,
            fn: (e) => {
              tempVillageImgLayer.alpha = e.target.value / 100;
            },
            id: "villageBorderImgLayerControl",
          },
        },
        {
          bntObj: {
            id: "ESRILandcoverBtn",
            classList: ["cesium-toolbar-icon", "landcover-btn", "inactive"],
            fn: function () {
              document.querySelector("#ESRILandcoverAlphaControl").disabled =
                !document.querySelector("#ESRILandcoverAlphaControl").disabled;

              SentinelLandCover2021.show = !SentinelLandCover2021.show;
            },
            title: "ESRI 土地利用 2021",
          },
          addControl: true,
          controlObj: {
            classList: ["sentinel-landCover-2021-alpha-control-container"],
            defaultAlpha: 20,
            fn: (e) => {
              SentinelLandCover2021.alpha = e.target.value / 100;
            },
            id: "ESRILandcoverAlphaControl",
          },
        },
        {
          bntObj: {
            id: "ESALandcover",
            classList: ["cesium-toolbar-icon", "ESA-landcover-btn", "inactive"],
            fn: function () {
              document.querySelector("#ESALandcoverAlphaControl").disabled =
                !document.querySelector("#ESALandcoverAlphaControl").disabled;
              ESALandCover.show = !ESALandCover.show;
            },
            title: "ESA WorldCover 2020",
          },
          addControl: true,
          controlObj: {
            classList: ["ESA-landcover-alpha-control-container"],
            defaultAlpha: 20,
            fn: (e) => {
              ESALandCover.alpha = e.target.value / 100;
            },
            id: "ESALandcoverAlphaControl",
          },
        },
        {
          bntObj: {
            id: "ESALandcover2021",
            classList: [
              "cesium-toolbar-icon",
              "ESA-landcover-2021-btn",
              "inactive",
            ],
            fn: function () {
              document.querySelector("#ESALandcover2021AlphaControl").disabled =
                !document.querySelector("#ESALandcover2021AlphaControl")
                  .disabled;
              ESALandCover2021.show = !ESALandCover2021.show;
            },
            title: "ESA WorldCover 2021",
          },
          addControl: true,
          controlObj: {
            classList: ["ESA-landcover-2021-alpha-control-container"],
            defaultAlpha: 20,
            fn: (e) => {
              ESALandCover2021.alpha = e.target.value / 100;
            },
            id: "ESALandcover2021AlphaControl",
          },
        },
        {
          bntObj: {
            id: "WSF2019",
            classList: ["cesium-toolbar-icon", "WSF-2019-btn", "inactive"],
            fn: function () {
              document.querySelector("#WSF2019ImgLayerControl").disabled =
                !document.querySelector("#WSF2019ImgLayerControl").disabled;
              WSF2019.show = !WSF2019.show;
            },
            title: "全球居住地足迹WSF2019",
          },
          addControl: true,
          controlObj: {
            classList: ["WSF-2019-alpha-control-container"],
            defaultAlpha: 20,
            fn: (e) => {
              WSF2019.alpha = e.target.value / 100;
            },
            id: "WSF2019ImgLayerControl",
          },
        },
      ];

      extraBtns.map((btn) =>
        addAlphaAndIcon(btn.bntObj, btn.controlObj, btn.addControl)
      );
    }
  );
};
