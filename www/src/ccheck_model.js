/*!
 * @brief CircleCheck
 * @author @MizunagiKB

    id_view_list .cchack_view
        id_row_list_{{grp}}_{{idx}}
            data-grp="{{grp}}" data-idx="{{idx}}" .evt-favo-append
            data-grp="{{grp}}" data-idx="{{idx}}" .evt-show-desc

    id_view_favo .cchack_view
        id_row_favo_{{grp}}_{{idx}}
            data-grp="{{grp}}" data-idx="{{idx}}" .evt-favo-remove
            data-grp="{{grp}}" data-idx="{{idx}}" .evt-show-desc
            data-grp="{{grp}}" data-idx="{{idx}}" .evt-favo-check

    id_view_find .cchack_view
        id_row_find_{{grp}}_{{idx}}
            data-grp="{{grp}}" data-idx="{{idx}}" .evt-favo-append
            data-grp="{{grp}}" data-idx="{{idx}}" .evt-show-desc

    id_view_conf .cchack_view
    id_view_area .cchack_view

 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ccheck;
(function (ccheck) {
    var model_CEventList = (function (_super) {
        __extends(model_CEventList, _super);
        function model_CEventList(attributes, options) {
            _super.call(this, attributes, options);
        }
        return model_CEventList;
    }(Backbone.Model));
    ccheck.model_CEventList = model_CEventList;
    var collection_CEventList = (function (_super) {
        __extends(collection_CEventList, _super);
        function collection_CEventList(models, options) {
            this.url = "/db/circlecheck/_design/catalog/_view/list_by_date";
            _super.call(this, models, options);
        }
        collection_CEventList.prototype.parse = function (response, options) {
            return response.rows;
        };
        return collection_CEventList;
    }(Backbone.Collection));
    ccheck.collection_CEventList = collection_CEventList;
    var view_CEventList = (function (_super) {
        __extends(view_CEventList, _super);
        function view_CEventList(options, dictTemplate) {
            _super.call(this, options);
            this.listenTo(this.collection, "sync", this.render);
            this.m_dictTemplate = dictTemplate;
        }
        view_CEventList.prototype.render = function () {
            $("#id_tbl_conf_0").html(this.m_dictTemplate["#id_tpl_tbody_conf"].render({ rows: this.collection.models }));
            return this;
        };
        return view_CEventList;
    }(Backbone.View));
    ccheck.view_CEventList = view_CEventList;
    var model_CEventCatalog = (function (_super) {
        __extends(model_CEventCatalog, _super);
        function model_CEventCatalog(attributes, options) {
            _super.call(this, attributes, options);
        }
        model_CEventCatalog.prototype.validate = function (attributes, options) {
            if (!attributes.DATA_SOURCE)
                return "E";
            if (!attributes.CIRCLE_LIST_TBL)
                return "E";
            if (!attributes.CIRCLE_LIST_DAT)
                return "E";
            return "";
        };
        return model_CEventCatalog;
    }(Backbone.Model));
    ccheck.model_CEventCatalog = model_CEventCatalog;
    var model_CCircleFavo = (function (_super) {
        __extends(model_CCircleFavo, _super);
        function model_CCircleFavo(attributes, options) {
            _super.call(this, attributes, options);
        }
        return model_CCircleFavo;
    }(Backbone.Model));
    ccheck.model_CCircleFavo = model_CCircleFavo;
    var collection_CCircleFavo = (function (_super) {
        __extends(collection_CCircleFavo, _super);
        function collection_CCircleFavo(models, options) {
            _super.call(this, models, options);
            this.on("add", this.evt_append);
            this.on("remove", this.evt_remove);
        }
        collection_CCircleFavo.prototype.modelId = function (attributes) {
            return attributes.layout;
        };
        collection_CCircleFavo.prototype.comparator = function (compare, to) {
            if (compare.attributes.sortkey > to.attributes.sortkey)
                return (1);
            if (compare.attributes.sortkey < to.attributes.sortkey)
                return (-1);
            return (0);
        };
        collection_CCircleFavo.prototype.evt_append = function (oCItem) {
            var listTargetId = ["#id_row_list_", "#id_row_find_"];
            for (var n = 0; n < listTargetId.length; n++) {
                var strTargetId = listTargetId[n] + oCItem.attributes.grp + "_" + oCItem.attributes.idx;
                $(strTargetId + " button.evt-favo-append").addClass("disabled");
                $(strTargetId).addClass("info");
            }
            $("#id_head_fav_count").text(String(ccheck.app.m_collection_circle_favo.length));
            $("#id_head_fav_count").fadeIn();
        };
        collection_CCircleFavo.prototype.evt_remove = function (oCItem) {
            var listTargetId = ["#id_row_list_", "#id_row_find_"];
            for (var n = 0; n < listTargetId.length; n++) {
                var strTargetId = listTargetId[n] + oCItem.attributes.grp + "_" + oCItem.attributes.idx;
                $(strTargetId).removeClass("info");
                $(strTargetId + " button.evt-favo-append").removeClass("disabled");
            }
            if (ccheck.app.m_collection_circle_favo.length > 0) {
                $("#id_head_fav_count").text(String(ccheck.app.m_collection_circle_favo.length));
            }
            else {
                $("#id_head_fav_count").fadeOut();
            }
        };
        return collection_CCircleFavo;
    }(Backbone.Collection));
    ccheck.collection_CCircleFavo = collection_CCircleFavo;
    var model_CCircleFind = (function (_super) {
        __extends(model_CCircleFind, _super);
        function model_CCircleFind(attributes, options) {
            _super.call(this, attributes, options);
        }
        return model_CCircleFind;
    }(Backbone.Model));
    ccheck.model_CCircleFind = model_CCircleFind;
    var collection_CCircleFind = (function (_super) {
        __extends(collection_CCircleFind, _super);
        function collection_CCircleFind(models, options) {
            _super.call(this, models, options);
        }
        collection_CCircleFind.prototype.modelId = function (attributes) {
            return attributes.layout;
        };
        collection_CCircleFind.prototype.comparator = function (compare, to) {
            if (compare.attributes.sortkey > to.attributes.sortkey)
                return (1);
            if (compare.attributes.sortkey < to.attributes.sortkey)
                return (-1);
            return (0);
        };
        return collection_CCircleFind;
    }(Backbone.Collection));
    ccheck.collection_CCircleFind = collection_CCircleFind;
    var view_CCatalogHead = (function (_super) {
        __extends(view_CCatalogHead, _super);
        function view_CCatalogHead(options, dictTemplate) {
            _super.call(this, options);
            this.listenTo(this.model, "change", this.render);
            this.on("view_change", this.view_change);
            this.m_dictTemplate = dictTemplate;
        }
        view_CCatalogHead.prototype.events = function () {
            return {
                "click li#id_menu_list": this.evt_view_change,
                "click li#id_menu_favo": this.evt_view_change,
                "click li#id_menu_find": this.evt_view_change,
                "click li#id_menu_conf": this.evt_view_change,
                "click li#id_menu_area": this.evt_view_change
            };
        };
        view_CCatalogHead.prototype.evt_view_change = function (oCEvt) {
            this.view_change("#" + oCEvt.currentTarget.id);
        };
        view_CCatalogHead.prototype.view_change = function (strId) {
            $("nav li").removeClass("active");
            $(strId).removeClass("disabled");
            $(strId).addClass("active");
            $(".cchack_view").hide();
            $($(strId).data("target-view")).fadeIn();
        };
        view_CCatalogHead.prototype.is_valid_param = function (strParam) {
            var bResult = false;
            if (strParam) {
                if (strParam != "#") {
                    bResult = true;
                }
            }
            return bResult;
        };
        view_CCatalogHead.prototype.render_notify_area = function () {
            if (this.is_valid_param(this.model.attributes.EVENT_ST) != true)
                return;
            if (this.is_valid_param(this.model.attributes.EVENT_EN) != true)
                return;
            var oCDate = new Date();
            var oCDateSt = new Date(this.model.attributes.EVENT_ST);
            var oCDateEn = new Date(this.model.attributes.EVENT_EN);
            var strDateTimeSt = oCDateSt.getFullYear() + "年" + (oCDateSt.getMonth() + 1) + "月" + oCDateSt.getDate() + "日&nbsp;" + ("0" + oCDateSt.getHours()).slice(-2) + ":" + ("0" + oCDateSt.getMinutes()).slice(-2);
            var strDateTimeEn = oCDateEn.getFullYear() + "年" + (oCDateEn.getMonth() + 1) + "月" + oCDateEn.getDate() + "日&nbsp;" + ("0" + oCDateEn.getHours()).slice(-2) + ":" + ("0" + oCDateEn.getMinutes()).slice(-2);
            var listItem = [];
            if (oCDate.getTime() < oCDateSt.getTime()) {
                listItem.push(this.m_dictTemplate["#id_tpl_notify_area"].render({
                    "alert": "info", "icon": "info-sign",
                    "text": "開催予定日&nbsp;[&nbsp;" + strDateTimeSt + "&nbsp;]"
                }));
            }
            else if (oCDate.getTime() < oCDateEn.getTime()) {
                listItem.push(this.m_dictTemplate["#id_tpl_notify_area"].render({ "alert": "info", "icon": "info-sign", "text": "本日開催&nbsp;[&nbsp;" + strDateTimeSt + "&nbsp;-&nbsp;" + strDateTimeEn + "&nbsp;]" }));
            }
            else {
                listItem.push(this.m_dictTemplate["#id_tpl_notify_area"].render({ "alert": "danger", "icon": "exclamation-sign", "text": "このイベントは終了しました" }));
            }
            for (var n = 0; n < this.model.attributes.INFORMATION.length; n++) {
                listItem.push(this.m_dictTemplate["#id_tpl_notify_area"].render(this.model.attributes.INFORMATION[n]));
            }
            $("#id_notify_area").html(listItem.join(""));
        };
        view_CCatalogHead.prototype.render_map = function () {
            if (this.model.attributes.EVENT_MAP_LOCATION) {
                var oCMap = new Microsoft.Maps.Map(document.getElementById("id_bing_map"), {
                    credentials: "AnFn8oGtujPjISREG74t6AjvDUiHBPJxXT0Dai0p2WlPyZtIB9FoBnFwyNGnKkFr",
                    center: new Microsoft.Maps.Location(this.model.attributes.EVENT_MAP_LOCATION.latitude, this.model.attributes.EVENT_MAP_LOCATION.longitude),
                    mapTypeId: Microsoft.Maps.MapTypeId.road,
                    enableSearchLogo: false,
                    enableClickableLogo: false,
                    showDashboard: true,
                    zoom: 16
                });
                oCMap.entities.push(new Microsoft.Maps.Pushpin(oCMap.getCenter()));
            }
        };
        view_CCatalogHead.prototype.render = function () {
            var strBaseAddress = window.location.href.split("?")[0];
            if (this.model.isValid() == false) {
                $("#id_tpl_head").html(this.m_dictTemplate["#id_tpl_head"].render({ "EVENT_NAME": "イベント一覧" }));
                this.view_change("#id_menu_conf");
            }
            else {
                $("#id_tpl_head").html(this.m_dictTemplate["#id_tpl_head"].render(this.model.attributes));
                $("nav li").removeClass("disabled");
                this.view_change("#id_menu_list");
                if (this.is_valid_param(this.model.attributes.DATA_SOURCE_PREV) == true) {
                    $("#id_menu_prev a").attr("href", strBaseAddress + "?jsdata=" + this.model.attributes.DATA_SOURCE_PREV);
                }
                else {
                    $("#id_menu_prev").addClass("disabled");
                }
                if (this.is_valid_param(this.model.attributes.DATA_SOURCE_NEXT) == true) {
                    $("#id_menu_next a").attr("href", strBaseAddress + "?jsdata=" + this.model.attributes.DATA_SOURCE_NEXT);
                }
                else {
                    $("#id_menu_next").addClass("disabled");
                }
                this.render_notify_area();
                this.render_map();
            }
            return this;
        };
        return view_CCatalogHead;
    }(Backbone.View));
    ccheck.view_CCatalogHead = view_CCatalogHead;
    var view_CCatalogList = (function (_super) {
        __extends(view_CCatalogList, _super);
        function view_CCatalogList(options, dictTemplate) {
            _super.call(this, options);
            this.listenTo(this.model, "change", this.render);
            this.m_dictTemplate = dictTemplate;
        }
        view_CCatalogList.prototype.events = function () {
            return {
                "click #id_view_list button.evt-favo-append": this.evt_favo_append,
                "click #id_view_list button.evt-show-circle": this.evt_show_circle
            };
        };
        view_CCatalogList.prototype.evt_favo_append = function (oCEvt) {
            var nGrp = $(oCEvt.currentTarget).data("grp");
            var nIdx = $(oCEvt.currentTarget).data("idx");
            var oCItem = this.model.attributes.CIRCLE_LIST_DAT[nGrp][nIdx];
            ccheck.app.m_collection_circle_favo.add(oCItem);
            ccheck.storage_save();
        };
        view_CCatalogList.prototype.evt_show_circle = function (oCEvt) {
            var nGrp = $(oCEvt.currentTarget).data("grp");
            var nIdx = $(oCEvt.currentTarget).data("idx");
            ccheck.app.show_circle(nGrp, nIdx);
        };
        view_CCatalogList.prototype.render_table_tab = function () {
            var oCTbl = this.model.attributes.CIRCLE_LIST_TBL;
            $("#id_view_list").html(this.m_dictTemplate["#id_tpl_eventcatalog_list"].render({ "CIRCLE_LIST_TBL": oCTbl }));
        };
        view_CCatalogList.prototype.render_table_dat = function () {
            var oCTbl = this.model.attributes.CIRCLE_LIST_TBL;
            var oCDat = this.model.attributes.CIRCLE_LIST_DAT;
            for (var nT = 0; nT < oCTbl.length; nT++) {
                var listTable = [];
                for (var nD = 0; nD < oCDat[String(nT)].length; nD++) {
                    var oCItem = oCDat[String(nT)][nD];
                    oCItem.grp = nT;
                    oCItem.idx = nD;
                    listTable.push('<tr id="id_row_list_' + oCItem.grp + '_' + oCItem.idx + '">');
                    listTable.push('<td>' + this.m_dictTemplate["#id_tpl_favo_append"].render(oCItem) + '</td>');
                    listTable.push('<td>' + this.m_dictTemplate["#id_tpl_layout"].render(oCItem) + '</td>');
                    listTable.push('<td>' + this.m_dictTemplate["#id_tpl_circleinfo"].render(oCItem) + '</td>');
                    listTable.push('<td>' + this.m_dictTemplate["#id_tpl_show_circle_desc_1"].render(oCItem) + '</td>');
                    listTable.push('</tr>');
                }
                $("#id_tbl_list_" + nT).html(listTable.join(''));
            }
        };
        view_CCatalogList.prototype.render = function () {
            if (this.model.isValid() == false) {
                ccheck.app.m_collection_event_list.fetch({
                    data: {
                        descending: true,
                        limit: 30
                    }
                });
            }
            else {
                ccheck.app.m_collection_event_list.fetch({
                    data: {
                        descending: true,
                        startkey: JSON.stringify([this.model.attributes.EVENT_SERIES, "Z"]),
                        endkey: JSON.stringify([this.model.attributes.EVENT_SERIES, ""])
                    }
                });
                this.render_table_tab();
                this.render_table_dat();
                $("#id_tab_circle_lst a:first").tab("show");
                ccheck.resume();
            }
            return this;
        };
        return view_CCatalogList;
    }(Backbone.View));
    ccheck.view_CCatalogList = view_CCatalogList;
    var view_CCircleFavo = (function (_super) {
        __extends(view_CCircleFavo, _super);
        function view_CCircleFavo(options, dictTemplate) {
            _super.call(this, options);
            this.listenTo(this.collection, "add", this.render);
            this.listenTo(this.collection, "remove", this.render);
            this.m_dictTemplate = dictTemplate;
        }
        view_CCircleFavo.prototype.events = function () {
            return {
                "click #id_view_favo button.evt-favo-remove": "evt_favo_remove",
                "click #id_view_favo button.evt-show-circle": "evt_show_circle",
                "click #id_view_favo button.evt-favo-check": "evt_favo_check",
            };
        };
        view_CCircleFavo.prototype.evt_favo_remove = function (oCEvt) {
            var nGrp = $(oCEvt.currentTarget).data("grp");
            var nIdx = $(oCEvt.currentTarget).data("idx");
            var oCItem = ccheck.app.m_model_event_catalog.attributes.CIRCLE_LIST_DAT[nGrp][nIdx];
            ccheck.app.m_collection_circle_favo.remove(new model_CCircleFavo(oCItem));
            ccheck.storage_save();
        };
        view_CCircleFavo.prototype.evt_show_circle = function (oCEvt) {
            var nGrp = $(oCEvt.currentTarget).data("grp");
            var nIdx = $(oCEvt.currentTarget).data("idx");
            ccheck.app.show_circle(nGrp, nIdx);
        };
        view_CCircleFavo.prototype.evt_favo_check = function (oCEvt) {
            var nGrp = $(oCEvt.currentTarget).data("grp");
            var nIdx = $(oCEvt.currentTarget).data("idx");
            var oCItem = ccheck.app.m_model_event_catalog.attributes.CIRCLE_LIST_DAT[nGrp][nIdx];
            $("#id_row_favo_" + nGrp + "_" + nIdx).toggleClass("success");
        };
        view_CCircleFavo.prototype.render_table_tab = function () {
        };
        view_CCircleFavo.prototype.render_table_dat = function () {
            var listTable = [];
            for (var n = 0; n < this.collection.length; n++) {
                var oCItem = this.collection.models[n].attributes;
                listTable.push('<tr id="id_row_favo_' + oCItem.grp + '_' + oCItem.idx + '">');
                listTable.push('<td>' + this.m_dictTemplate["#id_tpl_favo_remove"].render(oCItem) + '</td>');
                listTable.push('<td>' + this.m_dictTemplate["#id_tpl_layout"].render(oCItem) + '</td>');
                listTable.push('<td>' + this.m_dictTemplate["#id_tpl_circleinfo"].render(oCItem) + '</td>');
                listTable.push('<td>' + this.m_dictTemplate["#id_tpl_show_circle_desc_2"].render(oCItem) + '</td>');
                listTable.push('</tr>');
            }
            $("#id_tbl_favo_0").html(listTable.join(''));
        };
        view_CCircleFavo.prototype.render = function () {
            this.render_table_tab();
            this.render_table_dat();
            return this;
        };
        return view_CCircleFavo;
    }(Backbone.View));
    ccheck.view_CCircleFavo = view_CCircleFavo;
    var view_CCircleFind = (function (_super) {
        __extends(view_CCircleFind, _super);
        function view_CCircleFind(options, dictTemplate) {
            _super.call(this, options);
            this.m_hTimer = null;
            this.m_strSearchKeyword = "";
            this.m_dictTemplate = dictTemplate;
        }
        view_CCircleFind.prototype.events = function () {
            return {
                "keyup #id_input_keyword": this.evt_search,
                "click button#id_btn_search": this.evt_search,
                "click #id_view_find button.evt-favo-append": this.evt_favo_append,
                "click #id_view_find button.evt-show-circle": this.evt_show_circle
            };
        };
        view_CCircleFind.prototype.evt_favo_append = function (oCEvt) {
            var nGrp = $(oCEvt.currentTarget).data("grp");
            var nIdx = $(oCEvt.currentTarget).data("idx");
            var oCItem = ccheck.app.m_model_event_catalog.attributes.CIRCLE_LIST_DAT[nGrp][nIdx];
            ccheck.app.m_collection_circle_favo.add(oCItem);
            ccheck.storage_save();
        };
        view_CCircleFind.prototype.evt_show_circle = function (oCEvt) {
            var nGrp = $(oCEvt.currentTarget).data("grp");
            var nIdx = $(oCEvt.currentTarget).data("idx");
            ccheck.app.show_circle(nGrp, nIdx);
        };
        view_CCircleFind.prototype.search_circle_item = function (strKeyword, oCItem) {
            var bFound = false;
            for (var n = 0; n < oCItem.circle_list.length; n++) {
                var oCDatItem = oCItem.circle_list[n];
                for (var k in oCDatItem) {
                    if (oCDatItem[k].indexOf(strKeyword, 0) != -1)
                        bFound = true;
                }
            }
            return bFound;
        };
        view_CCircleFind.prototype.evt_search = function (oCEvt) {
            var strKeyword = $("#id_input_keyword").val();
            if (!strKeyword)
                return;
            if (strKeyword.length < 2)
                return;
            if (strKeyword == this.m_strSearchKeyword)
                return;
            if (this.m_hTimer != null) {
                clearTimeout(this.m_hTimer);
                this.m_hTimer = null;
            }
            $("#id_search_progress").css("width", "0%");
            this.m_hTimer = setTimeout(function () {
                ccheck.app.m_view_circle_find.search(strKeyword);
            }, 1000);
        };
        view_CCircleFind.prototype.search = function (strKeyword) {
            var oCTBL = ccheck.app.m_model_event_catalog.attributes.CIRCLE_LIST_TBL;
            var oCDAT = ccheck.app.m_model_event_catalog.attributes.CIRCLE_LIST_DAT;
            var listFavItem = [];
            $("#id_search_progress").css("width", "100%");
            this.collection.reset();
            for (var grp = 0; grp < oCTBL.length; grp++) {
                for (var idx = 0; idx < oCDAT[grp].length; idx++) {
                    var oCItem = oCDAT[grp][idx];
                    if (this.search_circle_item(strKeyword, oCItem) == true) {
                        this.collection.add(oCItem);
                    }
                }
            }
            this.m_strSearchKeyword = strKeyword;
            this.render();
        };
        view_CCircleFind.prototype.render = function () {
            var listTable = [];
            for (var n = 0; n < this.collection.length; n++) {
                var oCItem = this.collection.at(n).attributes;
                listTable.push('<tr id="' + "id_row_find_" + oCItem.grp + "_" + oCItem.idx + '">');
                listTable.push('<td>' + this.m_dictTemplate["#id_tpl_favo_append"].render(oCItem) + '</td>');
                listTable.push('<td>' + this.m_dictTemplate["#id_tpl_layout"].render(oCItem) + '</td>');
                listTable.push('<td>' + this.m_dictTemplate["#id_tpl_circleinfo"].render(oCItem) + '</td>');
                listTable.push('<td>' + this.m_dictTemplate["#id_tpl_show_circle_desc_1"].render(oCItem) + '</td>');
                listTable.push('</tr>');
            }
            $("#id_tbl_find_0").html(listTable.join(''));
            for (var n = 0; n < ccheck.app.m_collection_circle_favo.length; n++) {
                var oCItem = ccheck.app.m_collection_circle_favo.at(n).attributes;
                var strTargetId = "#id_row_find_" + oCItem.grp + "_" + oCItem.idx;
                $(strTargetId + " button.evt-favo-append").addClass("disabled");
                $(strTargetId).addClass("info");
            }
            if (this.collection.length > 0) {
                $("#id_search_result").html('<p class="text-center">' + this.collection.length + ' 件 見つかりました。</p>');
            }
            else {
                $("#id_search_result").html('<p class="text-center">見つかりませんでした。</p>');
            }
            return this;
        };
        return view_CCircleFind;
    }(Backbone.View));
    ccheck.view_CCircleFind = view_CCircleFind;
})(ccheck || (ccheck = {}));
//# sourceMappingURL=ccheck_model.js.map