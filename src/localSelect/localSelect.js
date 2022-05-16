import { provinceData, cityData, countyData } from "./localData.js";
import { overViewSet } from "../overview/overview.js";
/**
 * 初始化列表选择
 */
function initLocalSelect() {
  var provinceSelect = document.querySelector("#provinceSelect");
  var citySelect = document.querySelector("#citySelect");
  var countySelect = document.querySelector("#countySelect");
  appendOpt(provinceSelect, provinceData);

  // select 添加监听事件
  provinceSelect.addEventListener("change", (e) => {
    appendOpt(citySelect, cityData[e.target.value]);
  });

  citySelect.addEventListener("change", (e) => {
    appendOpt(countySelect, countyData[e.target.value]);
  });
}

function queryLocalData(localForm) {
  if (localForm) {
    fetch("http://mizhibd.com/checkApp/backend/query.php", { method: "POST", body: localForm })
      .then((response) => response.json())
      .then((data) => {
        overViewSet(data.affected_rows)
      });
  } else {
    console.log("没有数据呀，宝");
  }
}

/**
 * 根据字典数据在 select 框中添加 option 选项
 * @param {DOM} selectDom
 * @param {Dict} optData
 */
function appendOpt(selectDom, optData) {
  selectDom.innerHTML = "";
  let option = document.createElement("option");
  option.innerText = "请选择";
  option.value = "000000"
  selectDom.appendChild(option);
  // 添加选项
  for (let opt in optData) {
    let option = document.createElement("option");
    option.value = opt;
    option.innerText = optData[opt];
    selectDom.appendChild(option);
  }
}

export { initLocalSelect, queryLocalData };
