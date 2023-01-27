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

export { showInfo };
