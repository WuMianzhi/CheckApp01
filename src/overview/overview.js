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
  overCheck = false;
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
  // 重置某些数据
  minCheckTime = 9999999;
  maxCheckTime = 0;
  warnData = [];
  allDataByStreet = {};

  for (let locateData of geocodeData) {
    if (
      (locateData.coordSource_group > 1 && locateData.checked == 0) ||
      locateData.warn > 0
    ) {
      warnData.push(locateData);
      warnNum++;
    }
    locateData["streetCode"] = Math.floor(locateData["code"] / 1000);
    if (locateData["streetCode"] != preStreetCode) {
      allDataByStreet[locateData["streetCode"]] = {};
      preStreetCode = locateData["streetCode"];
    }

    // 找出复核最少的次数
    minCheckTime > locateData["checked"]
      ? (minCheckTime = locateData["checked"])
      : null;
    // 找出复核最多的次数
    maxCheckTime < locateData["checked"]
      ? (maxCheckTime = locateData["checked"])
      : null;
    allDataByStreet[locateData["streetCode"]][locateData["code"]] = locateData;
    // console.log(locateData[]);
  }
  console.log(warnData);
  overViewData[0].value = allNum;
  overViewData[1].value = warnNum;

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
      groupViewer(allDataByStreet[currentData.streetCode], false);
      document.querySelector("#checkHandle").hidden = false;
      document.querySelector("#skipLoc").hidden = false;
    }
  } else {
    viewer.entities.removeAll();

    if (overCheck) {
      groupViewer(curStreetData);
    } else {
      // 添加 entity
      // 判断是否解析出
      if (currentData.lon > 60 && currentData.lon_raw < 160) {
        // document.querySelector("#checkType").hidden = false;
        // 添加按 type 判断出的结果
        var type_location = viewer.entities.add({
          id: locateData.code + "_" + Math.random() * 10000,
          name: locateData.keyword,
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
            backgroundColor: new Cesium.Color(0.2, 0.2, 0.2, 0.2),
            showBackground: true,
            outlineWidth: 2,
            verticalOrigin: Cesium.VerticalOrigin.TOP,
            pixelOffset: new Cesium.Cartesian2(0, 16),
          },
        });
      }

      // 同上
      if (currentData.lon_group > 60 && currentData.lon_group < 160) {
        // document.querySelector("#checkGroup").hidden = false;
        // 添加按 聚类 判断出的结果
        var type_location = viewer.entities.add({
          id: locateData.code + "_" + Math.random() * 10000,
          name: locateData.keyword,
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
            outlineWidth: 2,
            verticalOrigin: Cesium.VerticalOrigin.TOP,
            pixelOffset: new Cesium.Cartesian2(0, 16),
          },
          description: "sda",
        });
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
          backgroundColor: new Cesium.Color(0.2, 0.2, 0.2, 0.2),
          showBackground: true,
          outlineWidth: 2,
          verticalOrigin: Cesium.VerticalOrigin.TOP,
          pixelOffset: new Cesium.Cartesian2(0, 16),
        },
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
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          showBackground: true,
          outlineWidth: 2,
          verticalOrigin: Cesium.VerticalOrigin.TOP,
          backgroundColor: new Cesium.Color(0.2, 0.2, 0.2, 0.2),
          pixelOffset: new Cesium.Cartesian2(0, 16),
        },
      });
    } else {
      document.querySelector("#checkGroup").hidden = true;
      showInfo("方法二未解析出结果");
      lon_group = lon_raw;
      lat_group = lat_raw;
    }

    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        (lon_group + lon_raw) / 2,
        (lat_group + lat_raw) / 2,
        10000
      ),
    });

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
  // 初始化视图
  var overCheckDoneBtn = document.querySelector("#overCheckDone");
  overCheckDoneBtn.hidden = false;

  var overCheckBtn = document.querySelector("#overCheck");
  curStreetDataID = 0;
  var overCheckKeys = Object.keys(allDataByStreet);
  curStreetData = allDataByStreet[overCheckKeys[curStreetDataID]];

  groupViewer(curStreetData);

  overCheckViewUpdate();

  // 更新 charts
  updateOverviewCharts();

  // 视图更新
  document.querySelector("#updateCode").value = overCheckKeys[curStreetDataID];
  var overCheckStreetKeys = Object.keys(curStreetData);

  // document.querySelector("#localName").value =
  //   curStreetData[overCheckStreetKeys[0]].name;

  overCheckDoneBtn.addEventListener("click", overCheckNextStreet);

  overCheckBtn.hidden = true;
}

