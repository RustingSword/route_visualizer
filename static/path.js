var planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';
var carPath = 'path://M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759 c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713 v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336 h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805z';

var transportation = {
    'car': carPath,
    'plane': planePath
};

var curvenesses = {
    'car': 0,
    'plane': 0.2
};

var sizes = {
    'car': [10, 20],
    'plane': 15
}


var color = ['#a6c84c', '#ffa022', '#46bee9', '#f4e925'];

var build_option = function (path_data, geoCoordMap, city_list, periods, center,
    zoom, use_map, dists, need_hours) {
    var series = [];
    path_data.forEach(function (item, i) {
        series.push({
            name: '目的地',
            type: 'lines',
            zlevel: 1,
            effect: {
                show: true,
                period: periods[i],
                trailLength: 0.7,
                color: '#fff',
                symbolSize: 3
            },
            lineStyle: {
                normal: {
                    color: color[i % color.length],
                    width: 0,
                    curveness: curvenesses[item[2]]
                }
            },
            data: [{
                //name: item[0] + '→' + item[1],
                //fromName: item[0],
                //toName: item[1],
                coords: [
                    geoCoordMap[item[0]],
                    geoCoordMap[item[1]]
                ]
            }]
        }, {
            name: '目的地',
            type: 'lines',
            zlevel: 2,
            symbol: ['none', 'none'],
            symbolSize: 10,
            effect: {
                show: true,
                period: periods[i],
                trailLength: 0,
                symbol: transportation[item[2]],
                symbolSize: sizes[item[2]]
            },
            lineStyle: {
                normal: {
                    color: color[i % color.length],
                    width: 1,
                    opacity: 0.6,
                    curveness: curvenesses[item[2]]
                }
            },
            data: [{
                name: item[0] + ' → ' + item[1] + ' | ' + dists[i] + ' 公里' +
                    ' | ' + need_hours[i] + ' 小时',
                fromName: item[0],
                toName: item[1],
                coords: [
                    geoCoordMap[item[0]],
                    geoCoordMap[item[1]]
                ]
            }]
        });
    });

    series.push({
        name: '目的地',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        zlevel: 2,
        rippleEffect: {
            brushType: 'stroke'
        },
        label: {
            normal: {
                show: true,
                position: 'right',
                formatter: '{b}'
            }
        },
        symbolSize: 10,
        itemStyle: {
            normal: {
                color: '#a6c84c'
            }
        },
        data: city_list.map(
            function (city) {
                return {
                    name: city,
                    value: geoCoordMap[city]
                }
            })
    });

    option = {
        backgroundColor: '#404a59',
        title : {
            text: '路线规划',
            subtext: '纯属虚构',
            left: 'center',
            textStyle : {
                color: '#fff'
            }
        },
        tooltip : {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            top: 'bottom',
            left: 'right',
            data:['roadmap'],
            textStyle: {
                color: '#fff'
            },
            selectedMode: 'single'
        },
        geo: {
            map: use_map,
            label: {
                emphasis: {
                    show: false
                }
            },
            center: center,
            zoom: zoom,
            roam: true,
            itemStyle: {
                normal: {
                    areaColor: '#323c48',
                    borderColor: '#404a59'
                },
                emphasis: {
                    areaColor: '#2a333d'
                }
            }
        },
        series: series
    };

    return option;
}
