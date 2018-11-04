/*!
 * @brief CircleCheck
 * @author @MizunagiKB

    id_view_list .cchack_view
        id_row_list_{{grp}}_{{idx}}
            data-grp="{{grp}}" data-idx="{{idx}}" .evt-favo-append
            data-grp="{{grp}}" data-idx="{{idx}}" .evt-show-circle
            data-grp="{{grp}}" data-idx="{{idx}}" .evt-edit-circle

    id_view_favo .cchack_view
        id_row_favo_{{grp}}_{{idx}}
            data-grp="{{grp}}" data-idx="{{idx}}" .evt-favo-remove
            data-grp="{{grp}}" data-idx="{{idx}}" .evt-show-circle
            data-grp="{{grp}}" data-idx="{{idx}}" .evt-favo-check

    id_view_find .cchack_view
        id_row_find_{{grp}}_{{idx}}
            data-grp="{{grp}}" data-idx="{{idx}}" .evt-favo-append
            data-grp="{{grp}}" data-idx="{{idx}}" .evt-show-circle

    id_view_conf .cchack_vie
    id_view_area .cchack_view

 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ccheck;
(function (ccheck) {
    var model_CEventList = (function (_super) {
        __extends(model_CEventList, _super);
        function model_CEventList(attributes, options) {
            return _super.call(this, attributes, options) || this;
        }
        return model_CEventList;
    }(Backbone.Model));
    ccheck.model_CEventList = model_CEventList;
    var collection_CEventList = (function (_super) {
        __extends(collection_CEventList, _super);
        function collection_CEventList(models, options) {
            return _super.call(this, models, options) || this;
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
            var _this = _super.call(this, options) || this;
            _this.listenTo(_this.collection, "sync", _this.render);
            _this.m_dictTemplate = dictTemplate;
            return _this;
        }
        view_CEventList.prototype.render = function () {
            var strTemplateName = "";
            if (ccheck.app.m_bCInfo == true) {
                strTemplateName = "#id_tpl_tbody_conf_0_m";
            }
            else {
                strTemplateName = "#id_tpl_tbody_conf_0";
            }
            $("#id_tbl_conf_0").html(this.m_dictTemplate[strTemplateName].render({
                rows: this.collection.models,
                m: "cinfo"
            }));
            return this;
        };
        return view_CEventList;
    }(Backbone.View));
    ccheck.view_CEventList = view_CEventList;
    var model_CEventCatalog = (function (_super) {
        __extends(model_CEventCatalog, _super);
        function model_CEventCatalog(attributes, options) {
            return _super.call(this, attributes, options) || this;
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
            return _super.call(this, attributes, options) || this;
        }
        return model_CCircleFavo;
    }(Backbone.Model));
    ccheck.model_CCircleFavo = model_CCircleFavo;
    var collection_CCircleFavo = (function (_super) {
        __extends(collection_CCircleFavo, _super);
        function collection_CCircleFavo(models, options) {
            var _this = _super.call(this, models, options) || this;
            _this.comparator = function (compare, to) {
                if (compare.attributes.sortkey > to.attributes.sortkey)
                    return (1);
                if (compare.attributes.sortkey < to.attributes.sortkey)
                    return (-1);
                return (0);
            };
            _this.on("add", _this.evt_append);
            _this.on("remove", _this.evt_remove);
            return _this;
        }
        collection_CCircleFavo.prototype.modelId = function (attributes) {
            return attributes.layout;
        };
        collection_CCircleFavo.prototype.evt_append = function (oCItem) {
            var listTargetId = ["#id_row_list_", "#id_row_find_"];
            for (var n = 0; n < listTargetId.length; n++) {
                var strTargetId = listTargetId[n] + oCItem.attributes.grp + "_" + oCItem.attributes.idx;
                $(strTargetId + " button.evt-favo-append").addClass("disabled");
                $(strTargetId).addClass("positive");
            }
            $("#id_head_fav_count").text(String(ccheck.app.m_collection_circle_favo.length));
            $("#id_head_fav_count").fadeIn();
        };
        collection_CCircleFavo.prototype.evt_remove = function (oCItem) {
            var listTargetId = ["#id_row_list_", "#id_row_find_"];
            for (var n = 0; n < listTargetId.length; n++) {
                var strTargetId = listTargetId[n] + oCItem.attributes.grp + "_" + oCItem.attributes.idx;
                $(strTargetId).removeClass("positive");
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
            return _super.call(this, attributes, options) || this;
        }
        return model_CCircleFind;
    }(Backbone.Model));
    ccheck.model_CCircleFind = model_CCircleFind;
    var collection_CCircleFind = (function (_super) {
        __extends(collection_CCircleFind, _super);
        function collection_CCircleFind(models, options) {
            var _this = _super.call(this, models, options) || this;
            _this.comparator = function (compare, to) {
                if (compare.attributes.sortkey > to.attributes.sortkey)
                    return (1);
                if (compare.attributes.sortkey < to.attributes.sortkey)
                    return (-1);
                return (0);
            };
            return _this;
        }
        collection_CCircleFind.prototype.modelId = function (attributes) {
            return attributes.layout;
        };
        return collection_CCircleFind;
    }(Backbone.Collection));
    ccheck.collection_CCircleFind = collection_CCircleFind;
    var view_CCatalogHead = (function (_super) {
        __extends(view_CCatalogHead, _super);
        function view_CCatalogHead(options, dictTemplate) {
            var _this = _super.call(this, options) || this;
            _this.listenTo(_this.model, "change", _this.render);
            _this.on("view_change", _this.view_change);
            _this.m_dictTemplate = dictTemplate;
            _this.m_bMapRendered = false;
            return _this;
        }
        view_CCatalogHead.prototype.events = function () {
            return {
                "click a#id_menu_list": this.evt_view_change,
                "click a#id_menu_favo": this.evt_view_change,
                "click a#id_menu_find": this.evt_view_change,
                "click a#id_menu_conf": this.evt_view_change,
                "click a#id_menu_area": this.evt_view_change
            };
        };
        view_CCatalogHead.prototype.evt_view_change = function (oCEvt) {
            this.view_change("#" + oCEvt.currentTarget.id);
        };
        view_CCatalogHead.prototype.view_change = function (strId) {
            $("a.cc_menu").removeClass("active");
            $(strId).removeClass("disabled");
            $(strId).addClass("active");
            $(".ccheck_view").hide();
            $($(strId).data("target-view")).show();
            if (strId == "#id_menu_area") {
                if (this.m_bMapRendered == false) {
                    this.render_map();
                    this.m_bMapRendered = true;
                }
            }
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
                var map = L.map("id_bing_map");
                map.setView([this.model.attributes.EVENT_MAP_LOCATION.latitude, this.model.attributes.EVENT_MAP_LOCATION.longitude], 16);
                L.tileLayer("https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png", {
                    attribution: "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>"
                }).addTo(map);
                L.marker([this.model.attributes.EVENT_MAP_LOCATION.latitude, this.model.attributes.EVENT_MAP_LOCATION.longitude]).addTo(map);
            }
        };
        view_CCatalogHead.prototype.render = function () {
            var tpl_header = Hogan.compile('<a href="{{EVENT_URL}}">{{EVENT_NAME}}</a>');
            var strBaseAddress = window.location.href.split("?")[0];
            if (this.model.isValid() == false) {
                console.log("DEBUG EVENT_NAME");
                $("#id_event_header").html(tpl_header.render({ "EVENT_URL": "", "EVENT_NAME": "イベント一覧" }));
                $("#id_event_header_mobile").html(tpl_header.render({ "EVENT_URL": "", "EVENT_NAME": "イベント一覧" }));
                this.view_change("#id_menu_conf");
            }
            else {
                $("#id_event_header").html(tpl_header.render(this.model.attributes));
                $("#id_event_header_mobile").html(tpl_header.render(this.model.attributes));
                if (ccheck.app.m_bCInfo == true) {
                    if (this.model.get("EVENT_SERIES") == "lyricalmagical") {
                        var strHref = "iface_session.php?order=init&jsdata=" + $("#jsdata").val();
                        var strScreenName = "";
                        var strBtn = "サークルログイン";
                        var strUser = '<i class="user outline icon"></i>';
                        if (ccheck.app.m_dictAuth != null) {
                            if ("twitter_screen_name" in ccheck.app.m_dictAuth) {
                                strScreenName = '@' + ccheck.app.m_dictAuth["twitter_screen_name"];
                                strBtn = "サークルログオフ";
                                strHref = "iface_session.php?order=term&jsdata=" + $("#jsdata").val();
                                strUser = '<i class="user icon"></i>';
                            }
                        }
                        $("#id_menu_mode_space").html(''
                            + '<a class="item" href="' + strHref + '">' + strScreenName + '&nbsp;' + strUser + strBtn + '</a>');
                    }
                }
                $("nav li").removeClass("disabled");
                this.view_change("#id_menu_list");
                if (this.is_valid_param(this.model.attributes.DATA_SOURCE_PREV) == true) {
                    var strPrev = strBaseAddress + "?jsdata=" + this.model.attributes.DATA_SOURCE_PREV;
                    if (ccheck.app.m_bCInfo == true) {
                        $("a#id_menu_prev").attr("href", strPrev + "&m=cinfo");
                    }
                    else {
                        $("a#id_menu_prev").attr("href", strPrev);
                    }
                }
                else {
                    $("#id_menu_prev").addClass("disabled");
                }
                if (this.is_valid_param(this.model.attributes.DATA_SOURCE_NEXT) == true) {
                    var strNext = strBaseAddress + "?jsdata=" + this.model.attributes.DATA_SOURCE_NEXT;
                    if (ccheck.app.m_bCInfo == true) {
                        $("a#id_menu_next").attr("href", strNext + "&m=cinfo");
                    }
                    else {
                        $("a#id_menu_next").attr("href", strNext);
                    }
                }
                else {
                    $("#id_menu_next").addClass("disabled");
                }
                this.render_notify_area();
            }
            return this;
        };
        return view_CCatalogHead;
    }(Backbone.View));
    ccheck.view_CCatalogHead = view_CCatalogHead;
    var view_CCatalogList = (function (_super) {
        __extends(view_CCatalogList, _super);
        function view_CCatalogList(options, dictTemplate) {
            var _this = _super.call(this, options) || this;
            _this.listenTo(_this.model, "change", _this.render);
            _this.m_dictTemplate = dictTemplate;
            return _this;
        }
        view_CCatalogList.prototype.events = function () {
            return {
                "click #id_view_list button.evt-favo-append": this.evt_favo_append,
                "click #id_view_list button.evt-show-circle": this.evt_show_circle,
                "click #id_view_list button.evt-edit-circle": this.evt_edit_circle,
                "click #id_view_list a.evt-edit-circle": this.evt_edit_circle,
                "click #id_view_list a.evt-drop-circle": this.evt_drop_circle
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
        view_CCatalogList.prototype.evt_edit_circle = function (oCEvt) {
            var nGrp = $(oCEvt.currentTarget).data("grp");
            var nIdx = $(oCEvt.currentTarget).data("idx");
            var _id = $(oCEvt.currentTarget).data("id");
            var _rev = $(oCEvt.currentTarget).data("rev");
            var strLayout = $(oCEvt.currentTarget).data("layout");
            var eMMode = ccheck.E_EDIT_MODE.INSERT;
            if (typeof _id !== "undefined") {
                eMMode = ccheck.E_EDIT_MODE.UPDATE;
            }
            ccheck.app.edit_circle(nGrp, nIdx, strLayout, _id, eMMode);
        };
        view_CCatalogList.prototype.evt_drop_circle = function (oCEvt) {
            var nGrp = $(oCEvt.currentTarget).data("grp");
            var nIdx = $(oCEvt.currentTarget).data("idx");
            var _id = $(oCEvt.currentTarget).data("id");
            var _rev = $(oCEvt.currentTarget).data("rev");
            var strLayout = $(oCEvt.currentTarget).data("layout");
            var eMMode = ccheck.E_EDIT_MODE.DELETE;
            ccheck.app.edit_circle(nGrp, nIdx, strLayout, _id, eMMode);
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
                    listTable.push('<tr id="id_row_list_' + nT + '_' + nD + '">');
                    listTable.push(this.render_table_dat_row(nT, nD));
                    listTable.push('</tr>');
                }
                $("#id_tbl_list_" + nT).html(listTable.join(''));
            }
        };
        view_CCatalogList.prototype.render_table_dat_row = function (grp, idx) {
            var oCDat = this.model.attributes.CIRCLE_LIST_DAT;
            var oCItem = oCDat[String(grp)][idx];
            var listTable = [];
            oCItem.grp = grp;
            oCItem.idx = idx;
            oCItem.owner = false;
            listTable.push('<td>' + this.m_dictTemplate["#id_tpl_favo_append"].render(oCItem) + '</td>');
            listTable.push('<td>' + this.m_dictTemplate["#id_tpl_layout"].render(oCItem) + '</td>');
            listTable.push('<td>');
            if (ccheck.app.m_bCInfo != true) {
                listTable.push(this.m_dictTemplate["#id_tpl_circleinfo"].render(oCItem));
            }
            else {
                if (ccheck.app.m_dictAuth != null) {
                    if (this.model.attributes.DATA_SOURCE == ccheck.app.m_dictAuth.DATA_SOURCE) {
                        if (ccheck.app.m_dictAuth.layout_list.indexOf(oCItem.layout) >= 0) {
                            oCItem.owner = true;
                        }
                        if (ccheck.app.m_dictAuth.layout_list.indexOf("EVENT_MANAGER") >= 0) {
                            oCItem.owner = true;
                        }
                    }
                }
                listTable.push(this.m_dictTemplate["#id_tpl_circleinfo"].render(oCItem));
                if (oCItem.layout in ccheck.app.m_dictCircleInfoDB) {
                    listTable.push('<small>');
                    for (var nCI = 0; nCI < ccheck.app.m_dictCircleInfoDB[oCItem.layout].length; nCI++) {
                        var oCCInfo = ccheck.app.m_dictCircleInfoDB[oCItem.layout][nCI];
                        listTable.push('<div>');
                        listTable.push(ccheck.render_cinfo(oCItem, ccheck.app.m_dictCircleInfoDB[oCItem.layout][nCI]));
                        listTable.push('</div>');
                    }
                    listTable.push('</small>');
                }
            }
            listTable.push('</td>');
            listTable.push('<td>' + this.m_dictTemplate["#id_tpl_show_circle_desc_1"].render(oCItem) + '</td>');
            return listTable.join('');
        };
        view_CCatalogList.prototype.render = function () {
            if (this.model.isValid() == false) {
                ccheck.app.m_collection_event_list.url = "/db/circlecheck/_design/catalog/_view/list_by_date";
                ccheck.app.m_collection_event_list.fetch({
                    data: {
                        descending: true,
                        limit: 30
                    }
                });
            }
            else {
                ccheck.app.m_collection_event_list.url = "/db/circlecheck/_design/catalog/_view/list";
                ccheck.app.m_collection_event_list.fetch({
                    data: {
                        descending: true,
                        startkey: JSON.stringify([this.model.attributes.EVENT_SERIES, "Z"]),
                        endkey: JSON.stringify([this.model.attributes.EVENT_SERIES, ""]),
                        limit: 30
                    }
                });
                this.render_table_tab();
                this.render_table_dat();
                $(".menu .item").tab();
                $(".menu .item").tab("change tab", "id_tab_0");
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
            var _this = _super.call(this, options) || this;
            _this.listenTo(_this.collection, "add", _this.render);
            _this.listenTo(_this.collection, "remove", _this.render);
            _this.m_dictTemplate = dictTemplate;
            return _this;
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
            $("#id_row_favo_" + nGrp + "_" + nIdx).toggleClass("positive");
        };
        view_CCircleFavo.prototype.render_table_tab = function () {
        };
        view_CCircleFavo.prototype.render_table_dat = function () {
            var listTable = [];
            for (var n = 0; n < this.collection.length; n++) {
                var oCItem = this.collection.models[n].attributes;
                listTable.push('<tr id="id_row_favo_' + oCItem.grp + '_' + oCItem.idx + '">');
                listTable.push(this.render_table_dat_row(oCItem.grp, oCItem.idx));
                listTable.push('</tr>');
            }
            $("#id_tbl_favo_0").html(listTable.join(''));
        };
        view_CCircleFavo.prototype.render_table_dat_row = function (grp, idx) {
            var listTable = [];
            for (var n = 0; n < this.collection.length; n++) {
                var oCItem = this.collection.models[n].attributes;
                if (oCItem.grp != grp)
                    continue;
                if (oCItem.idx != idx)
                    continue;
                listTable.push('<td>' + this.m_dictTemplate["#id_tpl_favo_remove"].render(oCItem) + '</td>');
                listTable.push('<td>' + this.m_dictTemplate["#id_tpl_layout"].render(oCItem) + '</td>');
                listTable.push('<td>');
                if (ccheck.app.m_bCInfo != true) {
                    listTable.push(this.m_dictTemplate["#id_tpl_circleinfo"].render(oCItem));
                }
                else {
                    listTable.push(this.m_dictTemplate["#id_tpl_circleinfo"].render(oCItem));
                    if (oCItem.layout in ccheck.app.m_dictCircleInfoDB) {
                        oCItem.owner = false;
                        listTable.push('<small>');
                        for (var nCI = 0; nCI < ccheck.app.m_dictCircleInfoDB[oCItem.layout].length; nCI++) {
                            var oCCInfo = ccheck.app.m_dictCircleInfoDB[oCItem.layout][nCI];
                            listTable.push('<div>');
                            listTable.push(ccheck.render_cinfo(oCItem, ccheck.app.m_dictCircleInfoDB[oCItem.layout][nCI]));
                            listTable.push('</div>');
                        }
                        listTable.push('</small>');
                    }
                }
                listTable.push('</td>');
                listTable.push('<td>' + this.m_dictTemplate["#id_tpl_show_circle_desc_2"].render(oCItem) + '</td>');
            }
            return listTable.join('');
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
            var _this = _super.call(this, options) || this;
            _this.m_hTimer = null;
            _this.m_strSearchKeyword = "";
            _this.m_dictTemplate = dictTemplate;
            return _this;
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
            if (oCItem.layout) {
                if (oCItem.layout.indexOf(strKeyword, 0) != -1)
                    bFound = true;
            }
            for (var n = 0; n < oCItem.circle_list.length; n++) {
                var oCDatItem = oCItem.circle_list[n];
                if (oCDatItem.circle) {
                    if (oCDatItem.circle.indexOf(strKeyword, 0) != -1)
                        bFound = true;
                }
                if (oCDatItem.writer) {
                    if (oCDatItem.writer.indexOf(strKeyword, 0) != -1)
                        bFound = true;
                }
                if (oCDatItem.url) {
                    if (oCDatItem.url.indexOf(strKeyword, 0) != -1)
                        bFound = true;
                }
            }
            if (ccheck.app.m_bCInfo == true) {
                if (oCItem.layout in ccheck.app.m_dictCircleInfoDB) {
                    for (var n = 0; n < ccheck.app.m_dictCircleInfoDB[oCItem.layout].length; n++) {
                        var oCCInfo = ccheck.app.m_dictCircleInfoDB[oCItem.layout][n];
                        var strCInfo = ccheck.render_cinfo(oCItem, oCCInfo);
                        if (strCInfo.indexOf(strKeyword, 0) != -1)
                            bFound = true;
                    }
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
                listTable.push('<td>');
                if (ccheck.app.m_bCInfo != true) {
                    listTable.push(this.m_dictTemplate["#id_tpl_circleinfo"].render(oCItem));
                }
                else {
                    listTable.push(this.m_dictTemplate["#id_tpl_circleinfo"].render(oCItem));
                    if (oCItem.layout in ccheck.app.m_dictCircleInfoDB) {
                        oCItem.owner = false;
                        listTable.push('<small>');
                        for (var nCI = 0; nCI < ccheck.app.m_dictCircleInfoDB[oCItem.layout].length; nCI++) {
                            var oCCInfo = ccheck.app.m_dictCircleInfoDB[oCItem.layout][nCI];
                            listTable.push('<div>');
                            listTable.push(ccheck.render_cinfo(oCItem, ccheck.app.m_dictCircleInfoDB[oCItem.layout][nCI]));
                            listTable.push('</div>');
                        }
                        listTable.push('</small>');
                    }
                }
                listTable.push('</td>');
                listTable.push('<td>' + this.m_dictTemplate["#id_tpl_show_circle_desc_1"].render(oCItem) + '</td>');
                listTable.push('</tr>');
            }
            $("#id_tbl_find_0").html(listTable.join(''));
            for (var n = 0; n < ccheck.app.m_collection_circle_favo.length; n++) {
                var oCItem = ccheck.app.m_collection_circle_favo.at(n).attributes;
                var strTargetId = "#id_row_find_" + oCItem.grp + "_" + oCItem.idx;
                $(strTargetId + " button.evt-favo-append").addClass("disabled");
                $(strTargetId).addClass("positive");
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