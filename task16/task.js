/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
	var name = document.querySelector('#aqi-city-input').value.trim();
	var value = document.querySelector('#aqi-value-input').value.trim();
	if(/^[\u4e00-\u9fa5]|^[a-zA-Z]/.test(name) && Number(value)) {
		aqiData[name] = value;
	} else {
		alert('请输入正确的格式')
	}
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
	var table = document.querySelector('#aqi-table');
	table.innerHTML = '';
	for(var i in aqiData) {
		var tr = document.createElement('tr');
		tr.innerHTML = '<td>' + i + '</td><td>' + aqiData[i] + '</td><td><button>删除</button></td>'
		table.appendChild(tr);
	}
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
  addAqiData();
  renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(node) {
  // do sth.
  var parent = node.parentNode.parentNode;
  var item = parent.querySelector('td').innerText;

  delete aqiData[item]

  renderAqiList();
}

function init() {

  // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
  var addBtn = document.querySelector('#add-btn');
  addBtn.addEventListener('click', addBtnHandle)
  // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
  var table = document.querySelector('#aqi-table');
  table.addEventListener('click', function(e) {
  	if(e.target.nodeName === 'BUTTON') {
  		delBtnHandle(e.target)
  	}
  })

}

init();
