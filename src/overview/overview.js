import { viewer, handler, showPickEntityInfo } from "../cesium/cesiumInit";
import {
  toggleCheckBtnGroup,
  toggleOvercheckBtnGroup,
  toggleHandlePickBtn,
} from "./viewUpdate";
import * as echarts from "echarts";

/**
 * 存储当前数据的变量
 */
let current,
  warnData = [],
  lon,
  lat,
  currentData,
  curStreetData,
  curStreetDataID,
  allDataByStreet = {},
  overCheck = false,
  changeView = true;
let minCheckTime = 9999999;
let maxCheckTime = 0;

// 绘制图表数据
let overViewData = [
  { value: 555, name: "正常数据" },
  { value: 333, name: "异常数据" },
  { value: 0, name: "跳过数据" },
];

// 初始化图表
var overviewCharts = echarts.init(
  document.getElementById("overviewFig"),
  "chalk"
);

overviewCharts.setOption({
  tooltip: {
    trigger: "item",
  },
  series: [
    {
      name: "overView",
      type: "pie",
      radius: ["40%", "70%"],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 8,
        // borderColor: '#000',
        borderWidth: 2,
      },
      label: {
        show: false,
        position: "center",
      },
      emphasis: {
        label: {
          show: true,
          fontSize: "10",
          fontWeight: "bold",
        },
      },
      labelLine: {
        show: false,
      },
      color: ["#AEE6C4", "#DC647C", "#332A1D"],
      // data: overViewData,
    },
  ],
});

// 更新图表
function updateOverviewCharts() {
  if (overCheck) {
    // 修改 charts label 名称
    overViewData[0].name = "待复核数据";
    overViewData[1].name = "已复核数据";
    overViewData[2].name = "标错数据";

    overviewCharts.setOption({
      series: {
        name: "overView",
        data: overViewData,
        color: ["#6ec0dd", "#9edf85", "#f16766"],
      },
    });
  } else {
    // 修改 charts label 名称
    overViewData[0].name = "正常数据";
    overViewData[1].name = "异常数据";
    overViewData[2].name = "跳过数据";

    overviewCharts.setOption({
      series: {
        name: "overView",
        data: overViewData,
        color: ["#9edf85", "#fcc75f", "#f16766"],
      },
    });
  }
}

/**
 * 设置当前数据总体情况
 * @param {Object} geocodeData
 */
function overViewSet(geocodeData) {
  let allNum = geocodeData.length;
  let warnNum = 0;
  var preStreetCode = 0;
  let locArray = [];
  // 重置某些数据
  minCheckTime = 9999999;
  maxCheckTime = 0;
  warnData = [];
  allDataByStreet = {};

  for (let locateData of geocodeData) {
    // 检测异常数据，将异常数据存储到特定数组中
    if (
      (locateData.coordSource_group > 1 && locateData.checked == 0) ||
      locateData.warn > 0
    ) {
      warnData.push(locateData);
      warnNum++;
    }

    // 按街道分组
    locateData["streetCode"] = Math.floor(locateData["code"] / 1000);
    if (locateData["streetCode"] != preStreetCode) {
      allDataByStreet[locateData["streetCode"]] = {};
      preStreetCode = locateData["streetCode"];
    }

    allDataByStreet[locateData["streetCode"]][locateData["code"]] = locateData;

    // 找出复核最少的次数
    minCheckTime > locateData["checked"]
      ? (minCheckTime = locateData["checked"])
      : null;
    // 找出复核最多的次数
    maxCheckTime < locateData["checked"]
      ? (maxCheckTime = locateData["checked"])
      : null;

    let locStr = `${parseFloat(locateData.lon).toFixed(5)}_${parseFloat(
      locateData.lon
    ).toFixed(5)}`;
    // 查找重复数据
    if (locArray.indexOf(locStr) === -1 || locateData.isHandle != 0) {
      locArray.push(locStr);
      allDataByStreet[locateData["streetCode"]][
        locateData["code"]
      ].repeate = false;
    } else {
      console.log("repeate");
      allDataByStreet[locateData["streetCode"]][
        locateData["code"]
      ].repeate = true;
    }
    // console.log(locateData[]);
  }
  console.log(locArray);
  // console.log(warnData);
  console.log(allDataByStreet);
  overViewData[0].value = geocodeData.length - warnData.length;
  overViewData[1].value = warnData.length;

  current = 0;

  checkInit(warnData);
  warnData.length > 0 ? (overCheck = false) : (overCheck = true);
  triggerStreetData();
}

/**
 * 点击显示一个街道的编码结果
 */
