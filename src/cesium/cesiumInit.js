// import Viewer from "cesium/Source/Widgets/Viewer/Viewer";
// import tdtDemMapICON from "../assets/tdt/tdtDem.jpg";
// import tdtImageMapICON from "../assets/tdt/tdtImage.jpg";
// import tdtMapICON from "../assets/tdt/tdtMap.jpg";
import { LngLatWidget } from "./locLabel";
// 导入备用图像
import {
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
} from "./cesiumProvideModel";

const CESIUMTOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkY2U1MTEwOC05NWM2LTRlNjMtOTdlMi03NWRhZDc1NzI0ZTciLCJpZCI6NzAyNjMsImlhdCI6MTYzNDEyNDM3NX0.T5IFCKMuUEUi141stLGHka_pOjeu0wb8Pg6_QL0eKd0";

Cesium.Ion.defaultAccessToken = CESIUMTOKEN;
Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
  73,
  23,
  135,
  53
);

// 编码器
const customGeocoders = [
  new Cesium.CartographicGeocoderService(),
  new TiandituNominatimGeocoder(), //天地图地理编码器
];

const viewer = new Cesium.Viewer("cesiumContainer", {
  homeButton: false,
  timeline: false,
  // sceneModePicker: false,
  navigationHelpButton: false, //,//右上角的帮助按钮
  geocoder: customGeocoders, //使用定制的加强版地理编码器
});

document.querySelector(
  "#cesiumContainer .cesium-viewer-animationContainer"
).hidden = true;

document.querySelector("#cesiumContainer .cesium-viewer-bottom").style.display =
  "none";

// viewer.scene.postProcessStages.fxaa.enabled = false;

// 更改注记分辨率
var supportsImageRenderingPixelated =
  viewer.cesiumWidget._supportsImageRenderingPixelated;
if (supportsImageRenderingPixelated) {
  var vtxf_dpr = window.devicePixelRatio;
  while (vtxf_dpr >= 2.0) {
    vtxf_dpr /= 2.0;
  }
  viewer.resolutionScale = vtxf_dpr;
}

// 添加全球注记
const TIANDITUCN = new Cesium.ImageryLayer(
  new Cesium.WebMapTileServiceImageryProvider({
    url: "http://{s}.tianditu.gov.cn/cia_w/wmts?tk=f364d1865beaaa4303e9e5bf9c2b0ee1",
    layer: "cia",
    style: "default",
    format: "tiles",
    tileMatrixSetID: "w",
    subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
    maximumLevel: 18,
  })
);

// 土地覆盖图层
const SentinelLandCover2021 = new Cesium.ImageryLayer(
  new Cesium.UrlTemplateImageryProvider({
    url:
      //下面加载的图像年份：2021（time=1609502400000%2C1641038400000）。此处注意时间的设定。
      "https://env1.arcgis.com/arcgis/rest/services/Sentinel2_10m_LandCover/ImageServer/exportImage?bbox={westDegrees}%2C{southDegrees}%2C{eastDegrees}%2C{northDegrees}&bboxSR=&size={width}%2C{height}&time=1609502400000%2C1641038400000&format=jpgpng&f=image", //不显示边界线
    pickFeaturesUrl:
      //点击查询，显示图例
      "https://env1.arcgis.com/arcgis/rest/services/Sentinel2_10m_LandCover/ImageServer/legend?bandIds=&renderingRule=&f=html",
    getFeatureInfoFormats: [
      new Cesium.GetFeatureInfoFormat("html", "text/html"),
      new Cesium.GetFeatureInfoFormat("json", "application/geojson"),
    ],
    enablePickFeatures: false,
  })
);
SentinelLandCover2021.alpha = 0.2;

