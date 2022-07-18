// import Viewer from "cesium/Source/Widgets/Viewer/Viewer";
import tdtDemMapICON from "../assets/tdt/tdtDem.jpg";
import tdtImageMapICON from "../assets/tdt/tdtImage.jpg";
import tdtMapICON from "../assets/tdt/tdtMap.jpg";
import { LngLatWidget } from "./locLabel";

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

// 影像图层
const ESRIIMG = new Cesium.ProviderViewModel({
  name: "ESRI ArcGIS全球影像",
  iconUrl: Cesium.buildModuleUrl(
    "Widgets/Images/ImageryProviders/esriWorldImagery.png"
  ),
  tooltip: "ESRI ArcGIS影像图层",
  category: "ESRI ArcGIS",
  creationFunction: function () {
    return new Cesium.ArcGisMapServerImageryProvider({
      url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
    });
  },
});

const ESRIStreet = new Cesium.ProviderViewModel({
  name: "ESRI ArcGIS街道地图",
  iconUrl: Cesium.buildModuleUrl(
    "Widgets/Images/ImageryProviders/esriWorldStreetMap.png"
  ),
  tooltip: "ESRI ArcGIS街道地图",
  category: "ESRI ArcGIS",
  creationFunction: function () {
    if (timeSeriesImgeryObj != undefined) {
      timeSeriesImgeryObj.timeImageFlag = 0; //不参与时序影像控制操作
    }
    return new Cesium.ArcGisMapServerImageryProvider({
      url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer",
      enablePickFeatures: false,
    });
  },
});

const ESRINation = new Cesium.ProviderViewModel({
  name: "ESRI ArcGIS国家地理",
  iconUrl: Cesium.buildModuleUrl(
    "Widgets/Images/ImageryProviders/esriNationalGeographic.png"
  ),
  tooltip: "ESRI ArcGIS国家地理",
  category: "ESRI ArcGIS",
  creationFunction: function () {
    if (timeSeriesImgeryObj != undefined) {
      timeSeriesImgeryObj.timeImageFlag = 0; //不参与时序影像控制操作
    }
    return new Cesium.ArcGisMapServerImageryProvider({
      url: "https://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/",
      enablePickFeatures: false,
    });
  },
});

const TIANDITUTERR = new Cesium.ProviderViewModel({
  name: "天地图(地形晕渲地图)",
  iconUrl: tdtDemMapICON,
  tooltip: "天地图影像\nhttp://www.tianditu.gov.cn",
  category: "天地图",
  creationFunction: function () {
    return new Cesium.WebMapTileServiceImageryProvider({
      url: "http://t0.tianditu.gov.cn/ter_w/wmts?tk=f364d1865beaaa4303e9e5bf9c2b0ee1",
      layer: "ter",
      style: "default",
      format: "tiles",
      tileMatrixSetID: "w",
      credit: new Cesium.Credit("Visual Earth Studio"),
    });
  },
});

const TIANDITUIMG = new Cesium.ProviderViewModel({
  name: "天地图(遥感影像)",
  iconUrl: tdtImageMapICON,
  tooltip: "天地图影像\nhttp://www.tianditu.gov.cn",
  category: "天地图",
  creationFunction: function () {
    return new Cesium.WebMapTileServiceImageryProvider({
      url: "http://t0.tianditu.gov.cn/img_w/wmts?tk=f364d1865beaaa4303e9e5bf9c2b0ee1",
      layer: "img",
      style: "default",
      format: "tiles",
      tileMatrixSetID: "w",
      maximumLevel: 18,
      credit: new Cesium.Credit("Visual Earth Studio"),
    });
  },
});

const TIANDITUVECTOR = new Cesium.ProviderViewModel({
  name: "天地图(矢量地图)",
  iconUrl: tdtMapICON,
  tooltip: "天地图影像\nhttp://www.tianditu.gov.cn",
  category: "天地图",
  creationFunction: function () {
    return new Cesium.WebMapTileServiceImageryProvider({
      url: "http://t0.tianditu.gov.cn/vec_w/wmts?tk=f364d1865beaaa4303e9e5bf9c2b0ee1",
      layer: "vec",
      style: "default",
      format: "tiles",
      tileMatrixSetID: "w",
      credit: new Cesium.Credit("Visual Earth Studio"),
    });
  },
});

