// 添加全球注记
export const TIANDITUCN = new Cesium.ImageryLayer(
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
export const SentinelLandCover2021 = new Cesium.ImageryLayer(
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
SentinelLandCover2021.show = false;

// 全球土地覆盖: European Space Agency WorldCover 2020 Land Cover
export const ESALandCover = new Cesium.ImageryLayer(
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
ESALandCover.show = false;

//全球土地覆盖: European Space Agency WorldCover 2021 Land Cover
export const ESALandCover2021 = new Cesium.ImageryLayer(
  new Cesium.WebMapTileServiceImageryProvider({
    url: "https://services.terrascope.be/wmts/v2?",
    layer: "WORLDCOVER_2021_MAP",
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
    credit: "ESA WorldCover 10m 2021",
  })
);
ESALandCover2021.alpha = 0.2;
ESALandCover2021.show = false;

export const WSF2019 = new Cesium.ImageryLayer(
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
WSF2019.show = false;
