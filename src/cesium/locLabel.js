//这是Wang ZL定义的一个插件，主要实现：坐标显示，比例尺显示, 等功能.建议以后重构此代码。
import $ from "jquery";

class LngLatWidget {
  constructor(viewer) {
    this.viewer = viewer;
    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
  }

  addCoordinateLabel() {
    var coordinatePanel = document.createElement("div");
    coordinatePanel.setAttribute("class", "coordinate-panel");
    coordinatePanel.setAttribute("title", "经纬度");
    coordinatePanel.setAttribute(
      "style",
      "position: absolute; bottom: 2px; right: 2rem; color: white; opacity: 0.6; background-color: #bababa99; padding: 0px 5px 1px 5px; border-radius: 4px; font-size: 12px; text-shadow: 2px 2px 1px #000000;"
    );
    coordinatePanel.innerHTML = "";
    $(this.viewer.container).append(coordinatePanel);

    var _this = this;

    this.handler.setInputAction(function (movement) {
      var screenPosition = movement.endPosition;
      var ellipsoid = _this.viewer.scene.globe.ellipsoid;
      var cartesian = _this.viewer.camera.pickEllipsoid(
        screenPosition,
        ellipsoid
      );
      var ray = _this.viewer.camera.getPickRay(screenPosition);
      var position = _this.viewer.scene.globe.pick(ray, _this.viewer.scene);

      // console.log(screenPosition, ellipsoid, cartesian, position);

      var latlngStr;
      var coordinatePanel;
      if (cartesian && Cesium.defined(position)) {
        var cartographic = ellipsoid.cartesianToCartographic(cartesian);

        var longitude = Cesium.Math.toDegrees(cartographic.longitude).toFixed(
          6
        );
        var latitude = Cesium.Math.toDegrees(cartographic.latitude).toFixed(6);

        var isEllipsoidTerrainProvider =
          _this.viewer.scene.terrainProvider instanceof
          Cesium.EllipsoidTerrainProvider; //地形是否是默认地形WGS84椭球体
        if (isEllipsoidTerrainProvider) {
          latlngStr = `经度:  ${longitude} 纬度: ${latitude}`;
        } else {
          var height = TheWidget.getAltitude(viewer, cartographic);
          if (height) {
            latlngStr = `经度:  ${longitude} 纬度: ${latitude} 高程: ${height} m`;
          } else {
            latlngStr = `经度:  ${longitude} 纬度: ${latitude}`;
          }
        }

        coordinatePanel = $(_this.viewer.container).find(".coordinate-panel");
        coordinatePanel.html(
          "<label style='margin-bottom:0;'>" + latlngStr + "</label>"
        );
      } else {
        latlngStr = "经度:  " + "  纬度:  ";
        latlngStr = "_____";

        coordinatePanel = $(_this.viewer.container).find(".coordinate-panel");
        coordinatePanel.html(
          "<label style='margin-bottom:0;'>" + latlngStr + "</label>"
        );
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }

  updateCoordinatePanel(latlngStr, cartographic) {
    var coordinatePanel = $(this.viewer.container).find(".coordinate-panel");
    var height = this.getAltitude(this.viewer, cartographic);
    if (height) {
      console.log("有高程数据!");
      coordinatePanel.html(`<label> ${latlngStr}  Alt:  ${height} m </label>`);
    } else {
      console.log("NO高程数据!");
      coordinatePanel.html(`<label> ${latlngStr} </label>`);
    }
  }

  getAltitude(cartographic) {
    var isEllipsoidTerrainProvider =
      this.viewer.scene.terrainProvider instanceof
      Cesium.EllipsoidTerrainProvider; //地形是否是默认地形WGS84椭球体
    if (isEllipsoidTerrainProvider) {
      console.log("没有地形Provider!");
      return undefined;
    }

    var height = this.viewer.scene.globe.getHeight(cartographic);
    if (height) return height.toFixed(2);
    else return undefined;
  }

  addScale() {
    var measurePanel = document.createElement("div");
    measurePanel.setAttribute("class", "measurement-panel");
    measurePanel.setAttribute("title", "比例尺");
    measurePanel.setAttribute(
      "style",
      "position: absolute; bottom: 55px; right: 5px; color: white; opacity: 0.6; background-color: #bababa99; padding: 0px 5px 1px 5px; border-radius: 4px; font-size: 12px; text-shadow: 2px 2px 1px #000000;"
    );

    $(this.viewer.container).append(measurePanel);

    var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    handler.setInputAction(function () {
      if (this.viewer.scene.mode !== Cesium.SceneMode.MORPHING)
        this.onMeasuringScaleChanged();
    }, Cesium.ScreenSpaceEventType.WHEEL);

    var handler2 = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    var _this = this;
    handler2.setInputAction(function () {
      if (_this.viewer.scene.mode !== Cesium.SceneMode.MORPHING)
        _this.onMeasuringScaleChanged();
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }

  onMeasuringScaleChanged() {
    var canvas = this.viewer.scene.canvas;
    if (typeof canvas == "undefined") {
      return;
    }

    var width = $(canvas).width();
    var height = $(canvas).height();

    var l = new Cesium.Cartesian2(width / 2 - 100, height / 2);
    var r = new Cesium.Cartesian2(width / 2 + 100, height / 2);

    if (l.x <= 0 || r.x <= 0) {
      return;
    }

    var ray1 = this.viewer.camera.getPickRay(l);
    var ray2 = this.viewer.camera.getPickRay(r);

    var left = this.viewer.scene.globe.pick(ray1, viewer.scene);
    var right = this.viewer.scene.globe.pick(ray2, viewer.scene);

    var distancePerPixel;

    if (typeof left === "undefined" || typeof left === "undefined") {
      distancePerPixel = -1;
    } else {
      distancePerPixel = Cesium.Cartesian3.distance(left, right) / 200;
    }

    var distance;
    var pixels;
    var unit = "m";

    if (distancePerPixel < 0) {
      distance = "  ";
      pixels = 30;
      unit = "";
    } else if (distancePerPixel >= 0 && distancePerPixel <= 0.1) {
      pixels = 50;
      distance = (pixels * distancePerPixel).toFixed(2);
      unit = "m";
    } else if (distancePerPixel > 0.1 && distancePerPixel <= 1) {
      distance = 10;
      pixels = distance / distancePerPixel;
      unit = "m";
    } else if (distancePerPixel > 1 && distancePerPixel <= 10) {
      distance = 100;
      pixels = distance / distancePerPixel;
      unit = "m";
    } else if (distancePerPixel > 10 && distancePerPixel <= 100) {
      distance = 1000;
      pixels = distance / distancePerPixel;
      distance /= 1000;
      unit = "km";
    } else if (distancePerPixel > 100 && distancePerPixel <= 1000) {
      distance = 10000;
      pixels = distance / distancePerPixel;
      distance /= 1000;
      unit = "km";
    } else if (distancePerPixel > 1000 && distancePerPixel <= 10000) {
      distance = 100000;
      pixels = distance / distancePerPixel;
      distance /= 1000;
      unit = "km";
    } else {
      distance = 1000000;
      pixels = distance / distancePerPixel;
      distance /= 1000;
      unit = "km";
    }

    if (distance) {
      var measurementPanel = $(this.viewer.container).find(
        ".measurement-panel"
      );
      measurementPanel.html(
        `<label style='margin-bottom: 0;'> ${distance} ${unit} </label><hr style='margin: 0 0 2px 0; width: ${pixels} px; border-width: 3px;' />`
      );
    }
  }
}

export { LngLatWidget };
