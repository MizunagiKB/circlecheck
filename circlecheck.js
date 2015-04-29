/*!
 */
var GLOBAL = {
    CIRCLE_DATA: null,
    EVENT_NAME: "",
    FAV: [],
    TPL_LST_LIST: [],
    TPL_FAV_LIST: [],
    TPL_FND_LIST: [],
    KEYWORD_DELAY: 15,
    CURRENT_KEYWORD: "",
    CURRENT_KEYWORD_DELAY: 0,
    m_oCTplHead: null,
    m_oCTplDesc: null
};
/*!
 */
function get_url_param() {
    var listResult = [];
    var listParam = window.location.href.slice(window.location.href.indexOf("?") + 1).split("&");
    for (var n = 0; n < listParam.length; n++) {
        var listData = listParam[n].split("=");
        listResult.push(listData[0]);
        listResult[listData[0]] = listData[1];
    }
    return (listResult);
}
/*!
 */
function sort_layout(objA, objB) {
    if (objA.sortkey > objB.sortkey)
        return (1);
    if (objA.sortkey < objB.sortkey)
        return (-1);
    return (0);
}
/*!
 *  @brief データチェック用の関数を定義（ここでしか使用しないため、関数内で定義）
 */
function is_valid_param(param) {
    var bResult = false;
    if (param) {
        if (param != "#") {
            bResult = true;
        }
    }
    return (bResult);
}
/*!
 */
function fav_search_idx(oCItem) {
    for (var n = 0; n < GLOBAL.FAV.length; n++) {
        if (oCItem.layout == GLOBAL.FAV[n].layout) {
            return (n);
        }
    }
    return (-1);
}
/*!
 */
function update_row_class(strId, strClass) {
    var oCRow = document.getElementById(strId);
    if (oCRow != null) {
        oCRow.className = strClass;
    }
    return (oCRow);
}
/*!
 */
function fav_append(nGroup, nIndex) {
    var oCItem = GLOBAL.CIRCLE_DATA.CIRCLE_LIST_DAT[nGroup][nIndex];
    var nIdx = fav_search_idx(oCItem);
    if (nIdx == -1) {
        GLOBAL.FAV.push(oCItem);
        GLOBAL.FAV.sort(sort_layout);
        if (update_row_class("id_row_fnd_" + nGroup + "_" + nIndex, "info") != null) {
            $("#id_btn_fnd_fav_add_" + nGroup + "_" + nIndex).addClass("disabled");
        }
        if (update_row_class("id_row_lst_" + nGroup + "_" + nIndex, "info") != null) {
            $("#id_btn_lst_fav_add_" + nGroup + "_" + nIndex).addClass("disabled");
        }
        storage_save();
        render_head();
        render_fav();
    }
}
/*!
 */
function fav_remove(nGroup, nIndex) {
    var oCItem = GLOBAL.CIRCLE_DATA.CIRCLE_LIST_DAT[nGroup][nIndex];
    var nIdx = fav_search_idx(oCItem);
    if (nIdx != -1) {
        var oCRow = document.getElementById("id_row_fav_" + nGroup + "_" + nIndex);
        oCRow.parentNode.removeChild(oCRow);
        if (update_row_class("id_row_fnd_" + nGroup + "_" + nIndex, "") != null) {
            $("#id_btn_fnd_fav_add_" + nGroup + "_" + nIndex).removeClass("disabled");
        }
        if (update_row_class("id_row_lst_" + nGroup + "_" + nIndex, "") != null) {
            $("#id_btn_lst_fav_add_" + nGroup + "_" + nIndex).removeClass("disabled");
        }
        GLOBAL.FAV.splice(nIdx, 1);
        storage_save();
        render_head();
    }
}
/*!
 */
