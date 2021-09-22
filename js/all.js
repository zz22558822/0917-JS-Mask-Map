// 資料存放至 data
var data;
// 細分區域後的資料 存在 citieData
var citieData = [];


// 獲取資料
function getData() {
    //開啟讀取動畫
    openLoading();
    var xhr = new XMLHttpRequest();
    xhr.open('GET','https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json',true);
    
    xhr.send(null);
    
    xhr.onload = function(){
        data = JSON.parse(xhr.responseText);
        data = data.features;
        

        // 縣市列表
        upcity();

        // 預設是取得資料後選染出 全部區域
        renderList('全部區域');

        //關閉讀取動畫
        closeLoading();
    }
}

// 全域變數來存放日期格式
var timeDetails = {};
function getDay() {
    //先創建一個Date實體
    var time = new Date();
    //獲取當前時間(取得的值為一個毫秒数值)
    var theTime = time.getTime();

    timeDetails = {
        year: time.getFullYear(),
        month: time.getMonth() + 1,
        date: time.getDate(),
        hour: time.getHours(),
        minute: time.getMinutes(),
        second: time.getSeconds(),
        day: time.getDay(),
    };
    return time.toLocaleDateString();
}

// 判斷日期單雙購買限制
function ifDay(day) {
    var oddeven = document.querySelector('.limit span')
    var odd = '1,3,5,7,9';
    var even = '2,4,6,8,0';
    var all = '不限制';
    if (day == 1){
        oddeven.textContent = odd;
        return '一'
    }else if (day == 2){
        oddeven.textContent = even;
        return '二'
    }else if (day == 3){
        oddeven.textContent = odd;
        return '三'
    }else if (day == 4){
        oddeven.textContent = even;
        return '四'
    }else if (day == 5){
        oddeven.textContent = odd;
        return '五'
    }else if (day == 6){
        oddeven.textContent = even;
        return '六'
    }else{
        oddeven.textContent = all;
        return '日'
    }
}



// 篩選城市 並渲染
function renderList(city){
    // 空字串放置累加資料
    var str = '';
    // 篩選後的區域資料 方便用來進一步列表渲染區域
    citieData = [];
    // 從全部資料 判斷 在累加城市資料到 citieData 累加渲染資料到str
    for (var i = 0; i < data.length; i++) {
        if ('全部區域' == city) {
            // 讓縣市的選項禁止選取
            document.querySelector('.choose-citie').classList.add('disabled')
            str += '<li><h3 class="name">' + data[i].properties.name + '</h3><p class="text address">' + data[i].properties.address + '</p><p class="text tel">' + data[i].properties.phone + '</p><p class="text time">更新時間 :' + data[i].properties.updated + '</p><div class="maskTotal"><p class="aldult-mask">成人口罩<span>' + data[i].properties.mask_adult + '</span></p><p class="child-mask">兒童口罩<span>' + data[i].properties.mask_child + '</span></p></div></li>';
        }else if ( data[i].properties.county == city) {
            // 讓縣市的選項開放選取
            document.querySelector('.choose-citie').classList.remove('disabled')
            // 將區域資料累加到 citieData 當中
            citieData.push(data[i].properties)
            str += '<li><h3 class="name">' + data[i].properties.name + '</h3><p class="text address">' + data[i].properties.address + '</p><p class="text tel">' + data[i].properties.phone + '</p><p class="text time">更新時間 :' + data[i].properties.updated + '</p><div class="maskTotal"><p class="aldult-mask">成人口罩<span>' + data[i].properties.mask_adult + '</span></p><p class="child-mask">兒童口罩<span>' + data[i].properties.mask_child + '</span></p></div></li>';
        }
    }
    document.querySelector('.list').innerHTML = str;

    //篩選縣市 列表
    upcitie();

    //關閉讀取動畫
    closeLoading();
}



