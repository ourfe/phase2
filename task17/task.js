/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: -1,
  nowGraTime: "day"
}

/**
 * 渲染图表
 */
function renderChart() {
  var wrap = document.querySelector('.aqi-chart-wrap')
  wrap.innerHTML = ''
  for(var i in chartData) {
    var div = document.createElement('div')
    switch(pageState.nowGraTime) {
      case 'day':
        div.style.height = ( chartData[i] / 2 ) + 'px'
        break
      case 'week':
        div.style.height = ( chartData[i] / 7 ) + 'px'
        div.style.width = (26/91*100) + '%'
      case 'month':
        div.style.height = ( chartData[i] / 14 ) + 'px'
        div.style.width = (6/91*100) + '%'
        break
    }
    div.style.background = randomColor()
    div.setAttribute('title', i + ' ' + chartData[i])
    wrap.appendChild(div)
  }

}

function randomColor() {
  var arr = ['1','2','3','4','5','6','7','8','9','a','b','c','d','e','f']
  var color = '#';
  for(var i = 0; i < 6; i++) {
    color += arr[Math.floor((Math.random() * 16))]
  }
  return color
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange(e) {
  if(e) {
    time = e.target.value
    if(time === pageState.nowGraTime) return
  } else {
    e = pageState.nowGraTime
  }
  // 确定是否选项发生了变化
  // 设置对应数据
  pageState.nowGraTime = time
  // 调用图表渲染函数
  switch (pageState.nowGraTime) {
    case 'day':
      chartData = aqiSourceData[pageState.nowSelectCity];
      break;
    case 'week':
      isWeek()
      break;
    case 'month':
      isMonth()
      break;
  }
  renderChart()
}

function isMonth() {
  chartData = aqiSourceData[pageState.nowSelectCity];
  var count1 = count2 = count3 = 0;
  for(var i in chartData) {
    if(i.indexOf('2016-01') > -1) {
      count1 += chartData[i]
    } else if(i.indexOf('2016-02') > -1) {
      count2 += chartData[i]
    } else {
      count3 += chartData[i]
    }
  }
  chartData = {
    '一月': count1,
    '二月': count2,
    '三月': count3
  }
}

function isWeek() {
  chartData = aqiSourceData[pageState.nowSelectCity];
  var count = 1
  var num = 0
  var temp = {}
  for(var i in chartData) {
    var index = Math.ceil(count / 7)
    num += chartData[i]
    if(count % 7 === 0) {
      temp[index] = num
      num = 0
    }
    count += 1;
  }
  chartData = temp
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange(e) {
  var city = e.target.value
  // 确定是否选项发生了变化
  if(city === pageState.nowSelectCity) return;
  pageState.nowSelectCity = city
  // 设置对应数据
  chartData = aqiSourceData[city];
  graTimeChange()
  // 调用图表渲染函数
  renderChart()
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  var inputs = document.querySelectorAll('input');
  for(var i = 0; i < inputs.length; i++) {
    inputs[i].onclick = graTimeChange
  }
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var select = document.querySelector('#city-select')
  select.innerHTML = ''
  for(var i in aqiSourceData) {
    var option = document.createElement('option')
    option.setAttribute('value', i)
    option.innerHTML = i
    select.appendChild(option)
  }
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  var options = select.querySelectorAll('option')
  select.onchange = citySelectChange
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
  chartData = aqiSourceData['北京'];
  pageState.nowSelectCity = '北京'
  renderChart()
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm()
  initCitySelector();
  initAqiChartData();
}

init();