function show_view(strId) {
    $("#id_menu_lst").removeClass("active");
    $("#id_menu_fnd").removeClass("active");
    $("#id_menu_fav").removeClass("active");
    $("#id_menu_cfg").removeClass("active");
    $("#id_view_lst").hide();
    $("#id_view_fnd").hide();
    $("#id_view_fav").hide();
    $("#id_view_cfg").hide();
    switch (strId) {
        case "lst":
        case "fnd":
        case "fav":
        case "cfg":
            $("#id_menu_" + strId).addClass("active");
            $("#id_view_" + strId).show();
            break;
        default:
            break;
    }
}
/*!
 */
function import_from_url(strUrl) {
    $.getJSON(strUrl, function (oCJson) {
        GLOBAL.FAV = [];
        GLOBAL.CIRCLE_DATA = oCJson;
        init_appview(GLOBAL.CIRCLE_DATA.CIRCLE_LIST_TBL);
        init_appdata(GLOBAL.CIRCLE_DATA.CIRCLE_LIST_TBL, GLOBAL.CIRCLE_DATA.CIRCLE_LIST_DAT);
        $("#id_title").text(GLOBAL.EVENT_NAME);
        $("#id_browser_type").attr("href", "./index.m.html" + "?src_url=" + strUrl);
        $("#id_tpl_head").html(GLOBAL.m_oCTplHead.render(GLOBAL.CIRCLE_DATA));
        var strHref_base = window.location.href.split("?")[0];
        if (is_valid_param(GLOBAL.CIRCLE_DATA.DATA_SOURCE_PREV) == true) {
            $("#id_menu_prev").click(function (oCEvt) { window.location.href = strHref_base + "?src_url=" + GLOBAL.CIRCLE_DATA.DATA_SOURCE_PREV; });
        }
        else {
            $("#id_menu_prev").click(function (oCEvt) { $("#id_tpl_empty").modal("show"); });
        }
        if (is_valid_param(GLOBAL.CIRCLE_DATA.DATA_SOURCE_NEXT) == true) {
            $("#id_menu_next").click(function (oCEvt) { window.location.href = strHref_base + "?src_url=" + GLOBAL.CIRCLE_DATA.DATA_SOURCE_NEXT; });
        }
        else {
            $("#id_menu_next").click(function (oCEvt) { $("#id_tpl_empty").modal("show"); });
        }
        $("#id_menu_lst").click(function (oCEvt) { show_view("lst"); });
        $("#id_menu_fnd").click(function (oCEvt) { show_view("fnd"); });
        $("#id_menu_fav").click(function (oCEvt) { show_view("fav"); });
        $("#id_menu_cfg").click(function (oCEvt) { show_view("cfg"); });
        resume();
        show_view("lst");
        render_info();
        render_fav();
        $("#src_url").val(strUrl);
        setInterval(evt_keyword_timer, 100);
    });
}
/*!
 */
function search_keyword(strKeyword, oCItem) {
    var bFound = false;
    var listCItem;
    if (oCItem.circle_list) {
        listCItem = oCItem.circle_list;
    }
    else {
        listCItem = [oCItem];
    }
    for (var i = 0; i < listCItem.length; i++) {
        var oCItem = listCItem[i];
        if (oCItem.circle) {
            if (oCItem.circle.indexOf(strKeyword, 0) != -1)
                bFound = true;
        }
        if (oCItem.writer) {
            if (oCItem.writer.indexOf(strKeyword, 0) != -1)
                bFound = true;
        }
    }
    return (bFound);
}
/*!
 */