function triggerStreetData() {
  var showTrigger = document.querySelector("#showStreet");
  showTrigger.addEventListener("click", showStreetData);
}

/**
 * 显示当前街道编码结果
 */
function showStreetData() {
  var showTrigger = document.querySelector("#showStreet");
  // 控制显隐
  if (showTrigger.checked) {
    if (overCheck) {
      for (let otherData in allDataByStreet) {
        groupViewer(allDataByStreet[otherData], true);
      }
    } else {
      groupViewer(allDataByStreet[currentData.streetCode], true);
      document.querySelector("#checkHandle").hidden = false;
      document.querySelector("#skipLoc").hidden = false;
    }
  } else {
    viewer.entities.removeAll();
    if (overCheck) {
      groupViewer(curStreetData);
    } else {
      // console.log("not over check");
      // 添加 entity
      // 判断是否解析出
      if (currentData.lon > 60 && currentData.lon_raw < 160) {
        // document.querySelector("#checkType").hidden = false;
        // 添加按 type 判断出的结果
        var type_location = viewer.entities.add({
          id: currentData.code + "_" + Math.random() * 10000,
          name: currentData.keyword,
          position: Cesium.Cartesian3.fromDegrees(
            currentData.lon_raw,
            currentData.lat_raw
          ),
          billboard: {
            image: "http://mizhibd.com/checkApp/backend/ico/location-red.png",
            width: 32,
            height: 32,
          },
          label: {
            text: `${currentData.name}_${currentData.strt}_${currentData.code}`,
            font: "14pt monospace",
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            fillColor: new Cesium.Color(228 / 255, 32 / 255, 71 / 255), // 填充颜色
            outlineColor: Cesium.Color.WHITE, // 外边线颜色
            outlineWidth: 4.0,
            backgroundColor: new Cesium.Color(0.2, 0.2, 0.2, 0.2),
            showBackground: true,
            verticalOrigin: Cesium.VerticalOrigin.TOP,
            pixelOffset: new Cesium.Cartesian2(0, 16),
          },
          description: `  <table>
                            <tbody>
                              <tr><td>lon：</td><td>${currentData.lon_raw}</td></tr>
                              <tr><td>lat：</td><td>${currentData.lat_raw}</td></tr>
                              <tr><td>type：</td><td>${currentData.type}</td></tr>
                              <tr><td>rural_area：</td><td>${currentData.Rural_Area}</td></tr>
                              <tr><td>rural_population：</td><td>${currentData.Rural_Population}</td></tr>
                              <tr><td>streetCode：</td><td>${currentData.name}</td></tr>
                              <tr><td>checked：</td><td>${currentData.checked}</td></tr>
                            </tbody>
                          </table>`,
        });
      } else {
        console.log("Error!!! the  data is beyond China area");
      }

      // 同上
      if (currentData.lon_group > 60 && currentData.lon_group < 160) {
        // document.querySelector("#checkGroup").hidden = false;
        // 添加按 聚类 判断出的结果
        var type_location = viewer.entities.add({
          id: currentData.code + "_" + Math.random() * 10000,
          name: currentData.keyword,
          position: Cesium.Cartesian3.fromDegrees(
            currentData.lon_group,
            currentData.lat_group
          ),
          billboard: {
            image:
              "http://mizhibd.com/checkApp/backend/ico/location-yellow.png",
            width: 32,
            height: 32,
          },
          label: {
            text: `${currentData.name}_${currentData.strt}_${currentData.code}`,
            font: "14pt monospace",
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            showBackground: true,
            backgroundColor: new Cesium.Color(0.2, 0.2, 0.2, 0.2),
            fillColor: new Cesium.Color(252 / 255, 203 / 255, 47 / 255), // 填充颜色
            outlineColor: Cesium.Color.WHITE, // 外边线颜色
            outlineWidth: 4.0,
            verticalOrigin: Cesium.VerticalOrigin.TOP,
            pixelOffset: new Cesium.Cartesian2(0, 16),
          },
          description: `  <table>
                            <tbody>
                              <tr><td>lon：</td><td>${currentData.lon_group}</td></tr>
                              <tr><td>lat：</td><td>${currentData.lat_group}</td></tr>
                              <tr><td>type：</td><td>${currentData.type}</td></tr>
                              <tr><td>rural_area：</td><td>${currentData.Rural_Area}</td></tr>
                              <tr><td>rural_population：</td><td>${currentData.Rural_Population}</td></tr>
                              <tr><td>streetCode：</td><td>${currentData.name}</td></tr>
                              <tr><td>checked：</td><td>${currentData.checked}</td></tr>
                            </tbody>
                          </table>`,
        });
      } else {
        console.log("Error!!! the  data is beyond China area");
      }

      console.log(currentData);
    }
  }
}

