import { cityData } from "./localData";

/**
 * 下载 zip 文件
 */
function zipDataDownload() {
  let provnCode = document.querySelector("#provinceSelect").value;
  let cityCode = document.querySelector("#citySelect").value;
  // let countyCode = document.querySelector("#countySelect").value;
  let countyCode = "000000";
  let countyName = cityData[provnCode][cityCode];

  let preprocessUrl = `http://47.103.109.107:8000/dataExport/?provnCode=${provnCode}&cityCode=${cityCode}&countyCode=${countyCode}`;
  let tips = document.querySelector("#loadingHint");
  tips.classList.remove("hidden");
  fetch(preprocessUrl, { method: "GET" })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      tips.classList.add("hidden");
      if (data.zipUrl) {
        let downA = document.createElement("a");
        downA.href = data.zipUrl;
        downA.download = cityCode + "_" + countyName + ".zip";
        downA.click();
      }
      // console.log(data);
    })
    .catch((err) => {
      tips.classList.add("hidden");
      const errorTips = document.querySelector("#errorTips");
      errorTips.href = `http://mizhibd.com/checkApp/backend/pointData/${provnCode}/${cityCode}/${cityCode}.zip`;
      errorTips.classList.remove("hidden");
      errorTips.addEventListener("click", () => {
        errorTips.classList.add("hidden");
      });
      console.log(err);
    });
  // console.log(preprocessUrl);
}

export { zipDataDownload };