function evt_keyword_timer() {
    if (GLOBAL.CURRENT_KEYWORD_DELAY > 0) {
        GLOBAL.CURRENT_KEYWORD_DELAY--;
        var fProgress = (GLOBAL.KEYWORD_DELAY - GLOBAL.CURRENT_KEYWORD_DELAY) * 100;
        fProgress /= GLOBAL.KEYWORD_DELAY;
        $("#id_search_progress").css("width", fProgress + "%");
        if (GLOBAL.CURRENT_KEYWORD_DELAY == 0) {
            var strKeyword = $("#keyword").val();
            var oCTBL = GLOBAL.CIRCLE_DATA.CIRCLE_LIST_TBL;
            var oCDAT = GLOBAL.CIRCLE_DATA.CIRCLE_LIST_DAT;
            var nFoundCount = 0;
            var listFavItem = [];
            var listTable = [];
            listTable.push('<tr><th><span class="glyphicon glyphicon-star"></span></th><th><span class="glyphicon glyphicon-map-marker"></span></th><th>サークル名 / 執筆者</th><th><span class="glyphicon glyphicon-info-sign"></span></th></tr>');
            if (strKeyword) {
                for (var i = 0; i < oCTBL.length; i++) {
                    for (var j = 0; j < oCDAT[i].length; j++) {
                        var oCItem = oCDAT[i][j];
                        if (search_keyword(strKeyword, oCItem) == true) {
                            var rowId = "id_row_fnd_" + oCItem.grp + "_" + oCItem.idx;
                            listTable.push('<tr id="' + rowId + '">');
                            for (var n = 0; n < GLOBAL.TPL_FND_LIST.length; n++) {
                                listTable.push('<td>' + GLOBAL.TPL_FND_LIST[n].render(oCItem) + '</td>');
                            }
                            listTable.push('</tr>');
                            var nIdx = fav_search_idx(oCItem);
                            if (nIdx != -1) {
                                listFavItem.push(oCItem);
                            }
                            nFoundCount += 1;
                        }
                    }
                }
                $("#id_tbl_fnd_0").html(listTable.join(''));
                for (var i = 0; i < listFavItem.length; i++) {
                    var oCItem = listFavItem[i];
                    var rowId = "id_row_fnd_" + oCItem.grp + "_" + oCItem.idx;
                    if (update_row_class(rowId, "info") != null) {
                        $("#id_btn_fnd_fav_add_" + oCItem.grp + "_" + oCItem.idx).addClass("disabled");
                    }
                }
            }
            if (nFoundCount > 0) {
                $("#id_search_result").html('<p class="text-center">' + nFoundCount + ' 件 見つかりました。</p>');
            }
            else {
                $("#id_search_result").html('<p class="text-center">見つかりませんでした。</p>');
            }
        }
    }
}
/*!
 */
function evt_keyword(oCEvt) {
    if (oCEvt.keyCode == 0x0D) {
        GLOBAL.CURRENT_KEYWORD_DELAY = GLOBAL.KEYWORD_DELAY;
        $("#id_search_progress").css("width", "0%");
    }
}
/*!
 */
function evt_btn_search() {
    GLOBAL.CURRENT_KEYWORD_DELAY = GLOBAL.KEYWORD_DELAY;
    $("#id_search_progress").css("width", "0%");
}
/*!
 */
function evt_btn_fav_add(nGroup, nIndex) {
    fav_append(nGroup, nIndex);
}
/*!
 */
function evt_btn_fav_del(nGroup, nIndex) {
    fav_remove(nGroup, nIndex);
}
/*!
 */