const AMAPImage = new Cesium.ProviderViewModel({
  name: "高德影像地图",
  iconUrl: Cesium.buildModuleUrl(
    "Widgets/Images/ImageryProviders/esriNationalGeographic.png"
  ),
  tooltip: "高德影像地图",
  category: "高德（无偏移）",
  creationFunction: function () {
    return new Cesium.AmapImageryProvider({
      style: "img",
      crs: "WGS84",
    });
  },
});

const AMAPVector = new Cesium.ProviderViewModel({
  name: "高德矢量地图",
  iconUrl: Cesium.buildModuleUrl(
    "Widgets/Images/ImageryProviders/esriNationalGeographic.png"
  ),
  tooltip: "高德矢量地图",
  category: "高德（无偏移）",
  creationFunction: function () {
    return new Cesium.AmapImageryProvider({
      style: "elec",
      crs: "WGS84",
    });
  },
});

const AMAPVCva = new Cesium.ProviderViewModel({
  name: "高德注记要素",
  iconUrl: Cesium.buildModuleUrl(
    "Widgets/Images/ImageryProviders/esriNationalGeographic.png"
  ),
  tooltip: "高德注记要素",
  category: "高德（无偏移）",
  creationFunction: function () {
    if (timeSeriesImgeryObj != undefined) {
      timeSeriesImgeryObj.timeImageFlag = 0; //不参与时序影像控制操作
    }
    return new Cesium.AmapImageryProvider({
      style: "cva",
      crs: "WGS84",
    });
  },
});

const baiduImg = new Cesium.ProviderViewModel({
  name: "百度影像",
  iconUrl: Cesium.buildModuleUrl(
    "Widgets/Images/ImageryProviders/esriNationalGeographic.png"
  ),
  tooltip: "百度影像地图",
  category: "百度（无偏移）",
  creationFunction: function () {
    return new Cesium.BaiduImageryProvider({
      style: "img", // style: img、vec、normal、dark
      crs: "WGS84", // 使用84坐标系，默认为：BD09
    });
  },
});

const baiduNormal = new Cesium.ProviderViewModel({
  name: "百度常规",
  iconUrl: Cesium.buildModuleUrl(
    "Widgets/Images/ImageryProviders/esriNationalGeographic.png"
  ),
  tooltip: "百度常规地图",
  category: "百度（无偏移）",
  creationFunction: function () {
    return new Cesium.BaiduImageryProvider({
      style: "normal", // style: img、vec、normal、dark
      crs: "WGS84", // 使用84坐标系，默认为：BD09
    });
  },
});

const baiduDark = new Cesium.ProviderViewModel({
  name: "百度暗黑",
  iconUrl: Cesium.buildModuleUrl(
    "Widgets/Images/ImageryProviders/esriNationalGeographic.png"
  ),
  tooltip: "百度暗黑地图",
  category: "百度（无偏移）",
  creationFunction: function () {
    return new Cesium.BaiduImageryProvider({
      style: "dark", // style: img、vec、normal、dark
      crs: "WGS84", // 使用84坐标系，默认为：BD09
    });
  },
});

const baiduNote = new Cesium.ProviderViewModel({
  name: "百度注记",
  iconUrl: Cesium.buildModuleUrl(
    "Widgets/Images/ImageryProviders/esriNationalGeographic.png"
  ),
  tooltip: "百度注记地图",
  category: "百度（无偏移）",
  creationFunction: function () {
    return new Cesium.BaiduImageryProvider({
      style: "vec", // style: img、vec、normal、dark
      crs: "WGS84", // 使用84坐标系，默认为：BD09
    });
  },
});

