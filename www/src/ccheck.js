/*!
 * @brief CircleCheck
 * @author @MizunagiKB
 */
var ccheck;
(function (ccheck) {
    var E_EDIT_MODE;
    (function (E_EDIT_MODE) {
        E_EDIT_MODE[E_EDIT_MODE["INSERT"] = 0] = "INSERT";
        E_EDIT_MODE[E_EDIT_MODE["UPDATE"] = 1] = "UPDATE";
        E_EDIT_MODE[E_EDIT_MODE["DELETE"] = 2] = "DELETE";
    })(E_EDIT_MODE = ccheck.E_EDIT_MODE || (ccheck.E_EDIT_MODE = {}));
    ccheck.app = null;
    var DEMO = 0;
    var CApplication = (function () {
        function CApplication(strJSData, strMode) {
            this.m_model_event_catalog = null;
            this.m_collection_circle_favo = null;
            this.m_collection_circle_find = null;
            this.m_collection_event_list = null;
            this.m_view_catalog_head = null;
            this.m_view_catalog_list = null;
            this.m_view_circle_favo = null;
            this.m_view_circle_find = null;
            this.m_view_event_list = null;
            this.m_model_circle_desc_hist = null;
            this.m_view_circle_desc_hist = null;
            this.m_model_circle_info = null;
            this.m_view_circle_edit = null;
            this.m_dictCircleInfoDB = null;
            this.m_bCInfo = false;
            this.m_dictAuth = null;
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
                "#id_tpl_notify_area",
                "#id_tpl_tbody_conf_0",
                "#id_tpl_tbody_conf_0_m"
            ];
            var dictTemplate = {};
            for (var n = 0; n < listTemplate.length; n++) {
                dictTemplate[listTemplate[n]] = Hogan.compile($(listTemplate[n]).html());
            }
            this.m_model_event_catalog = new ccheck.model_CEventCatalog();
            this.m_view_catalog_head = new ccheck.view_CCatalogHead({
                el: "body",
                model: this.m_model_event_catalog
            }, dictTemplate);
            this.m_view_catalog_list = new ccheck.view_CCatalogList({
                el: "body",
                model: this.m_model_event_catalog
            }, dictTemplate);
            this.m_collection_circle_favo = new ccheck.collection_CCircleFavo();
            this.m_view_circle_favo = new ccheck.view_CCircleFavo({
                el: "body",
                collection: this.m_collection_circle_favo
            }, dictTemplate);
            this.m_collection_circle_find = new ccheck.collection_CCircleFind();
            this.m_view_circle_find = new ccheck.view_CCircleFind({
                el: "body",
                collection: this.m_collection_circle_find
            }, dictTemplate);
            this.m_collection_event_list = new ccheck.collection_CEventList();
            this.m_view_event_list = new ccheck.view_CEventList({
                el: "body",
                collection: this.m_collection_event_list
            }, dictTemplate);
            this.m_model_circle_desc_hist = new ccheck.model_CCircleDesc_Hist();
            this.m_view_circle_desc_hist = new ccheck.view_CCircleDesc_Hist({
                el: "body",
                model: this.m_model_circle_desc_hist
            });
            this.m_model_circle_info = new ccheck.model_CCircleInfo();
            this.m_view_circle_edit = new ccheck.view_CCircleEdit({
                el: "body",
                model: this.m_model_circle_info
            });
            if (strJSData == null) {
                if (DEMO == 1) {
                    this.import_from_url("./sample_01.json", "");
                }
            }
            else {
                if (strMode == null) {
                    this.import_from_url(strJSData, "");
                }
                else {
                    this.import_from_url(strJSData, strMode);
                }
            }
            $("#id_btn_import_src").on("click", function (oCEvt) { ccheck.app.import_from_url($("#jsdata").val(), ""); });
        }
        CApplication.prototype.show_circle = function (nGroup, nIndex) {
            var oCItem = ccheck.app.m_model_event_catalog.attributes.CIRCLE_LIST_DAT[nGroup][nIndex];
            var oCTpl = Hogan.compile(''
                + '<table class="table table-striped table-condensed">'
                + '<thead>'
                + '<tr>'
                + '<th></th>'
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
                "circle_desc_info": oCTpl.render(oCItem)
            }));
            this.m_model_circle_desc_hist.clear();
            this.m_model_circle_desc_hist.url = "./circle_list";
            this.m_model_circle_desc_hist.fetch({
                data: {
                    descending: true,
                    limit: 5,
                    startkey: JSON.stringify([oCItem.circle_list[0].circle, "Z"]),
                    endkey: JSON.stringify([oCItem.circle_list[0].circle, ""])
                }
            });
            $("#id_tpl_desc").modal("show");
        };
        CApplication.prototype.edit_circle = function (nGrp, nIdx, strLayout, _id, eEMode) {
            if (eEMode == E_EDIT_MODE.INSERT) {
                this.m_view_circle_edit.model.reset();
                this.m_view_circle_edit.model.set("DATA_SOURCE", this.m_model_event_catalog.get("DATA_SOURCE"));
                this.m_view_circle_edit.model.set("layout", strLayout);
            }
            else {
                var oCCInfo = ccheck.app.select_circle_info_db(strLayout, _id);
                this.m_view_circle_edit.model.reset();
                this.m_view_circle_edit.model.set(oCCInfo.attributes);
            }
            this.m_view_circle_edit.ui_update(nGrp, nIdx, eEMode);
            this.m_view_circle_edit.render();
            $("#id_tpl_circle_edit").modal("show");
        };
        CApplication.prototype.create_circle_info_db = function (deffered_cinfo) {
            this.m_dictCircleInfoDB = {};
            for (var n = 0; n < deffered_cinfo[0].rows.length; n++) {
                var strLayout = deffered_cinfo[0].rows[n].doc.layout;
                if (strLayout in this.m_dictCircleInfoDB) {
                    this.m_dictCircleInfoDB[strLayout].push(new ccheck.model_CCircleInfo(deffered_cinfo[0].rows[n].doc));
                }
                else {
                    this.m_dictCircleInfoDB[strLayout] = [new ccheck.model_CCircleInfo(deffered_cinfo[0].rows[n].doc)];
                }
            }
        };
        CApplication.prototype.select_circle_info_db = function (strLayout, _id) {
            if (strLayout in this.m_dictCircleInfoDB) {
                var listCCInfo = this.m_dictCircleInfoDB[strLayout];
                for (var n = 0; n < listCCInfo.length; n++) {
                    if (_id == listCCInfo[n].get("_id")) {
                        return listCCInfo[n];
                    }
                }
            }
            return null;
        };
        CApplication.prototype.insert_circle_info_db = function (strLayout, _id, oCCInfo) {
            if (strLayout in this.m_dictCircleInfoDB) {
                var listCCInfo = this.m_dictCircleInfoDB[strLayout];
                var oCCInfoNew = new ccheck.model_CCircleInfo();
                oCCInfoNew.set(oCCInfo.attributes);
                listCCInfo.push(oCCInfoNew);
                listCCInfo.sort(compare_cedit_date);
            }
            else {
                var oCCInfoNew = new ccheck.model_CCircleInfo();
                oCCInfoNew.set(oCCInfo.attributes);
                this.m_dictCircleInfoDB[strLayout] = [oCCInfoNew];
            }
            return true;
        };
        CApplication.prototype.update_circle_info_db = function (strLayout, _id, oCCInfo) {
            var bResult = false;
            if (strLayout in this.m_dictCircleInfoDB) {
                var listCCInfo = this.m_dictCircleInfoDB[strLayout];
                for (var n = 0; n < listCCInfo.length; n++) {
                    if (_id == listCCInfo[n].get("_id")) {
                        listCCInfo[n].set(oCCInfo.attributes);
                        listCCInfo.sort(compare_cedit_date);
                        bResult = true;
                        break;
                    }
                }
            }
            return bResult;
        };
        CApplication.prototype.delete_circle_info_db = function (strLayout, _id, oCCInfo) {
            var bResult = false;
            if (strLayout in this.m_dictCircleInfoDB) {
                var listCCInfo = this.m_dictCircleInfoDB[strLayout];
                for (var n = 0; n < listCCInfo.length; n++) {
                    if (_id == listCCInfo[n].get("_id")) {
                        listCCInfo.splice(n, 1);
                        bResult = true;
                        break;
                    }
                }
            }
            return bResult;
        };
        CApplication.prototype.import_from_url = function (strUrl, strMode) {
            $.when($.getJSON(strUrl)).done(function (dictEventCatalog) {
                var URL_CIRCLE_INFO = "/db/circlecheck_cinfo/_design/event/_view/circle_information?";
                var URL_AUTH = "iface_auth.php?";
                var listCParam = [
                    "startkey=" + JSON.stringify([dictEventCatalog.DATA_SOURCE, "Z"]),
                    "endkey=" + JSON.stringify([dictEventCatalog.DATA_SOURCE, ""]),
                    "descending=true",
                    "include_docs=true"
                ];
                var listAParam = [
                    "DATA_SOURCE=" + dictEventCatalog.DATA_SOURCE
                ];
                if (strMode.match("cinfo")) {
                    $.when($.getJSON(URL_CIRCLE_INFO + listCParam.join("&")), $.getJSON(URL_AUTH + listAParam.join("&"))).done(function (deffered_cinfo, deffered_auth) {
                        ccheck.app.m_bCInfo = true;
                        ccheck.app.create_circle_info_db(deffered_cinfo);
                        if (typeof deffered_auth[0].twitter_user_id === "undefined") {
                            ccheck.app.m_dictAuth = null;
                        }
                        else {
                            ccheck.app.m_dictAuth = {
                                "DATA_SOURCE": deffered_auth[0].DATA_SOURCE,
                                "twitter_screen_name": deffered_auth[0].twitter_screen_name,
                                "twitter_user_id": deffered_auth[0].twitter_user_id,
                                "layout_list": deffered_auth[0].layout_list
                            };
                        }
                        $("#jsdata").val(strUrl);
                        ccheck.app.m_model_event_catalog.set(dictEventCatalog);
                    }).fail(function (deffered_cinfo, deffered_auth) {
                        ccheck.app.m_bCInfo = false;
                        $("#jsdata").val(strUrl);
                        ccheck.app.m_model_event_catalog.set(dictEventCatalog);
                    });
                }
                else {
                    ccheck.app.m_bCInfo = false;
                    $("#jsdata").val(strUrl);
                    ccheck.app.m_model_event_catalog.set(dictEventCatalog);
                }
            });
        };
        return CApplication;
    }());
    function compare_cedit_date(compare, to) {
        if (compare.get("cedit_date") > to.get("cedit_date"))
            return (-1);
        if (compare.get("cedit_date") < to.get("cedit_date"))
            return (1);
        return (0);
    }
    function get_url_param() {
        var listResult = {};
        var listParam = window.location.href.slice(window.location.href.indexOf("?") + 1).split("&");
        for (var n = 0; n < listParam.length; n++) {
            var listData = listParam[n].split("=");
            listResult[listData[0]] = listData[1];
        }
        return listResult;
    }
    function storage_load() {
        if (!window.localStorage)
            return;
        var listResult = [];
        var strStorageData = window.localStorage.getItem(ccheck.app.m_model_event_catalog.attributes.DATA_SOURCE) || "-1";
        if (strStorageData != "-1") {
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
        var dictParam = get_url_param();
        var strJSData = dictParam["jsdata"];
        var strMode = dictParam["m"];
        ccheck.app = new CApplication(strJSData, strMode);
        if (strJSData == null) {
            ccheck.app.m_model_event_catalog.set({ null: null });
        }
    }
    ccheck.main = main;
})(ccheck || (ccheck = {}));
//# sourceMappingURL=ccheck.js.map