function evt_btn_desc(nGroup, nIndex) {
    var oCItem = GLOBAL.CIRCLE_DATA.CIRCLE_LIST_DAT[nGroup][nIndex];
    var oCTpl = Hogan.compile(''
        + '<table class="table table-striped table-condensed">'
        + '<tr>'
        + '<th>サークル名</th><th>執筆者</th>'
        + '</tr>'
        + '{{#circle_list}}'
        + '<tr>'
        + '<td>'
        + '<div>'
        + '<span class="glyphicon glyphicon-{{#icon}}{{icon}}{{/icon}}{{^icon}}home{{/icon}}"></span>&nbsp;{{circle}}'
        + '<br />'
        + '{{#url}}<a href="{{url}}" target="_blank">{{/url}}{{url}}{{#url}}</a>{{/url}}'
        + '</div>'
        + '</td>'
        + '<td><span class="glyphicon glyphicon-pencil"></span>&nbsp;{{writer}}</td>'
        + '</tr>'
        + '{{/circle_list}}'
        + '{{^circle_list}}'
        + '<tr>'
        + '<td>'
        + '<div>'
        + '<span class="glyphicon glyphicon-{{#icon}}{{icon}}{{/icon}}{{^icon}}home{{/icon}}"></span>&nbsp;{{circle}}'
        + '<br />'
        + '{{#url}}<a href="{{url}}" target="_blank">{{/url}}{{url}}{{#url}}</a>{{/url}}'
        + '</div>'
        + '</td>'
        + '<td><span class="glyphicon glyphicon-pencil"></span>&nbsp;{{writer}}</td>'
        + '</tr>'
        + '{{/circle_list}}'
        + '</table>');
    $("#id_tpl_desc").html(GLOBAL.m_oCTplDesc.render({
        "layout": oCItem.layout,
        "circle_table_item": oCTpl.render(oCItem)
    }));
    $("#id_tpl_desc").modal("show");
}
/*!
 */
function evt_btn_mark(nGroup, nIndex) {
    var oCItem = GLOBAL.CIRCLE_DATA.CIRCLE_LIST_DAT[nGroup][nIndex];
    var oCRow = document.getElementById("id_row_fav_" + nGroup + "_" + nIndex);
    if (oCRow.className != "") {
        oCRow.className = "";
    }
    else {
        oCRow.className = "success";
    }
}
/*!
 */
function evt_btn_import_url() {
    import_from_url($("#src_url").val());
}
/*!
 */
function render_head() {
    $("#id_head_fav_count").text(GLOBAL.FAV.length);
}
/*!
 */
function check_event_schedule() {
    var aryResult = [];
    if (is_valid_param(GLOBAL.CIRCLE_DATA.EVENT_ST) != true)
        return (aryResult);
    if (is_valid_param(GLOBAL.CIRCLE_DATA.EVENT_EN) != true)
        return (aryResult);
    var oCDate = new Date();
    var oCDateSt = new Date(GLOBAL.CIRCLE_DATA.EVENT_ST);
    var oCDateEn = new Date(GLOBAL.CIRCLE_DATA.EVENT_EN);
    var strDateTimeSt = oCDateSt.getFullYear() + "年" + (oCDateSt.getMonth() + 1) + "月" + oCDateSt.getDate() + "日&nbsp;" + ("0" + oCDateSt.getHours()).slice(-2) + ":" + ("0" + oCDateSt.getMinutes()).slice(-2);
    var strDateTimeEn = oCDateEn.getFullYear() + "年" + (oCDateEn.getMonth() + 1) + "月" + oCDateEn.getDate() + "日&nbsp;" + ("0" + oCDateEn.getHours()).slice(-2) + ":" + ("0" + oCDateEn.getMinutes()).slice(-2);
    if (oCDate.getTime() < oCDateSt.getTime()) {
        aryResult.push({
            "alert": "info", "icon": "info-sign",
            "text": "開催予定日&nbsp;[&nbsp;" + strDateTimeSt + "&nbsp;]"
        });
    }
    else if (oCDate.getTime() < oCDateEn.getTime()) {
        aryResult.push({ "alert": "info", "icon": "info-sign", "text": "本日開催&nbsp;[&nbsp;" + strDateTimeSt + "&nbsp;-&nbsp;" + strDateTimeEn + "&nbsp;]" });
    }
    else {
        aryResult.push({ "alert": "danger", "icon": "exclamation-sign", "text": "このイベントは終了しました" });
    }
    return (aryResult);
}
/*!
*/
function render_info() {
    var strInfo = '';
    var oCTpl = Hogan.compile(''
        + '<div class="alert alert-{{#alert}}{{alert}}{{/alert}}{{^alert}}info{{/alert}} alert-dismissable">'
        + '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'
        + '<strong><span class="glyphicon glyphicon-{{#icon}}{{icon}}{{/icon}}{{^icon}}info-sign{{/icon}}"></span></strong>&nbsp;{{{text}}}'
        + '</div>');
    var oCItem = check_event_schedule();
    for (var n = 0; n < oCItem.length; n++) {
        strInfo += oCTpl.render(oCItem[n]);
    }
    var oCItem = GLOBAL.CIRCLE_DATA.INFORMATION;
    for (var n = 0; n < oCItem.length; n++) {
        strInfo += oCTpl.render(oCItem[n]);
    }
    $("#id_notify_area_1").html(strInfo);
}
/*!
 */
