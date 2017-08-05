/**
 * Created by hdy on 2017/8/4.
 */
var laypage = null
layui.use(['layer', 'laypage', 'element', 'flow'], function () {
    var layer = layui.layer, element = layui.element();
    laypage = layui.laypage;

    laypage({
        cont: 'pageColl'
        , pages: 200
        , group: 3
        , curr: location.hash.replace('#!fenye=', '') //获取hash值为fenye的当前页
        , hash: 'fenye' //自定义hash值
        , jump: function (obj, first) {
            if (!first) {
                // layer.msg('第 '+ obj.curr +' 页');
                pageChange(obj.curr)
            }
        }
    });
});
var pageType = null;
function pageChange(page) {
    getData(page, pageType, true);
}

function getData(page, page_type, scrollTop) {
    pageType = page_type;
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
            // console.log(data);
            $("#list_context").html("");
            $("#LAY_demo3").html("");
            $.each(data.results, function (index, content) {
                // console.log(content.url.indexOf('github.com'))
                //判断是否为github的网站:
                if (content.url.indexOf('github.com') != -1 || content.url.indexOf('jianshu.com') != -1 || content.url.indexOf('zhihu') != -1) {
                    //说明是
                    $("#list_context").append("<a href='" + content.url + "' target='_blank'>" + "<li class='list-group-item'>" + "<span class='badge'>" + content.who + "</span>" + "[" + (index + 1) + "]&nbsp;&nbsp;" + content.desc + "</li>" + "</a>");
                } else if (page_type == '福利') {
                    if(index == 0){
                    }else{
                        $("#LAY_demo3").append("<img class='img-responsive center-block' lay-src='" + content.url + "?imageView2/0/w/300 '> ");
                    }
                } else {
                    $("#list_context").append("<a href='javascript:void(0);' onclick='loadInfoWebSite(\"" + content.url + "\")'>" + "<li class='list-group-item'>" + "<span class='badge'>" + content.who + "</span>" + "[" + (index + 1) + "]&nbsp;&nbsp;" + content.desc + "</li>" + "</a>");

                }
            });
            if (page_type == '福利') {
                layui.use('flow', function(){
                    //按屏加载图片
                    var flow = layui.flow;
                    flow.lazyimg({
                        elem: '#LAY_demo3 img'
                    });
                });
            }
            closeAnimation();
            if (scrollTop == true) {
                $('html, body').animate({
                    scrollTop: $("#main_body").offset().top
                }, 500);
            } else {
                window.location.hash = '#!fenye=1';
                laypage({
                    cont: 'pageColl'
                    , pages: 200
                    , group: 3
                    , curr: location.hash.replace('#!fenye=', '') //获取hash值为fenye的当前页
                    , hash: 'fenye' //自定义hash值
                    , jump: function (obj, first) {
                        if (!first) {
                            // layer.msg('第 '+ obj.curr +' 页');
                            pageChange(obj.curr)
                        }
                    }
                });
            }
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