// 篩選縣市 並渲染
function renderListCitie(citie){
    var str = '';
    for (var i = 0; i < citieData.length; i++) {
        if ('全部區域' == citie) {
            str += '<li><h3 class="name">' + citieData[i].name + '</h3><p class="text address">' + citieData[i].address + '</p><p class="text tel">' + citieData[i].phone + '</p><p class="text time">更新時間 :' + citieData[i].updated + '</p><div class="maskTotal"><p class="aldult-mask">成人口罩<span>' + citieData[i].mask_adult + '</span></p><p class="child-mask">兒童口罩<span>' + citieData[i].mask_child + '</span></p></div></li>';
        }else if ( citieData[i].town == citie) {
            str += '<li><h3 class="name">' + citieData[i].name + '</h3><p class="text address">' + citieData[i].address + '</p><p class="text tel">' + citieData[i].phone + '</p><p class="text time">更新時間 :' + citieData[i].updated + '</p><div class="maskTotal"><p class="aldult-mask">成人口罩<span>' + citieData[i].mask_adult + '</span></p><p class="child-mask">兒童口罩<span>' + citieData[i].mask_child + '</span></p></div></li>';
        }
    }
    document.querySelector('.list').innerHTML = str;
    //關閉讀取動畫
    closeLoading();
}


// 宣告全域 selectCity 讓兩個 function 使用 並且可以進行排錯 不然使用區域變數會比較好
var selectCity = '<option value="全部區域">全部區域</option>';

// 篩選城市 列表
function upcity() {

    selectCity = '<option value="全部區域">全部區域</option>';

    // 先準備空陣列，它是篩選後的資料庫
    var allZone = [];

    // 這使用indexOf的特性 如果沒重複資料 就會判定為-1 利用這個來讓allZone 增加陣列
    for (var i = 0; i < data.length; i++) {
        if (allZone.indexOf(data[i].properties.county) === -1 && data[i].properties.county !== '') {
            allZone.push(data[i].properties.county);
        }
    }
    for (var i = 0; i < allZone.length ; i++) {
        selectCity += '<option value="' + allZone[i] + '">' + allZone[i] + '</option>';
    }
    document.querySelector('.choose').innerHTML = selectCity
    //選到的城市 選染LI 縣市
    upcitie();
}

// 篩選縣市 列表
function upcitie() {

    selectCity = '<option value="全部區域">全部區域</option>';

    // 先準備空陣列，它是篩選後的資料庫
    var allZone = [];

    // 這使用indexOf的特性 如果沒重複資料 就會判定為-1 利用這個來讓allZone 增加陣列
    for (var i = 0; i < citieData.length; i++) {
        if (allZone.indexOf(citieData[i].town) === -1 && citieData[i].town !== '') {
            allZone.push(citieData[i].town);
        }
    }
    for (var i = 0; i < allZone.length ; i++) {
        selectCity += '<option value="' + allZone[i] + '">' + allZone[i] + '</option>';
    }
    document.querySelector('.choose-citie').innerHTML = selectCity

}








// 開啟讀取動畫
function openLoading() {
    document.querySelector('.loading').classList.remove('disNone');
    //console.log('開始載入');
}
// 關閉讀取動畫
function closeLoading() {
    document.querySelector('.loading').classList.add('disNone');
    //console.log('關閉載入');
}





// 篩選城市 切換監聽
document.querySelector('.choose').addEventListener('change',function (e) {
    //開啟讀取動畫
    openLoading();
    //篩選城市 並渲染點擊的城市
    renderList(e.target.value);
    
})
// 篩選縣市 切換監聽
document.querySelector('.choose-citie').addEventListener('change',function (e) {
    //開啟讀取動畫
    openLoading();
    //篩選縣市 並渲染點擊的縣市
    renderListCitie(e.target.value);
})




// 初始化
function init() {
    //獲取資料
    getData();
    // 當前日期
    document.querySelector('.day').textContent = getDay();
    // 購買限制更新資訊
    document.querySelector('.week span').textContent = ifDay(timeDetails.day)

}

init();