function render_fav() {
    var listTable = [];
    listTable.push('<tr><th><span class="glyphicon glyphicon-remove"></span></th><th><span class="glyphicon glyphicon-map-marker"></span></th><th>サークル名 / 執筆者</th><th><span class="glyphicon glyphicon-info-sign"></span></th></tr>');
    for (var i = 0; i < GLOBAL.FAV.length; i++) {
        var oCItem = GLOBAL.FAV[i];
        listTable.push('<tr id="id_row_fav_' + oCItem.grp + '_' + oCItem.idx + '">');
        for (var n = 0; n < GLOBAL.TPL_FAV_LIST.length; n++) {
            listTable.push('<td>' + GLOBAL.TPL_FAV_LIST[n].render(oCItem) + '</td>');
        }
        listTable.push('</tr>');
    }
    $("#id_tbl_fav_0").html(listTable.join(''));
}
/*!
 */
function init_appview(oCListTbl) {
    var strUl_T = '';
    var strUl_V = '';
    var oCTpl_T = Hogan.compile('<li><a href="#lst_{{id}}" data-toggle="tab">{{name}}</a></li>');
    var oCTpl_V = Hogan.compile(''
        + '<div class="tab-pane fade" id="lst_{{id}}">'
        + '<table id="id_tbl_lst_{{id}}" class="table table-striped table-condensed">'
        + '</table>'
        + '</div>');
    for (var n = 0; n < oCListTbl.length; n++) {
        strUl_T += oCTpl_T.render(oCListTbl[n]);
        strUl_V += oCTpl_V.render(oCListTbl[n]);
    }
    $("#id_view_lst").html(''
        + '<ul id="id_tab_circle_lst" class="nav nav-tabs">'
        + strUl_T
        + '</ul>'
        + '<div id="id_view_lst_content" class="tab-content">'
        + '<p>'
        + strUl_V
        + '</p>'
        + '</div>');
    $("#id_tab_circle_lst a:first").tab("show");
}
/*!
 */
function init_appdata(oCListTbl, oCListDat) {
    for (var i = 0; i < oCListTbl.length; i++) {
        var listTable = [];
        listTable.push('<tr><th><span class="glyphicon glyphicon-star"></span></th><th><span class="glyphicon glyphicon-map-marker"></span></th><th>サークル名 / 執筆者</th><th><span class="glyphicon glyphicon-info-sign"></span></th></tr>');
        for (var j = 0; j < oCListDat[i].length; j++) {
            var oCItem = oCListDat[i][j];
            oCItem.grp = i;
            oCItem.idx = j;
            listTable.push('<tr id="id_row_lst_' + oCItem.grp + '_' + oCItem.idx + '">');
            for (var k = 0; k < GLOBAL.TPL_LST_LIST.length; k++) {
                listTable.push('<td>' + GLOBAL.TPL_LST_LIST[k].render(oCItem) + '</td>');
            }
            listTable.push('</tr>');
        }
        $("#id_tbl_lst_" + i).html(listTable.join(''));
    }
}
/*!
 */
