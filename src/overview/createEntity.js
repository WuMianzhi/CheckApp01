import { showInfo } from "../showInfo/showInfo.js";
import { viewer, handler, showPickEntityInfo } from "../cesium/cesiumInit";

/**
 *
 * @param {*} currentData
 * @param {*} lonKey
 * @param {*} latKey
 * @param {*} type
 * @returns
 */
const createPoint = function (
  currentData,
  lonKey = lon_raw,
  latKey = lat_raw,
  type = "YELLOW"
) {
  let imgURL = "http://mizhibd.com/checkApp/backend/ico/location-yellow.png";
  let textColor = new Cesium.Color(228 / 255, 233 / 255, 71 / 255);

  let lng = 0,
    lat = 0;

  if (currentData[lonKey] > 60 && currentData[lonKey] < 160) {
    lng = currentData[lonKey];
    lat = currentData[latKey];
  }
  switch (type) {
    case "RED":
      imgURL = "http://mizhibd.com/checkApp/backend/ico/location-red.png";
      textColor = new Cesium.Color(228 / 255, 32 / 255, 71 / 255);
      break;

    case "GREEN":
      imgURL = "http://mizhibd.com/checkApp/backend/ico/location-green.png";
      textColor = new Cesium.Color(20 / 255, 208 / 255, 70 / 255);

    default:
      break;
  }

  return {
    id: currentData.code + "_" + Math.random() * 10000,
    name: currentData.keyword,
    position: Cesium.Cartesian3.fromDegrees(lng, lat),
    billboard: {
      image: imgURL,
      width: 32,
      height: 32,
    },
    label: {
      text: `${currentData.name}_${currentData.strt}_${currentData.code}`,
      font: "14pt monospace",
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      fillColor: textColor, // 填充颜色
      outlineColor: Cesium.Color.WHITE, // 外边线颜色
      outlineWidth: 4.0,
      backgroundColor: new Cesium.Color(0.2, 0.2, 0.2, 0.2),
      showBackground: true,
      verticalOrigin: Cesium.VerticalOrigin.TOP,
      pixelOffset: new Cesium.Cartesian2(0, 16),
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 4000),
    },
    description: `  <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <style>
        .table {
          border-radius: 40px;
          border-collapse: collapse;
          width: 100%;
        }
        .table th,
        .table td {
          padding: 4px;
          border: 1px solid rgba(245, 245, 245, 0.5);
        }
  
        .table tbody tr:nth-child(2n) {
          background-color: rgba(240, 248, 255, 0.2);
        }

        .table tbody td:first-child{
          width: 2rem;
        }

        .select {
          padding: 4px;
          margin: 4px;
        }

        button {
          padding: 4px 8px;
          margin: 4px;
          border: solid rgba(128, 128, 128, 0.5) 1px;
          border-radius: 2px;
        }
      </style>
      </head>
      <body >
        <table class="table">
          <tbody>
            <tr>
              <td>Lon：</td>
              <td>${lng}</td>
            </tr>
            <tr>
              <td>Lat：</td>
              <td>${lat}</td>
            </tr>
            <tr>
              <td>Type：</td>
              <td>${currentData.type}</td>
            </tr>
            <tr>
              <td>Rural_area：</td>
              <td>${currentData.Rural_Area}</td>
            </tr>
            <tr>
              <td>Rural_population：</td>
              <td>${currentData.Rural_Population}</td>
            </tr>
            <tr>
              <td>Name：</td>
              <td>${currentData.name}</td>
            </tr>
            <tr>
              <td>StreetCode：</td>
              <td>${currentData.strt}</td>
            </tr>
            <tr>
              <td>Code：</td>
              <td id='code'>${currentData.code}</td>
            </tr>
            <tr>
              <td>Checked：</td>
              <td>${currentData.checked}</td>
            </tr>
            <tr>
            <td>Status：</td>
            <td>
              <span id="statusDisplay"></span>
              <button id="showSelect" onclick="document.querySelector('#changeTR').hidden = false; 
              fetch('http://mizhibd.com/checkApp/backend/queryOneSite.php', {
                method: 'POST',
                body: new FormData(document.querySelector('#statusForm')),
              })
                .then((res) => res.json())
                .then((res) => {
                  document.querySelector('#statusDisplay').innerHTML =
                    res.affected_rows[0].status;
                });
              "> 点击显示或修改 </button>
            </td>
          </tr>
          <tr id="changeTR" hidden>
            <td>Status：</td>
            <td>
              <form id="statusForm">
                <input name="code" value="${currentData.code}" hidden>
                <input name="table" value="${
                  document.querySelector("#provinceSelect").value
                }" hidden>
                <input name="provinceCode" value="${
                  document.querySelector("#provinceSelect").value
                }" hidden>
                <select name="status" class="select" value="${
                  currentData.status
                }">
                <option value="0" title="0：正常">&nbsp;0：正常</option>
                <option value="1" title="1：整体搬迁，图斑、人口设定为 0">
                  &nbsp;1：整体搬迁，图斑、人口设定为 0
                </option>
                <option value="-1" title="-1：部分搬迁，图斑、人口不为0">
                  -1：部分搬迁，图斑、人口不为0
                </option>
                <option
                  value="2"
                  title="2：特殊点位，（如军队、监狱、拘留所、劳改农场等），图斑、人口设定为
                0"
                >
                  &nbsp;2：特殊点位，图斑、人口设定为 0
                </option>
                <option
                  value="-2"
                  title="-2：特殊点位，（如军队、监狱、拘留所、劳改农场等），图斑、人口不为0特殊点位"
                >
                  -2：特殊点位，图斑、人口不为0特殊点位
                </option>
                <option
                  value="-2"
                  title="-2：特殊点位，（如军队、监狱、拘留所、劳改农场等），图斑、人口不为0特殊点位"
                >
                  -2：特殊点位，图斑、人口不为0特殊点位
                </option>
                </select>
                <button type="button" onclick='const data = new FormData(document.querySelector("#statusForm"));
                fetch("http://mizhibd.com/checkApp/backend/updateStatus.php", {
                  method: "POST",
                  body: data,
                }).then(() => {
                  window.parent.postMessage(message, "*");
                  document.querySelector("#changeTR").hidden = true;
                  document.querySelector("#statusDisplay").innerHTML = data.get("status");
                });'>确认</button>
              </form>
            </td>
          </tr>
          </tbody>
        </table>
      </body>
    </html>
    `,
    extraInfo: currentData,
  };
};

