import { LngLatWidget } from "./locLabel";
// 导入备用图像
// import { ESRIIMG } from "./cesiumProvideModel";

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

viewer.baseLayerPicker.viewModel.selectedImagery = ESRIIMG;

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

let villageBorderImgLayer = addProvnceVillageBorderLineImg(viewer, 42);
villageBorderImgLayer.alpha = 0.5;

const lngLatScaleLabel = new LngLatWidget(viewer);
lngLatScaleLabel.addCoordinateLabel();


/**
 * 点击后展示所拾取的entity信息
 * @param {*} movement 
 */
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
  console.log(layer);
  if (Cesium.defined(layer)) {
    layer.show = !layer.show;
    // layer.alpha = layer.alpha == 0 ? defaultAlpha : 0;
  }
}

export {
  viewer,
  handler,
  ESRIIMG,
  showPickEntityInfo,
  addProvnceBorderLine,
  addProvnceBorderLineImg,
  toggleBorderLineLayer,
  addProvnceVillageBorderLineImg,
  villageBorderImgLayer,
};
