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
  // console.log(currentData);
  warnMarkFD.append("code", currentData.code);
  warnMarkFD.append("table", document.querySelector("#provinceSelect").value);

  const response = await fetch(url, {
    method: "POST",
    body: warnMarkFD,
  });

  return response.json();
}

export { markWarnData, updateStreetGeocodeDB, updateGeocodeDB };
