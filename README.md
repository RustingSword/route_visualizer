# Route Visualizer

交通路线可视化工具

主要用到OpenStreetMap的[Nominatim](http://wiki.openstreetmap.org/wiki/Nominatim)（通过[geopy](https://github.com/geopy/geopy)）和百度的[Echarts](http://echarts.baidu.com/demo.html#geo-lines)。

今年清明的规划：
![input](input.jpg)
![result](result.jpg)

# 用法

1. `pip install -U flask requests geopy`
2. 如果装了 [Gunicorn](http://gunicorn.org/)，可以直接`./start.sh`，如果没装，可以`python app.py`。

# 注意事项（a.k.a. 踩过的坑）

1. Nominatim 的 API 限制是每秒不超过 1 次请求，实现里是在输入停止 1 秒之后调用 Geocode API 来搜索，保证不超过限制。另外直接用 dict 做了简单的缓存，如果搜过就不再重新搜了。
2. 候选地址是用[`<datalist>`](https://www.w3schools.com/tags/tag_datalist.asp)展示的，Firefox 不能显示下拉图标，Chrome 效果好一些。另外下拉框只会显示包含当前输入内容的地点列表，比如搜索`莫斯科`，返回的是俄文地址，这个时候是没法匹配的，只能删掉输入框里的内容手动点击下拉图标才会出现结果。
3. 动画效果貌似比较耗 CPU。
4. 由于对 JavaScript 基本一窍不通，用到的 js 代码是从各种地方东拼西凑的，出了问题如果 Google 不到也没有能力解决。目前最大的问题是 timer 会多次触发 `form.js` 里的`doneTyping`函数（一般 5-6 次），不知道哪里的问题，需要修复。
5. Flask 经验也不足，很多写法还可以改进。

# Todo
1. 改进代码。
2. 支持更多的交通工具，比如火车、轮船、自行车、火箭、热气球 etc.（主要工作是找合适的 SVG 图像……）。
3. `zoom`的计算方法还可以再优化一下，比如可以根据所有经纬度坐标确定需要覆盖的范围，保证能显示所有的地点。
4. 更好的 cache 方式。
5. 结合其他相关 API 提供更多信息。