const GOOGLEIMG = new Cesium.ProviderViewModel({
  name: "Google影像",
  iconUrl: "http://mizhibd.com/checkApp/backend/ico/tdtImage.jpg",
  tooltip: "Google影像",
  category: "Google",
  creationFunction: function () {
    return new Cesium.UrlTemplateImageryProvider({
      //影像图 (中国范围无偏移)
      url: "http://www.google.cn/maps/vt?lyrs=s&x={x}&y={y}&z={z}",
      tilingScheme: new Cesium.WebMercatorTilingScheme(),
      minimumLevel: 1,
      maximumLevel: 20,
      credit: "Google Earth",
    });
  },
});

const GOOGLEPATHIMG = new Cesium.ProviderViewModel({
  name: "Google道路地图",
  iconUrl: "http://mizhibd.com/checkApp/backend/ico/tdtImage.jpg",
  tooltip: "Google道路地图",
  category: "Google",
  creationFunction: function () {
    return new Cesium.UrlTemplateImageryProvider({
      //带地名标注的影像图 (影像在中国范围无偏移，但注记有偏移)
      url: "http://www.google.cn/maps/vt?lyrs=m&x={x}&y={y}&z={z}",
      tilingScheme: new Cesium.WebMercatorTilingScheme(),
      minimumLevel: 1,
      maximumLevel: 200,
      credit: "Google Earth",
    });
  },
});

