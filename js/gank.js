/**
 * Created by hdy on 2017/8/4.
 */
layui.use(['layer', 'laypage', 'element'], function () {
    var layer = layui.layer
        , laypage = layui.laypage
        , element = layui.element();
    //向世界问个好
});


function getData(page, page_type) {
    var web = "http://gank.io/api/data/" + page_type + "/100/" + page;
    console.log(web);
    loadAnimation();
    $.ajax({
        url: web,
        type: 'GET', //GET
        async: true,    //或false,是否异步
        timeout: 5000,    //超时时间
        dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
        success: function (data) {
            console.log(data);
            $("#list_context").html("");
            $.each(data.results, function (index, content) {
                console.log(content.url.indexOf('github.com'))
                //判断是否为github的网站:
                if (content.url.indexOf('github.com') != -1 || content.url.indexOf('jianshu.com')!=-1|| content.url.indexOf('zhihu')!=-1) {
                    //说明是
                    $("#list_context").append("<a href='" + content.url + "' target='_blank'>" + "<li class='list-group-item'>" + "<span class='badge'>" + content.who + "</span>" + "[" + (index + 1) + "]&nbsp;&nbsp;" + content.desc + "</li>" + "</a>");
                } else {
                    $("#list_context").append("<a href='javascript:void(0);' onclick='loadInfoWebSite(\"" + content.url + "\")'>" + "<li class='list-group-item'>" + "<span class='badge'>" + content.who + "</span>" + "[" + (index + 1) + "]&nbsp;&nbsp;" + content.desc + "</li>" + "</a>");

                }
            });
            closeAnimation();
        },
        error: function (xhr, textStatus) {
            console.log('错误')
        }
    })
}

var index = null;
function loadAnimation() {
    index = layer.load(1, {
        shade: [0.1, '#fff'] //0.1透明度的白色背景
    });
}

function closeAnimation() {
    layer.close(index);
}


function loadInfoWebSite(src) {
    layui.use('layer', function () {
        var layer = layui.layer;
        var open = layer.open({
            type: 2,
            title: 'frame',
            shadeClose: true,
            shade: true,
            maxmin: true, //开启最大化最小化按钮
            area: [document.body.clientWidth - 40 + "px", '500px'],
            content: src,
        });
    });
}