// 全球土地覆盖: European Space Agency WorldCover 2020 Land Cover
const ESALandCover = new Cesium.ImageryLayer(
  new Cesium.WebMapTileServiceImageryProvider({
    url: "https://services.terrascope.be/wmts/v2?",
    layer: "WORLDCOVER_2020_MAP",
    style: "default",
    format: "image/png",
    tileMatrixSetID: "EPSG:3857",
    tileMatrixLabels: [
      "EPSG:3857:0",
      "EPSG:3857:1",
      "EPSG:3857:2",
      "EPSG:3857:3",
      "EPSG:3857:4",
      "EPSG:3857:5",
      "EPSG:3857:6",
      "EPSG:3857:7",
      "EPSG:3857:8",
      "EPSG:3857:9",
      "EPSG:3857:10",
      "EPSG:3857:11",
      "EPSG:3857:12",
      "EPSG:3857:13",
      "EPSG:3857:14",
      "EPSG:3857:15",
      "EPSG:3857:16",
      "EPSG:3857:17",
      "EPSG:3857:18",
      "EPSG:3857:19",
      "EPSG:3857:20",
      "EPSG:3857:21",
      "EPSG:3857:22",
      "EPSG:3857:23",
      "EPSG:3857:24",
      "EPSG:3857:25",
      "EPSG:3857:26",
      "EPSG:3857:27",
      "EPSG:3857:28",
      "EPSG:3857:29",
      "EPSG:3857:30",
    ],
    credit: "ESA WorldCover 10m 2020",
  })
);
ESALandCover.alpha = 0.2;

const WSF2019 = new Cesium.ImageryLayer(
  new Cesium.WebMapServiceImageryProvider({
    url: "https://geoservice.dlr.de/eoc/land/wms",
    layers: "WSF_2019",
    parameters: {
      service: "WMS",
      format: "image/png",
      transparent: true,
    },
    // transparent: true,
  })
);
WSF2019.alpha = 0.2;

viewer.scene.imageryLayers.add(SentinelLandCover2021);
viewer.scene.imageryLayers.add(ESALandCover);
viewer.scene.imageryLayers.add(WSF2019);

SentinelLandCover2021.show = false;
ESALandCover.show = false;
WSF2019.show = false;
viewer.scene.imageryLayers.add(TIANDITUCN);

var imageList = viewer.baseLayerPicker.viewModel.imageryProviderViewModels;

