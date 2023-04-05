import tdtDemMapICON from "../assets/tdt/tdtDem.jpg";
import tdtImageMapICON from "../assets/tdt/tdtImage.jpg";
import tdtMapICON from "../assets/tdt/tdtMap.jpg";

const ESRIStreet = new Cesium.ProviderViewModel({
  name: "ESRI ArcGIS街道地图",
  iconUrl: Cesium.buildModuleUrl(
    "Widgets/Images/ImageryProviders/esriWorldStreetMap.png"
  ),
  tooltip: "ESRI ArcGIS街道地图",
  category: "ESRI ArcGIS",
  creationFunction: function () {
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

const googleCNImg = new Cesium.ProviderViewModel({
  name: "谷歌中国影像",
  iconUrl: Cesium.buildModuleUrl(
    "Widgets/Images/ImageryProviders/esriWorldStreetMap.png"
  ),
  tooltip: "GOOGLE",
  category: "GOOGLE_CN",
  creationFunction: function () {
    return new Cesium.UrlTemplateImageryProvider({
      url: "http://gac-geo.googlecnapps.cn/maps/vt?lyrs=s&x={x}&y={y}&z={z}", //影像图 (中国范围无偏移)
      tilingScheme: new Cesium.WebMercatorTilingScheme(),
      minimumLevel: 1,
      maximumLevel: 200,
      credit: "Google Earth",
    });
  },
});

const googleCNRoad = new Cesium.ProviderViewModel({
  name: "谷歌中国道路图（有偏移）",
  iconUrl: Cesium.buildModuleUrl(
    "Widgets/Images/ImageryProviders/esriWorldStreetMap.png"
  ),
  tooltip: "GOOGLE",
  category: "GOOGLE_CN",
  creationFunction: function () {
    return new Cesium.UrlTemplateImageryProvider({
      url: "http://gac-geo.googlecnapps.cn/maps/vt?lyrs=m&x={x}&y={y}&z={z}", //影像图 (中国范围无偏移)
      tilingScheme: new Cesium.WebMercatorTilingScheme(),
      minimumLevel: 1,
      maximumLevel: 200,
      credit: "Google Earth",
    });
  },
});

const googleCNTerr = new Cesium.ProviderViewModel({
  name: "谷歌中国地形图",
  iconUrl: Cesium.buildModuleUrl(
    "Widgets/Images/ImageryProviders/esriWorldStreetMap.png"
  ),
  tooltip: "GOOGLE",
  category: "GOOGLE_CN",
  creationFunction: function () {
    return new Cesium.UrlTemplateImageryProvider({
      url: "http://gac-geo.googlecnapps.cn/maps/vt?lyrs=t&x={x}&y={y}&z={z}", //影像图 (中国范围无偏移)
      tilingScheme: new Cesium.WebMercatorTilingScheme(),
      minimumLevel: 1,
      maximumLevel: 200,
      credit: "Google Earth",
    });
  },
});

const googleCNPro = new Cesium.ProviderViewModel({
  name: "谷歌中国带地名标注的地形图",
  iconUrl: Cesium.buildModuleUrl(
    "Widgets/Images/ImageryProviders/esriWorldStreetMap.png"
  ),
  tooltip: "GOOGLE",
  category: "GOOGLE_CN",
  creationFunction: function () {
    return new Cesium.UrlTemplateImageryProvider({
      url: "http://gac-geo.googlecnapps.cn/maps/vt?lyrs=p&x={x}&y={y}&z={z}", 
      tilingScheme: new Cesium.WebMercatorTilingScheme(),
      minimumLevel: 1,
      maximumLevel: 200,
      credit: "Google Earth",
    });
  },
});

const googleCNY = new Cesium.ProviderViewModel({
  name: "谷歌中国带地名标注的影像图",
  iconUrl: Cesium.buildModuleUrl(
    "Widgets/Images/ImageryProviders/esriWorldStreetMap.png"
  ),
  tooltip: "GOOGLE",
  category: "GOOGLE_CN",
  creationFunction: function () {
    return new Cesium.UrlTemplateImageryProvider({
      url: "http://gac-geo.googlecnapps.cn/maps/vt?lyrs=y&x={x}&y={y}&z={z}", 
      tilingScheme: new Cesium.WebMercatorTilingScheme(),
      minimumLevel: 1,
      maximumLevel: 200,
      credit: "Google Earth",
    });
  },
});

const googleCNH = new Cesium.ProviderViewModel({
  name: "谷歌中国地名标注层（路名、地名等）",
  iconUrl: Cesium.buildModuleUrl(
    "Widgets/Images/ImageryProviders/esriWorldStreetMap.png"
  ),
  tooltip: "GOOGLE",
  category: "GOOGLE_CN",
  creationFunction: function () {
    return new Cesium.UrlTemplateImageryProvider({
      url: "http://gac-geo.googlecnapps.cn/maps/vt?lyrs=h&x={x}&y={y}&z={z}", 
      tilingScheme: new Cesium.WebMercatorTilingScheme(),
      minimumLevel: 1,
      maximumLevel: 200,
      credit: "Google Earth",
    });
  },
});

export {
  googleCNH,
  googleCNY,
  googleCNPro,
  googleCNTerr,
  googleCNRoad,
  googleCNImg,
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
};
