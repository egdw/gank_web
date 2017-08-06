/**
 * Created by hdy on 2017/8/6.
 */
var laypage = null
var layer = null;
layui.use(['layer', 'laypage', 'element', 'flow'], function () {
    layer = layui.layer;
    var element = layui.element();
    laypage = layui.laypage;
});


//记录获取数量
var iteartorIndex = 0;
//判断是否遍历失败
var isFail = false;
function getPublishData() {
    var url = "http://gank.io/api/day/history";
    $.ajax({
        url: url,
        type: 'GET', //GET
        async: true,    //或false,是否异步
        timeout: 5000,    //超时时间
        dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
        success: function (data) {
            iteartorIndex = 0;
            isFail = false;
            var results = data.results;
            $.each(results, function (index, content) {
                var request = content.replace(/-/g, '\/');
                setTimeout(function () {
                    addInfo(request)
                }, (index + 1) * 10);

            })
            if (isFail) {
                layer.alert("加载失败,请重试")
            }
        },
        error: function (xhr, textStatus) {
            console.log('错误')
            layer.alert("加载失败,请重试")
        }
    })
}

var myArray = new Array();
function addInfo(request) {
    var url = "http://gank.io/api/history/content/day/" + request;
    $.ajax({
        url: url,
        type: 'GET', //GET
        async: true,    //或false,是否异步
        timeout: 5000,    //超时时间
        dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
        success: function (data) {
            $.each(data.results, function (index, content) {
                iteartorIndex = iteartorIndex + 1;
                myArray[iteartorIndex] = content;
                $("#list_context").append("<a href='javascript:void(0);' onclick='openSearchWebsite(" + iteartorIndex + ")'>" + "<li class='list-group-item'>" + "<span class='badge'>" + request + "</span>" + "[" + iteartorIndex + "]&nbsp;&nbsp;" + content.title + "</li>" + "</a>");
                // $("#list_context").append("<a href='javascript:void(0);' onclick='openWebsite(" + "layer.open({type: 1,skin: 'layui-layer-rim',area: [document.body.clientWidth - 40 + 'px', '600px'],content:'<div class='container'>'" + content.content + "</div>" + ")'>" + "<li class='list-group-item'>" + "<span class='badge'>" + request + "</span>" + "[" + iteartorIndex + "]&nbsp;&nbsp;" + content.title + "</li>" + "</a>");
            })
        },
        error: function (xhr, textStatus) {
            isFail = true;
        }
    })
}

function openSearchWebsite(src) {
    console.error("openSearchWebsite")
    layer.open({
        type: 1,
        skin: 'layui-layer-rim', //加上边框
        area: [document.body.clientWidth - 40 + "px", '600px'], //宽高
        content: "<div class='container'>" + myArray[src].content + "</div>"
    });
}