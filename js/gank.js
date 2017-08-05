/**
 * Created by hdy on 2017/8/4.
 */
var laypage = null
var layer = null;
layui.use(['layer', 'laypage', 'element', 'flow'], function () {
    layer = layui.layer;
    var element = layui.element();
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
                console.error("search_open" + search_open)
                if (search_open) {
                    changeSearchPage(obj.curr);
                } else {
                    pageChange(obj.curr)
                }
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
            search_open = false;
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
                    if (index == 0) {
                    } else {
                        $("#LAY_demo3").append("<img class='img-responsive center-block' lay-src='" + content.url + "?imageView2/0/w/300 '> ");
                    }
                } else {
                    $("#list_context").append("<a href='javascript:void(0);' onclick='loadInfoWebSite(\"" + content.url + "\")'>" + "<li class='list-group-item'>" + "<span class='badge'>" + content.who + "</span>" + "[" + (index + 1) + "]&nbsp;&nbsp;" + content.desc + "</li>" + "</a>");

                }
            });
            if (page_type == '福利') {
                layui.use('flow', function () {
                    //按屏加载图片
                    var flow = layui.flow;
                    flow.lazyimg({
                        elem: '#LAY_demo3 img'
                    });
                });
            }
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
                            if (search_open) {
                                changeSearchPage(obj.curr);
                            } else {
                                pageChange(obj.curr)
                            }
                        }
                    }
                });
            }
        },
        error: function (xhr, textStatus) {
            console.log('错误')
            layer.alert("加载失败,请重试")
        }
    })
    closeAnimation();
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

//存放查询数据
var searchType = null;
//查询内容
var searchValue = null;
//存放查询的数组
var search_list = null;
//判断是否是搜索翻页
var search_open = false;
function search(page,scrollTop) {
    if (searchType == null) {
        searchType = 'all';
    }
    searchValue = $("#search_input").val();
    var web = 'http://gank.io/api/search/query/' + searchValue + '/category/' + searchType + '/count/10/page/' + page;
    console.log(web);
    loadAnimation();
    $.ajax({
        url: web,
        type: 'GET', //GET
        async: true,    //或false,是否异步
        timeout: 5000,    //超时时间
        dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
        success: function (data) {
            search_open = true;
            // console.log(data);
            $("#list_context").html("");
            $("#LAY_demo3").html("");
            search_list = data.results;
            $.each(data.results, function (index, content) {
                $("#list_context").append("<a href='javascript:void(0);' onclick='openSearchWebsite(" + index + ")'><li class='list-group-item'>" + "<span class='badge'>" + content.who + "</span>" + "[" + (index + 1) + "]&nbsp;&nbsp;" + content.desc + "</li>" + "</a>");
            });
            if(scrollTop){
                $('html, body').animate({
                    scrollTop: $("#list_context").offset().top
                }, 500);
            }else{
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
                            if (search_open) {
                                changeSearchPage(obj.curr);
                            } else {
                                pageChange(obj.curr)
                            }
                        }
                    }
                });
            }
        },
        error: function (xhr, textStatus) {
            console.log('错误')
            layer.alert("加载失败,请重试")
        }
    })
    closeAnimation();
}


function setSearchType(type) {
    searchText = type;
}

function openSearchWebsite(src) {
    console.error("openSearchWebsite")
    layer.open({
        type: 1,
        skin: 'layui-layer-rim', //加上边框
        area: [document.body.clientWidth - 40 + "px", '600px'], //宽高
        content: "<div class='container'>" + search_list[src].readability + "</div>"
    });
}

function changeSearchPage(page) {
    // var web = 'http://gank.io/api/search/query/' + searchValue + '/category/' + searchType + '/count/20/page/' + page;
    search(page,true)
}