imageList.push(
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

viewer.baseLayerPicker.viewModel.selectedImagery = ESRIIMG;

// imageList.push(TIANDITUTERR);
// imageList.push(TIANDITUIMG);
// imageList.push(TIANDITUVECTOR);

//天地图地理编码器
function TiandituNominatimGeocoder() {}
//天地图地理编码器geocode
TiandituNominatimGeocoder.prototype.geocode = function (input) {
  var requestString =
    'http://api.tianditu.gov.cn/geocoder?ds={"keyWord":"' +
    input +
    '"}&tk=f364d1865beaaa4303e9e5bf9c2b0ee1';

  var resource = new Cesium.Resource({
    url: requestString,
  });

  return resource.fetchJson().then(function (results) {
    var resultArr = [results];
    return resultArr.map(function (resultObject) {
      return {
        displayName: input,
        //  destination:Cesium.Cartesian3.fromDegrees(results.location.lon, results.location.lat,300),
        destination: Cesium.Cartesian3.fromDegrees(
          resultObject.location.lon,
          resultObject.location.lat
        ),
        //  Cesium.Cartesian3.fromDegrees(resultObject.location.lon, resultObject.location.lat,300),
      };
    });
  });
};

const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
var cesiumViewerToolbar = document.querySelector(
  "#cesiumContainer .cesium-viewer-toolbar"
);

let villageBorderImgLayer = addProvnceVillageBorderLineImg(viewer, 42);
villageBorderImgLayer.alpha = 0.5;

const lngLatScaleLabel = new LngLatWidget(viewer);
lngLatScaleLabel.addCoordinateLabel();
// lngLatScaleLabel.addScale();

function showPickEntityInfo(movement) {
  var pick = viewer.scene.pick(movement.position);
  if (Cesium.defined(pick)) {
    document.getElementById("updateCode").value = pick.id.id.substring(0, 12);
    var cesiumInput = document.querySelector(
      "#cesiumContainer .cesium-geocoder-input"
    );
    cesiumInput.value = pick.id.name;
    cesiumInput.classList.add("cesium-geocoder-input-wide");
    cesiumInput.select();
    document.execCommand("copy");
    // navigator.clipboard.writeText(cesiumInput.value);
    console.log("id:" + pick.id.id + ", name:" + pick.id.name);
  }
}

function openThirdMapService() {
  window.open("https://map.baidu.com/");
  window.open("https://map.qq.com/");
  window.open("https://map.tianditu.gov.cn/");
  window.open("https://ditu.amap.com/");
}

/**
 * 添加乡镇图层
 * @param {*} addViewer
 * @param {*} provnCode
 */
function addProvnceBorderLine(addViewer, provnCode) {
  let provnBorderLinePromise = Cesium.KmlDataSource.load(
    `http://124.89.71.141:8061/TownshipBoundary/line/kml/${provnCode}_Line.kml`,
    {
      camera: addViewer.scene.camera,
      canvas: addViewer.scene.canvas,
      clampToGround: true,
    }
  );

  addViewer.entities.removeAll();
  addViewer.dataSources.removeAll();

  provnBorderLinePromise.then(function (dataSource) {
    addViewer.dataSources.add(dataSource);
    let boerderline = dataSource.entities;

    // Get the array of entities
    var boerderlineEntities = dataSource.entities.values;
    for (var i = 0; i < boerderlineEntities.length; i++) {
      var entity = boerderlineEntities[i];

      if (Cesium.defined(entity.polyline)) {
        entity.polyline.width = 2;
        entity.polyline.material = Cesium.Color.fromRandom({
          red: 0.1,
          maximumGreen: 0.9,
          minimumBlue: 0.8,
          alpha: 0.6,
        });
      }
    }

    console.log("borderLine data added");
  });
}

/**
 * 添加县镇图层
 * @param {cesiumViewer} addViewer
 * @param {String} provnCode
 * @returns
 */
function addProvnceBorderLineImg(addViewer, provnCode) {
  let provnBorderLineImg = new Cesium.ArcGisMapServerImageryProvider({
    id: "tem",
    url: `http://124.89.71.141:6081/arcgis/rest/services/ChinaTownBoundary/${provnCode}/MapServer`,
  });

  return addViewer.imageryLayers.addImageryProvider(provnBorderLineImg);
}

/**
 * 添加一个省份的乡村边界数据
 * @param {cesiumViewer} addViewer
 * @param {String} provnCode
 * @returns
 */
function addProvnceVillageBorderLineImg(addViewer, provnCode, index = 0) {
  let provnBorderLineImg = new Cesium.ArcGisMapServerImageryProvider({
    id: "tem",
    url: `http://124.89.71.141:6081/arcgis/rest/services/ChinaCountyBoundary/${provnCode}/MapServer`,
  });

  return addViewer.imageryLayers.addImageryProvider(provnBorderLineImg, index);
}

/**
 * 调整边界显示
 * @param {*} layer
 * @param {*} defaultAlpha
 */
function toggleBorderLineLayer(layer, defaultAlpha = 1) {
  console.log(layer);
  if (Cesium.defined(layer)) {
    layer.show = !layer.show;
    // layer.alpha = layer.alpha == 0 ? defaultAlpha : 0;
  }
}

/**
 * 在 cesium toolbar 末尾添加图标
 * @param {string} name 图标名称/ID
 * @param {array} classList 样式列表
 * @param {function} clickFn 点击函数
 * @param {string} title title
 */
function addIconInCesiumToolbar(name, classList, clickFn, title) {
  let iconWrapper = document.createElement("div");
  iconWrapper.id = name;
  iconWrapper.classList.add("cesium-button", "cesium-toolbar-button");
  iconWrapper.title = title;

  let icon = document.createElement("div");
  icon.classList.add(...classList);

  iconWrapper.appendChild(icon);
  cesiumViewerToolbar.appendChild(iconWrapper);

  iconWrapper.addEventListener("click", clickFn);
}

/**
 * 添加透明度控制按钮
 * @param {*} name
 * @param {*} title
 * @param {*} classList
 * @param {*} changFn
 */
function addAlphaControner(
  name,
  title,
  classList,
  defaultAlpha,
  changFn,
  inputId
) {
  let alphaControlContainer = document.createElement("div");
  alphaControlContainer.id = name;
  alphaControlContainer.title = title;
  alphaControlContainer.className = "alpha-control-container";
  alphaControlContainer.classList.add(...classList);

  let alphaControl = document.createElement("input");
  alphaControl.id = inputId;
  alphaControl.type = "range";
  alphaControl.min = 0;
  alphaControl.max = 100;
  alphaControl.value = defaultAlpha;
  alphaControl.classList.add("alpha-control");
  alphaControl.disabled = true;
  alphaControl.addEventListener("change", (e) => {
    changFn(e);
  });

  alphaControlContainer.appendChild(alphaControl);
  cesiumViewerToolbar.appendChild(alphaControlContainer);
}

// 乡村边界透明度控制
addAlphaControner(
  "villageBorderAlpha",
  "村级边界透明度控制",
  ["village-border-alpha-control-container"],
  50,
  (e) => {},
  "villageBorderImgLayerControl"
);

// ESRI土地利用图层透明度控制
addAlphaControner(
  "ESRILandcoverAlpha",
  "ESRI土地利用图层透明度控制",
  ["sentinel-landCover-2021-alpha-control-container"],
  20,
  (e) => {
    SentinelLandCover2021.alpha = e.target.value / 100;
  },
  "ESRILandcoverAlphaControl"
);

// ESA landcover 透明度控制
addAlphaControner(
  "ESALandcoverAlpha",
  "ESA 土地利用图层透明度控制",
  ["ESA-landcover-alpha-control-container"],
  20,
  (e) => {
    ESALandCover.alpha = e.target.value / 100;
  },
  "ESALandcoverAlphaControl"
);

// ESA landcover 透明度控制
addAlphaControner(
  "WSF2019",
  "全球居住地足迹WSF2019",
  ["WSF-2019-alpha-control-container"],
  20,
  (e) => {
    WSF2019.alpha = e.target.value / 100;
  },
  "WSF2019ImgLayerControl"
);

// 添加跳转三方地图按钮
addIconInCesiumToolbar(
  "mapOpen",
  ["map-btn", "active-btn"],
  openThirdMapService,
  "打开第三方地图"
);

// 控制乡镇级别边界显示
addIconInCesiumToolbar(
  "borderLayerToggleBtn",
  ["border-btn", "active-btn", "inactive"],
  (e) => {
    e.target.classList.contains("inactive")
      ? e.target.classList.remove("inactive")
      : e.target.classList.add("inactive");
  },
  "乡镇边界数据"
);

// 控制注记显示
addIconInCesiumToolbar(
  "borderLayerToggleBtn",
  ["zhuji-btn", "active-btn"],
  (e) => {
    e.target.classList.contains("inactive")
      ? e.target.classList.remove("inactive")
      : e.target.classList.add("inactive");

    TIANDITUCN.show = !TIANDITUCN.show;
  },
  "显示/关闭 注记"
);

// 控制村级别边界显示, 这里在后面加载进数据再写
addIconInCesiumToolbar(
  "villageBorderLayerToggleBtn",
  ["village-border-btn", "active-btn", "inactive"],
  (e) => {
    document.querySelector("#villageBorderImgLayerControl").disabled =
      !document.querySelector("#villageBorderImgLayerControl").disabled;
  },
  "村级边界数据"
);

// 控制 ESRI landuse 图层显示/隐藏
addIconInCesiumToolbar(
  "ESRILandcoverBtn",
  ["landcover-btn", "active-btn", "inactive"],
  (e) => {
    e.target.classList.contains("inactive")
      ? e.target.classList.remove("inactive")
      : e.target.classList.add("inactive");

    document.querySelector("#ESRILandcoverAlphaControl").disabled =
      !document.querySelector("#ESRILandcoverAlphaControl").disabled;

    SentinelLandCover2021.show = !SentinelLandCover2021.show;
    // console.log("click");
  },
  "ESRI 土地利用图层"
);

// 控制 ESA landuse 图层显示/隐藏
addIconInCesiumToolbar(
  "ESALandcover",
  ["ESA-landcover-btn", "active-btn", "inactive"],
  (e) => {
    e.target.classList.contains("inactive")
      ? e.target.classList.remove("inactive")
      : e.target.classList.add("inactive");

    document.querySelector("#ESALandcoverAlphaControl").disabled =
      !document.querySelector("#ESALandcoverAlphaControl").disabled;

    ESALandCover.show = !ESALandCover.show;
  },
  "ESA WorldCover"
);

// 控制 全球居住地足迹 图层显示/隐藏
addIconInCesiumToolbar(
  "WSF2019",
  ["WSF-2019-btn", "active-btn", "inactive"],
  (e) => {
    e.target.classList.contains("inactive")
      ? e.target.classList.remove("inactive")
      : e.target.classList.add("inactive");

    document.querySelector("#WSF2019ImgLayerControl").disabled =
      !document.querySelector("#WSF2019ImgLayerControl").disabled;

    WSF2019.show = !WSF2019.show;
  },
  "全球居住地足迹WSF2019"
);

export {
  viewer,
  handler,
  showPickEntityInfo,
  addProvnceBorderLine,
  addProvnceBorderLineImg,
  toggleBorderLineLayer,
  addProvnceVillageBorderLineImg,
  villageBorderImgLayer,
};