const GOOGLEPATHPLUSIMG = new Cesium.ProviderViewModel({
  name: "Google影像+道路",
  iconUrl: "http://mizhibd.com/checkApp/backend/ico/tdtImage.jpg",
  tooltip: "Google影像+道路",
  category: "Google",
  creationFunction: function () {
    return new Cesium.UrlTemplateImageryProvider({
      //道路图(道路在中国范围有偏移，无法消除)
      url: "http://www.google.cn/maps/vt?lyrs=y&x={x}&y={y}&z={z}",
      tilingScheme: new Cesium.WebMercatorTilingScheme(),
      minimumLevel: 1,
      maximumLevel: 200,
      credit: "Google Earth",
    });
  },
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
viewer.scene.imageryLayers.add(SentinelLandCover2021);
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

// 添加跳转三方地图按钮
var thirdPartyMapBtn = document.createElement("div");
thirdPartyMapBtn.classList.add("cesium-button", "cesium-toolbar-button");

var thirdPartyMapBtnIcon = document.createElement("div");
thirdPartyMapBtnIcon.classList.add("map-btn");

thirdPartyMapBtn.appendChild(thirdPartyMapBtnIcon);
thirdPartyMapBtn.addEventListener("click", openThirdMapService);
cesiumViewerToolbar.appendChild(thirdPartyMapBtn);

// 控制边界显示
var borderControllMapBtn = document.createElement("div");
borderControllMapBtn.id = "borderLayerToggleBtn";
borderControllMapBtn.title = "边界数据";
borderControllMapBtn.classList.add("cesium-button", "cesium-toolbar-button");

var borderControllBtnIcon = document.createElement("div");
borderControllBtnIcon.classList.add("border-btn");

borderControllMapBtn.appendChild(borderControllBtnIcon);
cesiumViewerToolbar.appendChild(borderControllMapBtn);

var villageBorderControllMapBtn = document.createElement("div");
villageBorderControllMapBtn.title = "村级边界数据（多边形）";
villageBorderControllMapBtn.id = "villageBorderLayerToggleBtn";
villageBorderControllMapBtn.classList.add(
  "cesium-button",
  "cesium-toolbar-button"
);

var villageBorderControllBtnIcon = document.createElement("div");
villageBorderControllBtnIcon.classList.add("village-border-btn");

villageBorderControllMapBtn.appendChild(villageBorderControllBtnIcon);
cesiumViewerToolbar.appendChild(villageBorderControllMapBtn);

// 控制图层透明度
var SentinelLandCover2021AlphaControlContainer = document.createElement("div");
SentinelLandCover2021AlphaControlContainer.className =
  "sentinel-landCover-2021-alpha-control-container";
var SentinelLandCover2021AlphaControl = document.createElement("input");
SentinelLandCover2021AlphaControl.type = "range";
SentinelLandCover2021AlphaControl.min = 0;
SentinelLandCover2021AlphaControl.max = 100;
SentinelLandCover2021AlphaControl.value = 20;
SentinelLandCover2021AlphaControl.classList.add("sentinel-land-cover-2021");
SentinelLandCover2021AlphaControl.addEventListener("change", (e) => {
  SentinelLandCover2021.alpha = e.target.value / 100;
});

var SentinelLandCover2021AlphaLabel = document.createElement("label");
SentinelLandCover2021AlphaLabel.innerText = "LandCover Layer Alpha: ";
SentinelLandCover2021AlphaControlContainer.appendChild(
  SentinelLandCover2021AlphaLabel
);
SentinelLandCover2021AlphaControlContainer.appendChild(
  SentinelLandCover2021AlphaControl
);
cesiumViewerToolbar.appendChild(SentinelLandCover2021AlphaControlContainer);

// 乡村边界控制
let villageBorderImgLayer = addProvnceVillageBorderLineImg(viewer, 42);
villageBorderImgLayer.alpha = 0.5;
var VillageBorderAlphaControlContainer = document.createElement("div");
VillageBorderAlphaControlContainer.className =
  "village-border-alpha-control-container";
var VillageBorderAlphaControl = document.createElement("input");
VillageBorderAlphaControl.id = "villageBorderImgLayerControl";
VillageBorderAlphaControl.type = "range";
VillageBorderAlphaControl.min = 0;
VillageBorderAlphaControl.max = 100;
VillageBorderAlphaControl.value = 50;
VillageBorderAlphaControl.classList.add("sentinel-land-cover-2021");

var VillageBorderAlphaLabel = document.createElement("label");
VillageBorderAlphaLabel.innerText = "Village Border Layer Alpha: ";
VillageBorderAlphaControlContainer.appendChild(VillageBorderAlphaLabel);
VillageBorderAlphaControlContainer.appendChild(VillageBorderAlphaControl);
cesiumViewerToolbar.appendChild(VillageBorderAlphaControlContainer);

// 一键控制显示/隐藏
var landCoverShowBtn = document.createElement("div");
landCoverShowBtn.id = "lanCoverToggleBtn";
landCoverShowBtn.classList.add("cesium-button", "cesium-toolbar-button");
landCoverShowBtn.title = "Sentinel-2 LandCover 2021";

var landCoverShowBtnIcon = document.createElement("div");
landCoverShowBtnIcon.classList.add("landcover-btn", "active-btn");

landCoverShowBtn.appendChild(landCoverShowBtnIcon);
cesiumViewerToolbar.appendChild(landCoverShowBtn);

landCoverShowBtn.addEventListener("click", () => {
  SentinelLandCover2021.show = !SentinelLandCover2021.show;
  // if (SentinelLandCover2021.alpha == 0) {
  //   SentinelLandCover2021AlphaControl.value = 20;
  //   SentinelLandCover2021.alpha = 0.2;
  // } else {
  //   SentinelLandCover2021AlphaControl.value = 0;
  //   SentinelLandCover2021.alpha = 0;
  // }
});

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
 *
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
 *
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
 *
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

function toggleBorderLineLayer(layer, defaultAlpha = 1) {
  console.log(layer);
  if (Cesium.defined(layer)) {
    layer.show = !layer.show;
    // layer.alpha = layer.alpha == 0 ? defaultAlpha : 0;
  }
}

// 控制注记显示
var zhujiControllMapBtn = document.createElement("div");
zhujiControllMapBtn.id = "borderLayerToggleBtn";
zhujiControllMapBtn.title = "显示/关闭 注记";
zhujiControllMapBtn.classList.add("cesium-button", "cesium-toolbar-button");

var zhujiControllBtnIcon = document.createElement("div");
zhujiControllBtnIcon.classList.add("zhuji-btn");

zhujiControllMapBtn.appendChild(zhujiControllBtnIcon);
cesiumViewerToolbar.appendChild(zhujiControllMapBtn);

zhujiControllMapBtn.addEventListener("click", () => {
  TIANDITUCN.show = !TIANDITUCN.show;
});

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