/**
 * 在 viewer 中添加 编码点
 * @param {*} streetLocalData
 */
const groupViewer = function (streetLocalData, extra, changeView = true) {
  const idList = Object.keys(streetLocalData);
  const streetName = streetLocalData[idList[0]].keyword.slice(
    0,
    streetLocalData[idList[0]].keyword.indexOf(streetLocalData[idList[0]].name)
  );
  // console.log();
  document.querySelector("#midInfo").innerHTML =
    streetLocalData[idList[0]].strt;
  showInfo(`正在复核 ${streetName} ，共计 ${idList.length} 条数据`);

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

  // 计算边界
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

    // 视角归正
    viewer.entities.add({
      id: locateData.code + "_" + Math.random() * 10000,
      name: locateData.keyword,
      position: Cesium.Cartesian3.fromDegrees(showlng, showlat),
      billboard: {
        image: imgURL,
        width: 32,
        height: 32,
      },
      label: {
        text:
          locateData.type > 200
            ? locateData.name
            : " * " + locateData.name + " * ",
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
      description: `  <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Document</title>
          <style>
          .table {
            border-radius: 40px;
            border-collapse: collapse;
            width: 100%;
          }
          .table th,
          .table td {
            padding: 4px;
            border: 1px solid rgba(245, 245, 245, 0.5);
          }
    
          .table tbody tr:nth-child(2n) {
            background-color: rgba(240, 248, 255, 0.2);
          }

          .table tbody td:first-child{
            width: 2rem;
          }

          .select {
            padding: 4px;
            margin: 4px;
          }

          button {
            padding: 4px 8px;
            margin: 4px;
            border: solid rgba(128, 128, 128, 0.5) 1px;
            border-radius: 2px;
          }
          
        </style>
        </head>
        <body>
          <table class="table">
            <tbody>
              <tr>
                <td>Lon：</td>
                <td>${locateData.lon}</td>
              </tr>
              <tr>
                <td>Lat：</td>
                <td>${locateData.lat}</td>
              </tr>
              <tr>
                <td>Type：</td>
                <td>${locateData.type}</td>
              </tr>
              <tr>
                <td>Rural_area：</td>
                <td>${locateData.Rural_Area}</td>
              </tr>
              <tr>
                <td>Rural_population：</td>
                <td>${locateData.Rural_Population}</td>
              </tr>
              <tr>
                <td>Name：</td>
                <td>${locateData.name}</td>
              </tr>
              <tr>
                <td>StreetCode：</td>
                <td>${locateData.strt}</td>
              </tr>
              <tr>
                <td>Code：</td>
                <td id='code'>${locateData.code}</td>
              </tr>
              <tr>
                <td>Checked：</td>
                <td>${locateData.checked}</td>
              </tr>
              <tr>
              <td>Status：</td>
              <td>
                <span id="statusDisplay"></span>
                <button id="showSelect" onclick="document.querySelector('#changeTR').hidden = false
                fetch('http://mizhibd.com/checkApp/backend/queryOneSite.php', {
                method: 'POST',
                body: new FormData(document.querySelector('#statusForm')),
              })
                .then((res) => res.json())
                .then((res) => {
                  document.querySelector('#statusDisplay').innerHTML =
                    res.affected_rows[0].status;
                });
                ">点击显示或修改</button>
              </td>
            </tr>
            <tr id="changeTR" hidden>
              <td>Status 修改为：</td>
              <td>
                <form id="statusForm">
                  <input name="code" value="${locateData.code}" hidden>
                  <input name="table" value="${
                    document.querySelector("#provinceSelect").value
                  }" hidden>
                  <input name="provinceCode" value="${
                    document.querySelector("#provinceSelect").value
                  }" hidden>
                  <select name="status" class="select" value="${
                    locateData.status
                  }">
                  <option value="0" title="0：正常">&nbsp;0：正常</option>
                <option value="1" title="1：整体搬迁，图斑、人口设定为 0">
                  &nbsp;1：整体搬迁，图斑、人口设定为 0
                </option>
                <option value="-1" title="-1：部分搬迁，图斑、人口不为0">
                  -1：部分搬迁，图斑、人口不为0
                </option>
                <option
                  value="2"
                  title="2：特殊点位，（如军队、监狱、拘留所、劳改农场等），图斑、人口设定为
                0"
                >
                  &nbsp;2：特殊点位，图斑、人口设定为 0
                </option>
                <option
                  value="-2"
                  title="-2：特殊点位，（如军队、监狱、拘留所、劳改农场等），图斑、人口不为0特殊点位"
                >
                  -2：特殊点位，图斑、人口不为0特殊点位
                </option>
                  </select>
                  <button type="button" onclick='const data = new FormData(document.querySelector("#statusForm"));
                  fetch("http://mizhibd.com/checkApp/backend/updateStatus.php", {
                    method: "POST",
                    body: data,
                  }).then(() => {
                    document.querySelector("#changeTR").hidden = true;
                    document.querySelector("#statusDisplay").innerHTML = data.get("status");
                  });'>确认</button>
                </form>
              </td>
            </tr>
            </tbody>
          </table>
        </body>
      </html>
      `,
      extraInfo: locateData,
    });
  }

  handler.setInputAction((click) => {
    showPickEntityInfo(click);
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  // 防止缩放级别过小
  let lngDiff = eastLng - westLng < 0.02 ? 0.02 : eastLng - westLng;
  let latDiff = northLat - southLat < 0.02 ? 0.02 : northLat - southLat;
  console.log(
    westLng - lngDiff / 2,
    southLat - latDiff / 2,
    eastLng + lngDiff / 2,
    northLat + latDiff / 2
  );
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
};

export { createPoint, groupViewer };