/**
 * 初始化检查
 * @param {*} warnData
 */
function checkInit(warnData) {
  if (current < warnData.length) {
    // 显示检查数据按钮
    toggleHandlePickBtn(true);
    toggleOvercheckBtnGroup(true);
    toggleCheckBtnGroup();

    viewer.entities.removeAll();

    currentData = warnData[current];

    let lon_group = parseFloat(currentData.lon_group);
    let lat_group = parseFloat(currentData.lat_group);
    let lon_raw = parseFloat(currentData.lon_raw);
    let lat_raw = parseFloat(currentData.lat_raw);

    // document.querySelector("#streetName").textContent = currentData.strt;
    // console.log(currentData);
    // document.querySelector("#localName").value = currentData.keyword;
    // 添加 entity
    // 判断是否解析出
    if (lon_raw > 60 && lon_raw < 160) {
      // 更新总览视图
      updateOverviewCharts();
      document.querySelector("#checkType").hidden = false;
      // 添加按 type 判断出的结果
      var type_location = viewer.entities.add({
        id: currentData.code + "_" + Math.random() * 10000,
        name: currentData.keyword,
        position: Cesium.Cartesian3.fromDegrees(
          currentData.lon_raw,
          currentData.lat_raw
        ),
        billboard: {
          image: "http://mizhibd.com/checkApp/backend/ico/location-red.png",
          width: 32,
          height: 32,
        },
        label: {
          text: `${currentData.name}_${currentData.strt}_${currentData.code}`,
          font: "14pt monospace",
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          fillColor: new Cesium.Color(228 / 255, 32 / 255, 71 / 255), // 填充颜色
          outlineColor: Cesium.Color.WHITE, // 外边线颜色
          outlineWidth: 4.0,
          backgroundColor: new Cesium.Color(0.2, 0.2, 0.2, 0.2),
          showBackground: true,
          verticalOrigin: Cesium.VerticalOrigin.TOP,
          pixelOffset: new Cesium.Cartesian2(0, 16),
        },
        description: `  <table>
                          <tbody>
                            <tr><td>lon：</td><td>${currentData.lon_raw}</td></tr>
                            <tr><td>lat：</td><td>${currentData.lat_raw}</td></tr>
                            <tr><td>type：</td><td>${currentData.type}</td></tr>
                            <tr><td>rural_area：</td><td>${currentData.Rural_Area}</td></tr>
                            <tr><td>rural_population：</td><td>${currentData.Rural_Population}</td></tr>
                            <tr><td>streetCode：</td><td>${currentData.name}</td></tr>
                            <tr><td>checked：</td><td>${currentData.checked}</td></tr>
                          </tbody>
                        </table>`,
      });
    } else {
      document.querySelector("#checkType").hidden = true;
      showInfo("方法一未解析出");
      lon_raw = lon_group;
      lat_raw = lat_group;
    }

    // 同上
    if (lon_group > 60 && lon_group < 160) {
      document.querySelector("#checkGroup").hidden = false;
      // 添加按 聚类 判断出的结果
      var type_location = viewer.entities.add({
        id: currentData.code + "_" + Math.random() * 10000,
        name: currentData.keyword,
        position: Cesium.Cartesian3.fromDegrees(
          currentData.lon_group,
          currentData.lat_group
        ),
        billboard: {
          image: "http://mizhibd.com/checkApp/backend/ico/location-yellow.png",
          width: 32,
          height: 32,
        },
        label: {
          text: `${currentData.name}_${currentData.strt}_${currentData.code}`,
          font: "14pt monospace",
          fillColor: new Cesium.Color(252 / 255, 203 / 255, 47 / 255), // 填充颜色
          outlineColor: Cesium.Color.WHITE, // 外边线颜色
          outlineWidth: 4.0,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          showBackground: true,
          verticalOrigin: Cesium.VerticalOrigin.TOP,
          backgroundColor: new Cesium.Color(0.2, 0.2, 0.2, 0.2),
          pixelOffset: new Cesium.Cartesian2(0, 16),
        },
        description: `  <table>
                          <tbody>
                            <tr><td>lon：</td><td>${currentData.lon_group}</td></tr>
                            <tr><td>lat：</td><td>${currentData.lat_group}</td></tr>
                            <tr><td>type：</td><td>${currentData.type}</td></tr>
                            <tr><td>rural_area：</td><td>${currentData.Rural_Area}</td></tr>
                            <tr><td>rural_population：</td><td>${currentData.Rural_Population}</td></tr>
                            <tr><td>streetCode：</td><td>${currentData.name}</td></tr>
                            <tr><td>checked：</td><td>${currentData.checked}</td></tr>
                          </tbody>
                        </table>`,
      });
    } else {
      document.querySelector("#checkGroup").hidden = true;
      showInfo("方法二未解析出结果");
      lon_group = lon_raw;
      lat_group = lat_raw;
    }

    // 两个结果都没有的话就定位到 0, 0
    if (lon_group < 50 && lon_group > 170 && lon_raw < 50 && lon_raw > 170) {
      console.log("都没有结果");
      lon_raw = 0;
      lat_raw = 0;
      lon_group = 0;
      lat_group = 0;
    }

    // 设置视角范围内的四个顶点
    let westLng, eastLng, southLat, northLat, lngDiff, latDiff;
    let minDiff = 0.01;

    if (lon_group <= lon_raw) {
      lngDiff = lon_raw - lon_group;
      lngDiff = minDiff > lngDiff ? minDiff : lngDiff;
      westLng = lon_group - lngDiff / 2;
      eastLng = lon_raw + lngDiff / 2;
    } else {
      lngDiff = lon_group - lon_raw;
      lngDiff = minDiff > lngDiff ? minDiff : lngDiff;
      westLng = lon_raw - lngDiff / 2;
      eastLng = lon_group + lngDiff / 2;
    }

    if (lat_group <= lat_raw) {
      latDiff = lat_raw - lat_group;
      latDiff = minDiff > latDiff ? minDiff : latDiff;
      southLat = lat_group - latDiff / 2;
      northLat = lat_raw + latDiff / 2;
    } else {
      latDiff = lat_group - lat_raw;
      latDiff = minDiff > latDiff ? minDiff : latDiff;
      southLat = lat_raw - latDiff / 2;
      northLat = lat_group + latDiff / 2;
    }

    viewer.camera.flyTo({
      destination: Cesium.Rectangle.fromDegrees(
        westLng,
        southLat,
        eastLng,
        northLat
      ),
    });

    // 在搜素框填入值
    var cesiumInput = document.querySelector(
      "#cesiumContainer .cesium-geocoder-input"
    );
    cesiumInput.value = currentData.keyword;
    cesiumInput.classList.add("cesium-geocoder-input-wide");

    // 修改数据为按 type 分析得到的结果
    document
      .querySelector("#checkType")
      .addEventListener("click", updateGeocodeType, {
        once: true,
      });

    // 修改数据为按 group 聚类得到的结果
    document
      .querySelector("#checkGroup")
      .addEventListener("click", updateGeocodeGroup, {
        once: true,
      });

    // 手动选取
    document
      .querySelector("#checkHandle")
      .addEventListener("click", handlerPicker, { once: true });
  } else {
    showInfo(
      `当前 区/县 已全部检查完成，此 区/县 的 乡镇/街道 数据至少已经复核 ${minCheckTime} 次，最多的已经复核了 ${maxCheckTime} 次，请检查下一 区/县 或者复核当前 区/县。`,
      "errorInfo"
    );

    // 显示复核对应按钮
    toggleHandlePickBtn(true);
    toggleCheckBtnGroup(true);
    toggleOvercheckBtnGroup();

    // 绑定点击事件
    var overCheckBtn = document.querySelector("#overCheck");
    overCheckBtn.addEventListener("click", overCheckFn);
  }

  // 更新 charts
  updateOverviewCharts();
}

