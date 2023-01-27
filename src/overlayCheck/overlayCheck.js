/**
 *
 * 筛选出距离小于给定阈值的点
 * 在原数组中添加 isRepeat 字段标识是否为重复的点
 * @param {object} points
 * @param {number} threshold
 *
 */
const overlayCheck = function (points, threshold) {
  // 对点按经度进行排序
  points.sort((pointA, pointB) => {
    return pointA.lat - pointB.lat;
  });

  for (let i = 0; i < points.length - 1; i++) {
    // 计算相邻两点之间的距离
    const prev = points[i],
      next = points[i + 1];
    const distance = Cesium.Cartesian3.distance(
      Cesium.Cartesian3.fromDegrees(prev.lon, prev.lat),
      Cesium.Cartesian3.fromDegrees(next.lon, next.lat)
    );

    next.isRepeat = false;
    // 判断是否超过阈值
    if (distance < threshold) {
      prev.isRepeat = true;
      next.isRepeat = true;
    }
  }
};

export { overlayCheck };
