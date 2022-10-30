/**
 * 在 cesium toolbar 末尾添加图标
 * @param {string} name 图标名称/ID
 * @param {array} classList 样式列表
 * @param {function} clickFn 点击函数
 * @param {string} title title
 */
export const addIconInCesiumToolbar = function (
  name,
  classList,
  clickFn,
  title
) {
  const cesiumViewerToolbar = document.querySelector(
    "#cesiumContainer .cesium-viewer-toolbar"
  );
  let iconWrapper = document.createElement("div");
  iconWrapper.id = name;
  iconWrapper.classList.add("cesium-button", "cesium-toolbar-button");
  iconWrapper.title = title;

  let icon = document.createElement("div");
  icon.classList.add(...classList);

  iconWrapper.appendChild(icon);
  cesiumViewerToolbar.appendChild(iconWrapper);

  iconWrapper.addEventListener("click", clickFn);

  iconWrapper.addEventListener("click", (e) => {
    e.target.classList.contains("inactive")
      ? e.target.classList.remove("inactive")
      : e.target.classList.add("inactive");
  });
};

/**
 *
 * @param {*} title
 * @param {*} classList
 * @param {*} defaultAlpha
 * @param {*} changFn
 * @param {*} inputId
 */
export const addAlphaControner = function (
  title,
  classList,
  defaultAlpha,
  changFn,
  inputId
) {
  let alphaControlContainer = document.createElement("div");
  alphaControlContainer.title = title;
  alphaControlContainer.className = "alpha-control-container";
  alphaControlContainer.classList.add(...classList);

  let alphaControl = document.createElement("input");
  alphaControl.id = inputId;
  alphaControl.type = "range";
  alphaControl.min = 0;
  alphaControl.max = 100;
  alphaControl.value = defaultAlpha;
  alphaControl.classList.add("alpha-control");
  alphaControl.disabled = true;
  alphaControl.addEventListener("change", (e) => {
    changFn(e);
  });

  alphaControlContainer.appendChild(alphaControl);
  document
    .querySelector("#imageryLayerControlWrapper")
    .appendChild(alphaControlContainer);
};

export const addAlphaAndIcon = function (
  btnObj,
  controlObj,
  addControl = false
) {
  addIconInCesiumToolbar(
    btnObj.id,
    btnObj.classList,
    btnObj.fn,
    btnObj.title
  );
  addControl
    ? addAlphaControner(
        btnObj.title + " 图层不透明度控制",
        controlObj.classList,
        controlObj.defaultAlpha,
        controlObj.fn,
        controlObj.id
      )
    : null;
};