/**
 * 复核
 */
function overCheckFn() {
  overCheck = true;
  // 初始化视图
  var overCheckDoneBtn = document.querySelector("#overCheckDone");
  overCheckDoneBtn.hidden = false;

  var overCheckBtn = document.querySelector("#overCheck");
  curStreetDataID = 0;

  var overCheckKeys = Object.keys(allDataByStreet);
  curStreetData = allDataByStreet[overCheckKeys[curStreetDataID]];

  // 添加街道数据
  groupViewer(curStreetData);

  // 修改 checkbox label显示
  overCheckViewUpdate();

  // 更新 charts
  updateOverviewCharts();

  // 视图更新
  document.querySelector("#updateCode").value = overCheckKeys[curStreetDataID];
  var overCheckStreetKeys = Object.keys(curStreetData);

  // 绑定跳转到下一街道事件
  overCheckDoneBtn.addEventListener("click", overCheckNextStreet);

  overCheckBtn.hidden = true;
}

/**
 * 复核数据时跳转至下一街道
 *
 */
function overCheckNextStreet() {
  changeView = true;
  // document.querySelector("#showStreet").disabled = false;

  viewer.entities.removeAll();
  var overCheckKeys = Object.keys(allDataByStreet);

  // 按街道数据更新图表
  overViewData[0].value -= Object.keys(
    allDataByStreet[overCheckKeys[curStreetDataID]]
  ).length;

  // console.log(allDataByStreet[overCheckKeys[curStreetDataID]]);
  overViewData[1].value += Object.keys(
    allDataByStreet[overCheckKeys[curStreetDataID]]
  ).length;
  console.log(overViewData);
  updateOverviewCharts();

  curStreetDataID += 1;
  document.querySelector("#showStreet").checked = false;

  // 溢出检测
  if (curStreetDataID < overCheckKeys.length) {
    document.querySelector("#updateCode").value =
      overCheckKeys[curStreetDataID];
    curStreetData = allDataByStreet[overCheckKeys[curStreetDataID]];
    console.log(curStreetData);
    groupViewer(curStreetData);
    updateStreetGeocodeDB(overCheckKeys[curStreetDataID - 1]);
  } else {
    showInfo("当前区/县数据已经复核完成，请检查下一区/县数据 ~ ");
    document.querySelector("#overCheckDone").hidden = true;
  }
}