/**
 * 复核数据时跳转至下一街道
 *
 */
function overCheckNextStreet() {
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

  updateGeocode(warnData, lon, lat, currentData.code);
  releaseClickListener();
}

/**
 * 按聚类结果更新坐标
 */
function updateGeocodeGroup() {
  lon = currentData.lon_group;
  lat = currentData.lat_group;
  updateGeocode(warnData, lon, lat, currentData.code);
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
      document.querySelector("#errorInfo").textContent = "";
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
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      backgroundColor: new Cesium.Color(0.2, 0.2, 0.2, 0.2),
      showBackground: true,
      outlineWidth: 2,
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
  updateGeocode(warnData, currentData.lon, currentData.lat, currentData.code);
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

  let imgURL = "http://mizhibd.com/checkApp/backend/ico/location-green.png";
  extra
    ? (imgURL = "http://mizhibd.com/checkApp/backend/ico/location-red.png")
    : null;
  document.querySelector("#checkHandle").hidden = true;
  document.querySelector("#skipLoc").hidden = true;
  var sum_lon = 0,
    sum_lat = 0,
    dataNum = 0;

  // 添加 数据点群
  for (let locationData in streetLocalData) {
    let locateData = streetLocalData[locationData];
    // 记录并求平均值
    sum_lon += parseFloat(locateData.lon);
    sum_lat += parseFloat(locateData.lat);
    dataNum++;

    let location_label = viewer.entities.add({
      id: locateData.code + "_" + Math.random() * 10000,
      name: locateData.keyword,
      position: Cesium.Cartesian3.fromDegrees(locateData.lon, locateData.lat),
      billboard: {
        image: imgURL,
        width: 32,
        height: 32,
      },
      label: {
        text: `${locateData.name}_${locateData.strt}_${locateData.code}`,
        font: "14pt monospace",
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        backgroundColor: new Cesium.Color(0.0, 0.83, 0.41, 0.2),
        showBackground: true,
        outlineWidth: 2,
        verticalOrigin: Cesium.VerticalOrigin.TOP,
        pixelOffset: new Cesium.Cartesian2(0, 16),
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 15000),
      },
      description: `  <table>
                        <tbody>
                          <tr><td>lon：</td><td>${locateData.lon}</td></tr>
                          <tr><td>lat：</td><td>${locateData.lat}</td></tr>
                          <tr><td>rural_area：</td><td>${locateData.Rural_Area}</td></tr>
                          <tr><td>rural_population：</td><td>${locateData.Rural_Population}</td></tr>
                          <tr><td>streetCode：</td><td>${locateData.name}</td></tr>
                          <tr><td>checked：</td><td>${locateData.checked}</td></tr>
                        </tbody>
                      </table>`,
    });
  }

  handler.setInputAction((click) => {
    showPickEntityInfo(click);
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(
      sum_lon / dataNum,
      sum_lat / dataNum,
      20000
    ),
  });
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

  groupViewer(allDataByStreet[streetCode]);
  document.querySelector("#showStreet").checked = true;
  document.querySelector("#updateCode").value = streetCode;
}

/**
 * 检查完毕，去下一条街道
 */
function goToNextStreet() {
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
 * 特殊点修改
 */
function specialCheck() {
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
 *
 * @param {*} warnData
 * @param {*} lon
 * @param {*} lat
 * @param {*} code
 */
function updateGeocode(warnData, lon, lat, code) {
  // 更新数据库
  updateGeocodeDB(lon, lat, code)
    .then((res) => {
      if (res.success) {
        // 更新环形图显示
        overViewData[0].value++;
        overViewData[1].value--;
        updateOverviewCharts();

        // 修改本地存储数据
        allDataByStreet[currentData.streetCode][currentData.code]["lon"] = lon;
        allDataByStreet[currentData.streetCode][currentData.code]["lat"] = lat;

        // 提示坐标修改
        showInfo(
          `编号 ${currentData["code"]} ${currentData["keyword"]} 的坐标已更改`,
          "successInfo"
        );

        let nextDataID = current + 1;
        if (overCheck) {
          viewer.entities.removeAll();
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
 * @param {*} lon
 * @param {*} lat
 * @param {*} code
 * @returns
 */
async function updateGeocodeDB(lon, lat, code) {
  let url = "http://mizhibd.com/checkApp/backend/update.php";
  let updateFD = new FormData();
  updateFD.append("lon", lon);
  updateFD.append("lat", lat);
  updateFD.append("code", code);
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
