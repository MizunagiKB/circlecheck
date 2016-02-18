/*!
 * @brief CircleCheck
 * @author @MizunagiKB
 */
var ccheck;
(function (ccheck) {
    ccheck.app = null;
    var CApplication = (function () {
        function CApplication(strJSData) {
            this.m_model_event_catalog = null;
            this.m_collection_circle_favo = null;
            this.m_collection_circle_find = null;
            this.m_view_catalog_head = null;
            this.m_view_catalog_list = null;
            this.m_view_circle_favo = null;
            this.m_view_circle_find = null;
            this.m_oCTplTBodyConf = Hogan.compile($("#id_tpl_tbody_conf").html());
            this.m_oCTplDesc = Hogan.compile($("#id_tpl_desc").html());
            var listTemplate = [
                "#id_tpl_head",
                "#id_tpl_eventcatalog_list",
                "#id_tpl_favo_append",
                "#id_tpl_favo_remove",
                "#id_tpl_layout",
                "#id_tpl_circleinfo",
                "#id_tpl_show_circle_desc_1",
                "#id_tpl_show_circle_desc_2",
                "#id_tpl_notify_area"
            ];
            var dictTemplate = {};
            for (var n = 0; n < listTemplate.length; n++) {
                dictTemplate[listTemplate[n]] = Hogan.compile($(listTemplate[n]).html());
            }
            this.m_model_event_catalog = new ccheck.model_CEventCatalog();
            this.m_view_catalog_head = new ccheck.view_CCatalogHead({
                el: "nav",
                model: this.m_model_event_catalog,
                dictTemplate: dictTemplate
            });
            this.m_view_catalog_list = new ccheck.view_CCatalogList({
                el: "div",
                model: this.m_model_event_catalog,
                dictTemplate: dictTemplate
            });
            this.m_collection_circle_favo = new ccheck.collection_CCircleFavo();
            this.m_view_circle_favo = new ccheck.view_CCircleFavo({
                el: "div",
                collection: this.m_collection_circle_favo,
                dictTemplate: dictTemplate
            });
            this.m_collection_circle_find = new ccheck.collection_CCircleFind();
            this.m_view_circle_find = new ccheck.view_CCircleFind({
                el: "div",
                collection: this.m_collection_circle_find,
                dictTemplate: dictTemplate
            });
            if (strJSData == null) {
            }
            else {
                this.import_from_url(strJSData);
            }
            $("#id_btn_import_src").on("click", function (oCEvt) { ccheck.app.import_from_url($("#jsdata").val()); });
        }
        CApplication.prototype.show_circle = function (nGroup, nIndex) {
            var oCItem = ccheck.app.m_model_event_catalog.attributes.CIRCLE_LIST_DAT[nGroup][nIndex];
            var oCTpl = Hogan.compile(''
                + '<table class="table table-striped table-condensed">'
                + '<thead>'
                + '<tr>'
                + '<th>サークル情報</th>'
                + '</tr>'
                + '</thead>'
                + '<tbody>'
                + '{{#circle_list}}'
                + '<tr>'
                + '<td>'
                + '<div>'
                + '<span class="glyphicon glyphicon-{{#icon}}{{icon}}{{/icon}}{{^icon}}home{{/icon}}"></span>&nbsp;{{circle}}'
                + '{{#url}}<br /><a href="{{url}}" target="_blank">{{/url}}{{url}}{{#url}}</a>{{/url}}'
                + '{{#twitter}}<br />Twitter&nbsp;<a href="{{url}}" target="_blank">{{twitter}}</a>{{/twitter}}'
                + '{{#pixiv}}<br />Pixiv&nbsp;<a href="{{pixiv}}" target="_blank">{{pixiv}}</a>{{/pixiv}}'
                + '</div>'
                + '{{#writer}}<span class="glyphicon glyphicon-pencil"></span>&nbsp;{{writer}}{{/writer}}'
                + '</tr>'
                + '{{/circle_list}}'
                + '</tbody>'
                + '</table>');
            $("#id_tpl_desc").html(this.m_oCTplDesc.render({
                "layout": oCItem.layout,
                "circle_table_item": oCTpl.render(oCItem)
            }));
            $("#id_tpl_desc").modal("show");
        };
        CApplication.prototype.get_event_series = function (strUrl) {
            $.getJSON(strUrl, function (oCJson) {
                $("#id_tbl_conf_0").html(ccheck.app.m_oCTplTBodyConf.render(oCJson));
            });
        };
        CApplication.prototype.import_from_url = function (strUrl) {
            $.getJSON(strUrl, function (dictEventCatalog) {
                ccheck.app.m_model_event_catalog.set(dictEventCatalog);
                $("#jsdata").val(strUrl);
            });
        };
        return CApplication;
    }());
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
    function storage_load() {
        if (!window.localStorage)
            return;
        var listResult = [];
        var strStorageData = window.localStorage.getItem(ccheck.app.m_model_event_catalog.attributes.DATA_SOURCE) || -1;
        if (strStorageData != -1) {
            listResult = JSON.parse(strStorageData);
        }
        return listResult;
    }
    ccheck.storage_load = storage_load;
    function storage_save() {
        if (!window.localStorage)
            return;
        window.localStorage.setItem(ccheck.app.m_model_event_catalog.attributes.DATA_SOURCE, JSON.stringify(ccheck.app.m_collection_circle_favo));
    }
    ccheck.storage_save = storage_save;
    function resume() {
        if (!window.localStorage) {
            document.getElementById("id_notify_area_1").innerHTML = ('<div class="alert alert-block">\
                <button type="button" class="close" data-dismiss="alert">×</button>\
                <h4>ご利用の環境ではローカルストレージが使用出来ないようです。</h4>ローカルストレージが使用出来ない場合、お気に入りを保存する事が出来ません。\
                </div>\
                ');
        }
        else {
            var listFav = storage_load();
            var listTbl = ccheck.app.m_model_event_catalog.attributes.CIRCLE_LIST_TBL;
            var listDat = ccheck.app.m_model_event_catalog.attributes.CIRCLE_LIST_DAT;
            for (var grp = 0; grp < listTbl.length; grp++) {
                for (var idx = 0; idx < listDat[grp].length; idx++) {
                    for (var n = 0; n < listFav.length; n++) {
                        if (listDat[grp][idx].layout == listFav[n].layout) {
                            ccheck.app.m_collection_circle_favo.add(listFav[n]);
                        }
                    }
                }
            }
        }
    }
    ccheck.resume = resume;
    function main() {
        var listParam = get_url_param();
        var strJSData = listParam["jsdata"];
        ccheck.app = new CApplication(strJSData);
        if (strJSData == null) {
            ccheck.app.m_model_event_catalog.set({ null: null });
        }
    }
    ccheck.main = main;
})(ccheck || (ccheck = {}));
//# sourceMappingURL=ccheck.js.map