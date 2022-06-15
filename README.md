# 本网站用作检查 小区/村庄 点位数据

已经发布至 [CheckApp](http://mizhibd.com/checkApp/)

**仅供内部使用**

安装模块 `npm install`
本地运行 `npm run start`

## 各省数据状况

| 编码 | 省份     |  现有 |  实际 |  缺失 |
| ---: | :------- | ----: | ----: | ----: |
|   11 | 北京市   |  7270 |  7270 |     0 |
|   12 | 天津市   |  5521 |  5521 |     0 |
|   13 | 河北省   | 53851 | 53851 |     0 |
|   14 | 山西省   | 23465 | 23465 |     0 |
|   15 | 内蒙古   | 14426 | 14426 |     0 |
|   21 | 辽宁省   | 16376 | 16376 |     0 |
|   22 | 吉林省   | 11727 | 11727 |     0 |
|   23 | 黑龙江省 | 13879 | 13879 |     0 |
|   31 | 上海市   |  6188 |  6188 |     0 |
|   32 | 江苏省   | 22180 | 22180 |     0 |
|   33 | 浙江省   | 22527 | 25527 |     0 |
|   34 | 安徽省   | 18306 | 18306 |     0 |
|   35 | 福建省   | 17289 | 17289 |     0 |
|   36 | 江西省   |     0 | 21616 | 21616 |
|   37 | 山东省   |     0 | 75093 | 75093 |
|   41 | 河南省   |     0 | 52331 | 52331 |
|   42 | 湖北省   |  1983 | 28381 | 26389 |
|   43 | 湖南省   | 29479 | 29479 |     0 |
|   44 | 广东省   | 26631 | 26631 |     0 |
|   45 | 广西     |     0 | 16551 | 16551 |
|   46 | 海南省   |     0 |  3315 |  3315 |
|   50 | 重庆市   | 11224 | 11224 |     0 |
|   51 | 四川省   | 35425 | 35425 |     0 |
|   52 | 贵州省   |     0 | 17862 | 17862 |
|   53 | 云南省   |  1675 | 14640 | 13265 |
|   54 | 西藏省   |     0 |  5513 |  5513 |
|   61 | 陕西省   | 19916 | 19916 | 19916 |
|   62 | 甘肃省   |     0 | 17656 | 17656 |
|   63 | 青海省   |     0 |  4706 |  4706 |
|   64 | 宁夏     |     0 |  2849 |  2849 |
|   65 | 新疆     |     0 | 14791 | 14791 |

## Todo

- 添加 湖北 数据
- 视角问题
- 标识重叠点
- 统一图标样式

## 更新日志

### 2022/6/14

- 添加陕西省数据
- 补齐黑龙江鸡西市麻山区数据 20 条, 宝山区与龙凤区 77 条
- 添加陕西、重庆数据

### 2022/6/13

- 弹出框添加信息
- 查找出黑龙江缺失数据，补齐广东缺失数据 2 条

### 2022/6/12

1. 添加四川省数据 35425 条
2. 修改进度显示面板位置
3. 修正安徽省数据
4. 修复数据显示错误问题

### 2022/6/11

1. 补全安徽省的数据，总计 18306 条
2. 添加福建省数据共 17289 条
3. 检查数据库内其他省份的数据，添加河北省唐山市曹妃甸区唐海镇 152 条数据

### 2022/6/10

1. 添加安徽省数据 18260 条
2. 解决跨域问题

### 2022/6/9

1. 修正内蒙古数据
2. 添加了吉林、江苏、浙江 三个省份的数据
3. 区域切换时，初始化显示当前区县数据

### 2022/6/7 -- 重新显示平面图按钮，以及修复了一些 bug

1. 页面左上角重新显示地图 3D/2D 地图切换按钮
2. 修改了 cesium-map cdn 错误，jsdeliver 换成自己服务器上的资源（ http://mizhibd.com/checkApp/backend/cesium-map.js ）
3. 更改修改后的图标显示样式，手动检查后的图标为蓝色