function storage_load() {
    if (!window.localStorage)
        return;
    var listResult = [];
    var strStorageData = window.localStorage.getItem(GLOBAL.CIRCLE_DATA.DATA_SOURCE) || -1;
    if (strStorageData != -1) {
        listResult = JSON.parse(strStorageData);
    }
    return (listResult);
}
/*!
 */
function storage_save() {
    if (!window.localStorage)
        return;
    window.localStorage.setItem(GLOBAL.CIRCLE_DATA.DATA_SOURCE, JSON.stringify(GLOBAL.FAV));
}
/*!
 */
function resume() {
    if (!window.localStorage) {
        document.getElementById("id_notify_area_1").innerHTML = (''
            + '<div class="alert alert-block">'
            + '<button type="button" class="close" data-dismiss="alert">×</button>'
            + '<h4>ご利用の環境ではローカルストレージが使用出来ないようです。</h4>ローカルストレージが使用出来ない場合、お気に入りを保存する事が出来ません。'
            + '</div>');
    }
    else {
        var listFav = storage_load();
        var listTbl = GLOBAL.CIRCLE_DATA.CIRCLE_LIST_TBL;
        var listDat = GLOBAL.CIRCLE_DATA.CIRCLE_LIST_DAT;
        for (var grp = 0; grp < listTbl.length; grp++) {
            for (var idx = 0; idx < listDat[grp].length; idx++) {
                for (var n = 0; n < listFav.length; n++) {
                    if (listDat[grp][idx].layout == listFav[n].layout) {
                        fav_append(grp, idx);
                    }
                }
            }
        }
    }
}
/*!
 */
