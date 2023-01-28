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

export { showInfo, delayToggleTopInfWrapper, showTopInfo };
