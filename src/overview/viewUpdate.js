/**
 * 显示 初步检查 时的按钮
 * @param {boolean} hidden
 */
function toggleCheckBtnGroup(hidden = false) {
  // 显示隐藏元素
  var checkBtnGroupContainer = document.querySelector(
    "#locSelectContainer .check-container"
  );
  checkBtnGroupContainer.hidden = hidden;

  var checkBtnGroup = checkBtnGroupContainer.children;
  // 显示隐藏子元素
  for (let checkBtn of checkBtnGroup) {
    checkBtn.hidden = hidden;
  }
  // 针对当前区域检查完毕的特殊处理
  hidden ? null : (document.getElementById("checkOverall").hidden = true);
}

/**
 * 显示 复核数据 时的按钮
 * @param {*} hidden
 */
function toggleOvercheckBtnGroup(hidden = false) {
  // 显示隐藏元素
  var overcheckBtnGroupContainer = document.querySelector(
    "#locSelectContainer .overcheck-container"
  );
  overcheckBtnGroupContainer.hidden = hidden;
  // 仅显示  复核此区域按钮 或者 全部隐藏
  var overcheckBtnGroup = overcheckBtnGroupContainer.children;
  if (hidden) {
    for (let overcheckBtn of overcheckBtnGroup) {
      overcheckBtn.hidden = hidden;
    }
  } else {
    var overcheckInitBtn = document.getElementById("overCheck");
    overcheckInitBtn.hidden = hidden;
  }
}

function toggleHandlePickBtn(hidden = false) {
  document.querySelector(
    "#locSelectContainer .handle-picker-container"
  ).hidden = hidden;
  document.querySelector("#handlerConfirm").hidden = hidden;
  document.getElementById("errorMark").hidden = false;
}

export { toggleCheckBtnGroup, toggleOvercheckBtnGroup, toggleHandlePickBtn };