function ccheck_main() {
    GLOBAL.m_oCTplHead = Hogan.compile($("#id_tpl_head").html());
    GLOBAL.m_oCTplDesc = Hogan.compile($("#id_tpl_desc").html());
    GLOBAL.TPL_LST_LIST = [
        Hogan.compile('<button id="id_btn_lst_fav_add_{{grp}}_{{idx}}" class="btn btn-primary" onclick="evt_btn_fav_add( {{grp}}, {{idx}} );"><span class="glyphicon glyphicon-star"></span></button>'),
        Hogan.compile('{{layout}}'),
        Hogan.compile(''
            + '{{#circle_list}}'
            + '<div>'
            + '<span class="glyphicon glyphicon-{{#icon}}{{icon}}{{/icon}}{{^icon}}home{{/icon}}"></span>&nbsp;'
            + '{{#url}}<a href="{{url}}" target="_blank">{{/url}}{{circle}}{{#url}}</a>{{/url}}'
            + '{{#writer}}<br />'
            + '<span class="glyphicon glyphicon-pencil"></span>&nbsp;'
            + '<small>{{writer}}</small>{{/writer}}'
            + '</div>'
            + '{{/circle_list}}'
            + '{{^circle_list}}'
            + '<div>'
            + '<span class="glyphicon glyphicon-{{#icon}}{{icon}}{{/icon}}{{^icon}}home{{/icon}}"></span>&nbsp;'
            + '{{#url}}<a href="{{url}}" target="_blank">{{/url}}{{circle}}{{#url}}</a>{{/url}}'
            + '{{#writer}}<br />'
            + '<span class="glyphicon glyphicon-pencil"></span>&nbsp;'
            + '<small>{{writer}}</small>{{/writer}}'
            + '</div>'
            + '{{/circle_list}}'),
        Hogan.compile('<button class="btn btn-default" onclick="evt_btn_desc( {{grp}}, {{idx}} );" ><span class="glyphicon glyphicon-info-sign"></span></button>')
    ];
    GLOBAL.TPL_FAV_LIST = [
        Hogan.compile('<button id="id_btn_fav_del_{{grp}}_{{idx}}" class="btn btn-danger" onclick="evt_btn_fav_del( {{grp}}, {{idx}} );"><span class="glyphicon glyphicon-remove"></span></button>'),
        Hogan.compile('{{layout}}'),
        Hogan.compile(''
            + '{{#circle_list}}'
            + '<div>'
            + '<span class="glyphicon glyphicon-{{#icon}}{{icon}}{{/icon}}{{^icon}}home{{/icon}}"></span>&nbsp;'
            + '{{#url}}<a href="{{url}}" target="_blank">{{/url}}{{circle}}{{#url}}</a>{{/url}}'
            + '{{#writer}}<br />'
            + '<span class="glyphicon glyphicon-pencil"></span>&nbsp;'
            + '<small>{{writer}}</small>{{/writer}}'
            + '</div>'
            + '{{/circle_list}}'
            + '{{^circle_list}}'
            + '<div>'
            + '<span class="glyphicon glyphicon-{{#icon}}{{icon}}{{/icon}}{{^icon}}home{{/icon}}"></span>&nbsp;'
            + '{{#url}}<a href="{{url}}" target="_blank">{{/url}}{{circle}}{{#url}}</a>{{/url}}'
            + '{{#writer}}<br />'
            + '<span class="glyphicon glyphicon-pencil"></span>&nbsp;'
            + '<small>{{writer}}</small>{{/writer}}'
            + '</div>'
            + '{{/circle_list}}'),
        Hogan.compile(''
            + '<div class="btn-group">'
            + '<button class="btn btn-default" onclick="evt_btn_desc( {{grp}}, {{idx}} );" ><span class="glyphicon glyphicon-info-sign"></span></button>'
            + '<button class="btn btn-default" onclick="evt_btn_mark( {{grp}}, {{idx}} );" ><span class="glyphicon glyphicon-ok"></span></button>'
            + '</div>')
    ];
    GLOBAL.TPL_FND_LIST = [
        Hogan.compile('<button id="id_btn_fnd_fav_add_{{grp}}_{{idx}}" class="btn btn-primary" onclick="evt_btn_fav_add( {{grp}}, {{idx}} );"><span class="glyphicon glyphicon-star"></span></button>'),
        Hogan.compile('{{layout}}'),
        Hogan.compile(''
            + '{{#circle_list}}'
            + '<div>'
            + '<span class="glyphicon glyphicon-{{#icon}}{{icon}}{{/icon}}{{^icon}}home{{/icon}}"></span>&nbsp;'
            + '{{#url}}<a href="{{url}}" target="_blank">{{/url}}{{circle}}{{#url}}</a>{{/url}}'
            + '{{#writer}}<br />'
            + '<span class="glyphicon glyphicon-pencil"></span>&nbsp;'
            + '<small>{{writer}}</small>{{/writer}}'
            + '</div>'
            + '{{/circle_list}}'
            + '{{^circle_list}}'
            + '<div>'
            + '<span class="glyphicon glyphicon-{{#icon}}{{icon}}{{/icon}}{{^icon}}home{{/icon}}"></span>&nbsp;'
            + '{{#url}}<a href="{{url}}" target="_blank">{{/url}}{{circle}}{{#url}}</a>{{/url}}'
            + '{{#writer}}<br />'
            + '<span class="glyphicon glyphicon-pencil"></span>&nbsp;'
            + '<small>{{writer}}</small>{{/writer}}'
            + '</div>'
            + '{{/circle_list}}'),
        Hogan.compile('<button class="btn btn-default" onclick="evt_btn_desc( {{grp}}, {{idx}} );" ><span class="glyphicon glyphicon-info-sign"></span></button>')
    ];
    show_view("cfg");
    $("#id_btn_search").click(function (oCEvt) { evt_btn_search(); });
    $("#id_btn_import_src").click(function (oCEvt) { evt_btn_import_url(); });
    $("#keyword").keyup(function (oCEvt) { evt_keyword(oCEvt); });
    $("form").submit(function () { return (false); });
    var listArgv = get_url_param();
    var strUrl = listArgv["src_url"];
    if (strUrl) {
        if (strUrl.length > 0) {
            import_from_url(strUrl);
        }
    }
}
