/**
 * 显示信息
 * @param {*} text
 */
const showInfo = function (text, type = "defaultInfo") {
  const infoWrapper = document.querySelector("#changedInfo");
  const updateInfo = document.createElement("p");
  updateInfo.innerHTML = text;
  updateInfo.classList.add(type);
  infoWrapper.appendChild(updateInfo);
  // infoWrapper.scroll(0, infoWrapper.scrollHeight);
  infoWrapper.scrollTop = infoWrapper.scrollHeight;
};

const delayToggleTopInfWrapper = function (time = 0) {
  setTimeout(() => {
    document.querySelector("#topInfoContainer").classList.toggle("hidden");
  }, time);
};

const showTopInfo = function (text = "") {
  document.querySelector("#topInfo").innerHTML = text;
  delayToggleTopInfWrapper();
  delayToggleTopInfWrapper(3600);
};

const showRightInfo = function (codeInfo) {
  document
    .querySelector(".cesium-infoBox-visible")
    ?.classList.remove("cesium-infoBox-visible");

  document.querySelector("#rightHeaderCenter").innerHTML = codeInfo.name;
  document.querySelector("#centerHeadercenter").innerHTML = codeInfo.name;

  document.querySelector("#centerInfoCode").value = codeInfo.code;
  document.querySelector("#centerInfoprovinceCode").value =
    document.querySelector("#provinceSelect").value;

  document.querySelector("#centerInfoTable").value =
    document.querySelector("#provinceSelect").value;

  document.querySelector("#rightSideWrapper").classList.remove("hidden");
  document.querySelector("#leftInfoLng").innerHTML = codeInfo.lon;
  document.querySelector("#leftInfoLat").innerHTML = codeInfo.lat;
  document.querySelector("#leftInfoType").innerHTML = codeInfo.type;
  document.querySelector("#leftInfoRuralArea").innerHTML = codeInfo.Rural_Area;
  document.querySelector("#leftInfoRuralPopulation").innerHTML =
    codeInfo.Rural_Population;
  document.querySelector("#leftInfoName").innerHTML = codeInfo.name;
  document.querySelector("#leftInfoStreetCode").innerHTML = codeInfo.strt;
  document.querySelector("#leftInfoCode").innerHTML = codeInfo.code;
  document.querySelector("#leftInfoChecked").innerHTML = codeInfo.checked;
  document.querySelector("#leftInfoStatus").innerHTML = codeInfo.status;

  document
    .querySelector("#showSelect")
    .removeEventListener("click", showCenterInfo);
  document.querySelector("#showSelect").addEventListener("click", () => {
    showCenterInfo(codeInfo);
  });

  fetch("http://mizhibd.com/checkApp/backend/queryOneSite.php", {
    method: "POST",
    body: new FormData(document.querySelector("#statusForm")),
  })
    .then((res) => res.json())
    .then((res) => {
      document.querySelector("#leftInfoStatus").innerHTML =
        res.affected_rows[0].status;
    });
};

const showCenterInfo = function (codeInfo) {
  document.querySelector("#centerInfoContainer").classList.remove("hidden");
};

export {
  showInfo,
  delayToggleTopInfWrapper,
  showTopInfo,
  showRightInfo,
  showCenterInfo,
};