/**
 *
 */
function overCheckViewUpdate() {
  document.querySelector("#streetLabel").textContent =
    "显示当前 区/县/县级市 数据";
  // document.querySelector("#localName").placeholder = " 乡镇/街道 名字";
}

/**
 * 取消对点击事件的监听
 */
function releaseClickListener() {
  document
    .querySelector("#checkHandle")
    .removeEventListener("click", updateGeocodeType);
  document
    .querySelector("#checkGroup")
    .removeEventListener("click", updateGeocodeGroup);
  document
    .querySelector("#checkType")
    .removeEventListener("click", handlerPicker);
  document
    .querySelector("#handlerConfirm")
    .removeEventListener("click", confirmUpdate);
}

/**
 * 按 type 解析结果更新坐标
 */
function updateGeocodeType() {
  lon = currentData.lon_raw;
  lat = currentData.lat_raw;

  updateGeocode(warnData, lon, lat, currentData.code, 1);
  releaseClickListener();
}

/**
 * 按聚类结果更新坐标
 */
function updateGeocodeGroup() {
  lon = currentData.lon_group;
  lat = currentData.lat_group;
  updateGeocode(warnData, lon, lat, currentData.code, 1);
  releaseClickListener();
}

/**
 * 手动拾取坐标
 */
function handlerPicker() {
  // 更新按钮
  toggleCheckBtnGroup(true);
  toggleOvercheckBtnGroup(true);
  toggleHandlePickBtn();

  handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);

  handler.setInputAction((click) => {
    var screenPosition = click.position;
    viewer.entities.removeAll();
    var ellipsoid = viewer.scene.globe.ellipsoid;
    var cartesian = viewer.camera.pickEllipsoid(screenPosition, ellipsoid);
    var ray = viewer.camera.getPickRay(screenPosition);
    var position = viewer.scene.globe.pick(ray, viewer.scene);
    if (cartesian && Cesium.defined(position)) {
      var cartographic = ellipsoid.cartesianToCartographic(cartesian);
      let longitude = Cesium.Math.toDegrees(cartographic.longitude).toFixed(6);
      let latitude = Cesium.Math.toDegrees(cartographic.latitude).toFixed(6);
      // updateGeocode(warnData, longitude, latitude, currentData.code);
      handlerConfirm(longitude, latitude);
      // document.querySelector("#errorInfo").textContent = "";
    } else {
      console.warn("cesium undefined");
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

/** 手动确认 */
function handlerConfirm(longitude, latitude) {
  currentData.lon = longitude;
  currentData.lat = latitude;
  // 更新按钮
  toggleCheckBtnGroup(true);
  toggleOvercheckBtnGroup(true);
  toggleHandlePickBtn();

  document.getElementById("errorMark").hidden = false;

  // 展示手动选取后的点
  var handlerPoint = viewer.entities.add({
    id: currentData.code + "_" + Math.ceil(Math.random() * 10000),
    name: currentData.keyword,
    position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
    billboard: {
      image: "http://mizhibd.com/checkApp/backend/ico/location-green.png",
      width: 32,
      height: 32,
    },
    label: {
      text: `${currentData.name}_${currentData.strt}_${currentData.code}`,
      font: "14pt monospace",
      fillColor: new Cesium.Color(36 / 255, 210 / 255, 156 / 255), // 填充颜色
      outlineColor: Cesium.Color.WHITE, // 外边线颜色
      outlineWidth: 4.0,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      backgroundColor: new Cesium.Color(0.2, 0.2, 0.2, 0.2),
      showBackground: true,
      verticalOrigin: Cesium.VerticalOrigin.TOP,
      pixelOffset: new Cesium.Cartesian2(0, 16),
    },
  });

  document
    .querySelector("#handlerConfirm")
    .addEventListener("click", confirmUpdate, { once: true });
}

/**
 * 确认选取
 */
function confirmUpdate() {
  // 取消对左键的监听
  handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
  releaseClickListener();
  // 更新按钮，回到之前的状态
  toggleHandlePickBtn(true);
  if (overCheck) {
    toggleOvercheckBtnGroup();
    document.getElementById("overCheck").hidden = true;
    document.getElementById("overCheckDone").hidden = false;
  } else {
    toggleCheckBtnGroup();
  }
  updateGeocode(
    warnData,
    currentData.lon,
    currentData.lat,
    currentData.code,
    1
  );
}

document.getElementById("errorMark").addEventListener("click", markedError);

function markedError() {
  markWarnData().then((res) => {
    if (res.success) {
      // 更新环形图显示
      overViewData[0].value--;
      overViewData[2].value++;
      updateOverviewCharts();

      handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);

      // 提示坐标修改
      showInfo(
        `编号 ${currentData["code"]} ${currentData["keyword"]} 已标记为异常数据`,
        "successInfo"
      );

      if (overCheck) {
        toggleHandlePickBtn(true);
        toggleOvercheckBtnGroup();
        document.getElementById("overCheck").hidden = true;
        document.getElementById("overCheckDone").hidden = false;
      } else {
        toggleHandlePickBtn(true);
        toggleCheckBtnGroup();
        checkInit(warnData, ++current);
      }

      // 重新绑定输入事件
      handler.setInputAction((click) => {
        showPickEntityInfo(click);
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
  });
  console.log(currentData);
}

/**
 * 在 viewer 中添加 编码点
 * @param {*} streetLocalData
 */
function groupViewer(streetLocalData, extra) {
  handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
  // 样式区分
  let subImgURL = "http://mizhibd.com/checkApp/backend/ico/location-purple.png";
  let normalImgURL =
    "http://mizhibd.com/checkApp/backend/ico/location-green.png";
  let safeImgURL = "http://mizhibd.com/checkApp/backend/ico/location-blue.png";
  let warnImgURL = "http://mizhibd.com/checkApp/backend/ico/location-rose.png";

  let subBgColor = new Cesium.Color(246 / 255, 209 / 255, 253 / 255, 0.2);
  let safeBgColor = new Cesium.Color(0.0, 0.55, 1, 0.2);
  let normalBgColor = new Cesium.Color(0.0, 0.83, 0.41, 0.2);

  let subTextColor = new Cesium.Color(246 / 255, 209 / 255, 253 / 255, 0.6);
  let safeTextColor = new Cesium.Color(0.0, 0.55, 1, 0.6);
  let normalTextColor = new Cesium.Color(0.0, 0.83, 0.41, 0.6);

  let overImgURL = extra ? subImgURL : normalImgURL;
  let overBgColor = extra ? subBgColor : normalBgColor;
  let overTextColor = extra ? subTextColor : normalTextColor;

  document.querySelector("#checkHandle").hidden = true;
  document.querySelector("#skipLoc").hidden = true;

  let westLng = Number.MAX_SAFE_INTEGER,
    eastLng = Number.MIN_SAFE_INTEGER,
    southLat = Number.MAX_SAFE_INTEGER,
    northLat = Number.MIN_SAFE_INTEGER;

  // 添加 数据点群
  for (let locationData in streetLocalData) {
    let locateData = streetLocalData[locationData];

    // 求点群的经纬度范围
    westLng = parseFloat(westLng < locateData.lon ? westLng : locateData.lon);
    eastLng = parseFloat(eastLng > locateData.lon ? eastLng : locateData.lon);
    southLat = parseFloat(
      southLat < locateData.lat ? southLat : locateData.lat
    );
    northLat = parseFloat(
      northLat > locateData.lat ? northLat : locateData.lat
    );

    // 判断采用的图标样式
    let imgURL = locateData.isHandle ? safeImgURL : overImgURL;
    let labelBgColor = locateData.isHandle ? safeBgColor : overBgColor;
    let textColor = locateData.isHandle ? safeTextColor : overTextColor;

    // 不偏移
    let showlng = parseFloat(locateData.lon);
    let showlat = parseFloat(locateData.lat);

    // 重复数据偏移特殊处理
    if (locateData.repeate && locateData.isHandle == 0) {
      // 使用警告图标
      imgURL = warnImgURL;
      // 坐标随机偏移 10 到 20 米
      showlng += Math.random() * 0.002 + 0.0001;
      showlat += Math.random() * 0.002 + 0.0001;
    }

    let location_label = viewer.entities.add({
      id: locateData.code + "_" + Math.random() * 10000,
      name: locateData.keyword,
      position: Cesium.Cartesian3.fromDegrees(showlng, showlat),
      billboard: {
        image: imgURL,
        width: 32,
        height: 32,
      },
      label: {
        text: `${locateData.name}`,
        font: "14pt monospace",
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        fillColor: textColor, // 填充颜色
        outlineColor: Cesium.Color.WHITE, // 外边线颜色
        outlineWidth: 4.0,
        backgroundColor: labelBgColor,
        showBackground: true,
        verticalOrigin: Cesium.VerticalOrigin.TOP,
        pixelOffset: new Cesium.Cartesian2(0, 16),
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 15000),
      },
      description: `  <table>
                        <tbody>
                          <tr><td>lon：</td><td>${locateData.lon}</td></tr>
                          <tr><td>lat：</td><td>${locateData.lat}</td></tr>
                          <tr><td>type：</td><td>${locateData.type}</td></tr>
                          <tr><td>rural_area：</td><td>${locateData.Rural_Area}</td></tr>
                          <tr><td>rural_population：</td><td>${locateData.Rural_Population}</td></tr>
                          <tr><td>streetCode：</td><td>${locateData.name}</td></tr>
                          <tr><td>streetCode：</td><td>${locateData.strt}</td></tr>
                          <tr><td>streetCode：</td><td>${locateData.code}</td></tr>
                          <tr><td>checked：</td><td>${locateData.checked}</td></tr>
                        </tbody>
                      </table>`,
    });
  }

  handler.setInputAction((click) => {
    showPickEntityInfo(click);
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  let lngDiff = eastLng - westLng < 0.02 ? 0.02 : eastLng - westLng;
  let latDiff = northLat - southLat < 0.02 ? 0.02 : northLat - southLat;

  if (changeView) {
    viewer.camera.flyTo({
      destination: Cesium.Rectangle.fromDegrees(
        westLng - lngDiff / 2,
        southLat - latDiff / 2,
        eastLng + lngDiff / 2,
        northLat + latDiff / 2
      ),
    });
  } else {
    console.log("is overcheck not change view");
  }
}

/**
 * 检查当前街道的数据，面板变化
 * @param {*} streetCode 街道编码
 */
function streetGeocodeCheck(streetCode) {
  document.querySelector("#checkType").hidden = true;
  document.querySelector("#skipLoc").hidden = true;
  document.querySelector("#checkGroup").hidden = true;

  var allCheckedBtn = document.querySelector("#checkOverall");
  allCheckedBtn.hidden = false;
  allCheckedBtn.addEventListener("click", goToNextStreet, { once: true });

  groupViewer(allDataByStreet[currentData.streetCode]);
  document.querySelector("#showStreet").checked = true;
  document.querySelector("#updateCode").value = streetCode;

  changeView = false;
}

/**
 * 检查完毕，去下一条街道
 */
function goToNextStreet() {
  changeView = true;
  document.querySelector("#checkType").hidden = false;
  document.querySelector("#checkGroup").hidden = false;
  var allCheckedBtn = document.querySelector("#checkOverall");
  allCheckedBtn.hidden = true;

  document.querySelector("#showStreet").checked = false;
  checkInit(warnData, ++current);
}

document.querySelector("#manuSelectForm").addEventListener("submit", (e) => {
  e.preventDefault();
  releaseClickListener();
  specialCheck();
});

// 监听跳过当前数据按钮
document.querySelector("#skipLoc").addEventListener("click", () => {
  checkInit(warnData, ++current);
  overViewData[2].value++;
  overViewData[1].value--;
  updateOverviewCharts();
});

/**
 * 输入 code 修改对应点
 */
function specialCheck() {
  // 获取 DOM 元素的值
  var code = document.querySelector("#updateCode").value;
  var street = Math.floor(code / 1000);

  if (street in allDataByStreet && code in allDataByStreet[street]) {
    currentData = allDataByStreet[street][code];
    document.querySelector("#errorInfo").textContent = "请拾取坐标";
    // document.querySelector("#localName").value = currentData.keyword;
    handlerPicker();
    // 防止剩余检查数目变负数
    overViewData[0].value--;
    overViewData[1].value++;
    updateOverviewCharts();
  } else {
    document.querySelector("#errorInfo").textContent = "小区/村庄 代码错误";
  }
}

/**
 * 更新数据
 * @param {*} warnData 所有异常的数据
 * @param {*} lon 经度
 * @param {*} lat 纬度
 * @param {*} code 修改点代码
 * @param {Bloom} isHandle 是否是是手动选取的点
 */
function updateGeocode(warnData, lon, lat, code, isHandle = 0) {
  // 更新数据库
  updateGeocodeDB(lon, lat, code, isHandle)
    .then((res) => {
      if (res.success) {
        // 更新环形图显示
        overViewData[0].value++;
        overViewData[1].value--;
        updateOverviewCharts();

        // 修改本地存储数据
        allDataByStreet[currentData.streetCode][currentData.code]["lon"] = lon;
        allDataByStreet[currentData.streetCode][currentData.code]["lat"] = lat;
        allDataByStreet[currentData.streetCode][currentData.code][
          "isHandle"
        ] = 1;

        // 提示坐标修改
        showInfo(
          `编号 ${currentData["code"]} ${currentData["keyword"]} 的坐标已更改`,
          "successInfo"
        );

        let nextDataID = current + 1;
        // 如果是复核数据，重新添加数据
        if (overCheck) {
          viewer.entities.removeAll();
          changeView = false;
          groupViewer(curStreetData);

          document.querySelector("#checkType").hidden = true;
          document.querySelector("#checkGroup").hidden = true;
        } else {
          if (
            overViewData[1].value > 0 &&
            nextDataID < warnData.length &&
            warnData[nextDataID]["streetCode"] ===
              warnData[current]["streetCode"]
          ) {
            // 进行下一次比较
            checkInit(warnData, ++current);
            console.log(warnData[nextDataID]["streetCode"]);
          } else {
            showInfo(
              `现在进行 ${warnData[current]["strt"]} 区域全局比较`,
              "warnInfo"
            );

            viewer.entities.removeAll();

            // 检查全区数据
            streetGeocodeCheck(warnData[current]["streetCode"]);
          }

          document.querySelector("#showStreet").checked = false;
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

/**
 * 更新数据库
 * @param {Number} lon
 * @param {Number} lat
 * @param {String} code
 * @param {Boolean} isHandle 表示是否是手动处理后的
 * @returns
 */
async function updateGeocodeDB(lon, lat, code, isHandle = 0) {
  let url = "http://mizhibd.com/checkApp/backend/update.php";
  let updateFD = new FormData();
  updateFD.append("lon", lon);
  updateFD.append("lat", lat);
  updateFD.append("code", code);
  updateFD.append("isHandle", isHandle);
  updateFD.append("table", document.querySelector("#provinceSelect").value);

  const response = await fetch(url, {
    method: "POST",
    body: updateFD,
  });
  return response.json();
}

/**
 * 显示信息
 * @param {*} text
 */
function showInfo(text, type = "defaultInfo") {
  var infoWrapper = document.querySelector("#changedInfo");
  var updateInfo = document.createElement("p");
  updateInfo.innerHTML = text;
  updateInfo.classList.add(type);
  infoWrapper.appendChild(updateInfo);
  // infoWrapper.scroll(0, infoWrapper.scrollHeight);
  infoWrapper.scrollTop = infoWrapper.scrollHeight;
}

/**
 * 批量更新街道数据
 * @param {*} lon
 * @param {*} lat
 * @param {*} code
 * @returns
 */
async function updateStreetGeocodeDB(street) {
  let url = "http://mizhibd.com/checkApp/backend/updateStreet.php";
  let updateFD = new FormData();
  updateFD.append("strt", street);
  updateFD.append("table", document.querySelector("#provinceSelect").value);

  const response = await fetch(url, {
    method: "POST",
    body: updateFD,
  });

  return response.json();
}

/**
 * 在数据库中标记结果
 * @returns
 */
async function markWarnData() {
  let url = "http://mizhibd.com/checkApp/backend/warnMark.php";
  let warnMarkFD = new FormData();
  console.log(currentData);
  warnMarkFD.append("code", currentData.code);
  warnMarkFD.append("table", document.querySelector("#provinceSelect").value);

  const response = await fetch(url, {
    method: "POST",
    body: warnMarkFD,
  });

  return response.json();
}

export { overViewSet };
