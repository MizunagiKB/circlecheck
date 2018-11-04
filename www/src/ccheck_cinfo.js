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
            data-grp="{{grp}}" data-idx="{{idx}}" .evt-show-desc
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
    var E_CIRCLE_INFO_CATEGORY;
    (function (E_CIRCLE_INFO_CATEGORY) {
        E_CIRCLE_INFO_CATEGORY[E_CIRCLE_INFO_CATEGORY["MENU"] = 0] = "MENU";
        E_CIRCLE_INFO_CATEGORY[E_CIRCLE_INFO_CATEGORY["NEW_ITEM"] = 1] = "NEW_ITEM";
        E_CIRCLE_INFO_CATEGORY[E_CIRCLE_INFO_CATEGORY["INV_ITEM"] = 2] = "INV_ITEM";
        E_CIRCLE_INFO_CATEGORY[E_CIRCLE_INFO_CATEGORY["INFO"] = 3] = "INFO";
        E_CIRCLE_INFO_CATEGORY[E_CIRCLE_INFO_CATEGORY["ABSENT"] = 4] = "ABSENT";
    })(E_CIRCLE_INFO_CATEGORY = ccheck.E_CIRCLE_INFO_CATEGORY || (ccheck.E_CIRCLE_INFO_CATEGORY = {}));
    var TPL_OWNER_EDIT = Hogan.compile(''
        + '&nbsp;&nbsp;<a data-grp="{{grp}}" data-idx="{{idx}}" data-id="{{_id}}" data-rev="{{_rev}}" data-layout="{{layout}}" class="evt-edit-circle" href="javascript:void(0);"><i class="edit icon"></i></a>'
        + '&nbsp;&nbsp;<a data-grp="{{grp}}" data-idx="{{idx}}" data-id="{{_id}}" data-rev="{{_rev}}" data-layout="{{layout}}" class="evt-drop-circle" href="javascript:void(0);"><i class="close icon"></i></a>');
    var model_CCircleInfo = (function (_super) {
        __extends(model_CCircleInfo, _super);
        function model_CCircleInfo(attributes, options) {
            return _super.call(this, attributes, options) || this;
        }
        model_CCircleInfo.prototype.reset = function () {
            this.unset("_id");
            this.unset("_rev");
            this.set("DATA_SOURCE", "");
            this.set("layout", "");
            this.set("cedit_date", "");
            this.set("cedit_category", E_CIRCLE_INFO_CATEGORY.MENU);
            this.set("cedit_url", "");
            this.set("cedit_txt", "");
            this.set("cedit_rating", false);
        };
        return model_CCircleInfo;
    }(Backbone.Model));
    ccheck.model_CCircleInfo = model_CCircleInfo;
    var view_CCircleEdit = (function (_super) {
        __extends(view_CCircleEdit, _super);
        function view_CCircleEdit(options, dictTemplate) {
            var _this = _super.call(this, options) || this;
            _this.listenTo(_this.model, "change", _this.render);
            return _this;
        }
        view_CCircleEdit.prototype.events = function () {
            return {
                "click div#id_btn_circle_info_insert": this.evt_insert,
                "click div#id_btn_circle_info_update": this.evt_update,
                "click div#id_btn_circle_info_delete": this.evt_delete,
                "changeDate #id_tpl_circle_edit input#id_date_circle_edit": this.evt_view_change,
                "click a#id_category_1": this.evt_menu_change,
                "click a#id_category_2": this.evt_menu_change,
                "click a#id_category_3": this.evt_menu_change,
                "click a#id_category_4": this.evt_menu_change,
                "click a#id_category_5": this.evt_menu_change,
                "keyup #id_tpl_circle_edit input#id_txt_circle_edit": this.evt_view_change,
                "keyup #id_tpl_circle_edit input#id_url_circle_edit": this.evt_view_change,
                "change #id_tpl_circle_edit input#id_check_circle_edit_r18": this.evt_view_change,
            };
        };
        view_CCircleEdit.prototype.ajax_post = function (oCEvt, eEMode) {
            var nGrp = $(oCEvt.currentTarget).data("grp");
            var nIdx = $(oCEvt.currentTarget).data("idx");
            var strUrl = "";
            var oXhr = null;
            switch (eEMode) {
                case ccheck.E_EDIT_MODE.INSERT:
                    strUrl = "iface_cinfo.php?order=insert";
                    break;
                case ccheck.E_EDIT_MODE.UPDATE:
                    strUrl = "iface_cinfo.php?order=update";
                    break;
                case ccheck.E_EDIT_MODE.DELETE:
                    strUrl = "iface_cinfo.php?order=delete";
                    break;
            }
            oXhr = $.ajax({
                type: "POST",
                url: strUrl,
                data: this.model.attributes,
                dataType: "json"
            });
            oXhr.ccheck_dialog_id = "#id_tpl_circle_edit";
            oXhr.ccheck_notify_id = "#id_circle_edit_notify_area";
            oXhr.ccheck_model = this.model;
            oXhr.ccheck_data_grp = nGrp;
            oXhr.ccheck_data_idx = nIdx;
            oXhr.done(function (jsonData, strStatus, oXhr) {
                var nGrp = oXhr.ccheck_data_grp;
                var nIdx = oXhr.ccheck_data_idx;
                var nCheckCount = 0;
                var bResult = false;
                if (typeof jsonData === "object") {
                    if ("id" in jsonData)
                        nCheckCount += 1;
                    if ("rev" in jsonData)
                        nCheckCount += 1;
                    if ("ok" in jsonData) {
                        if (jsonData["ok"] == true) {
                            nCheckCount += 1;
                        }
                    }
                }
                if (nCheckCount == 3) {
                    oXhr.ccheck_model.set("_id", jsonData.id);
                    oXhr.ccheck_model.set("_rev", jsonData.rev);
                    switch (eEMode) {
                        case ccheck.E_EDIT_MODE.INSERT:
                            bResult = ccheck.app.insert_circle_info_db(oXhr.ccheck_model.get("layout"), jsonData.id, oXhr.ccheck_model);
                            break;
                        case ccheck.E_EDIT_MODE.UPDATE:
                            bResult = ccheck.app.update_circle_info_db(oXhr.ccheck_model.get("layout"), jsonData.id, oXhr.ccheck_model);
                            break;
                        case ccheck.E_EDIT_MODE.DELETE:
                            bResult = ccheck.app.delete_circle_info_db(oXhr.ccheck_model.get("layout"), jsonData.id, oXhr.ccheck_model);
                            break;
                    }
                    if (bResult == true) {
                        var strLst = "#id_row_list_" + nGrp + "_" + nIdx;
                        var strFav = "#id_row_favo_" + nGrp + "_" + nIdx;
                        $(strLst).html(ccheck.app.m_view_catalog_list.render_table_dat_row(nGrp, nIdx));
                        $(strFav).html(ccheck.app.m_view_circle_favo.render_table_dat_row(nGrp, nIdx));
                        if ($(strLst).hasClass("info") == true) {
                            $(strLst + " button.evt-favo-append").addClass("disabled");
                        }
                        $(oXhr.ccheck_dialog_id).modal("hide");
                    }
                }
                if (bResult != true) {
                    $(oXhr.ccheck_notify_id).html(''
                        + '<div class="alert alert-danger alert-dismissable">'
                        + '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'
                        + '<strong><span class="glyphicon glyphicon-warning-sign"></span></strong>&nbsp;処理に失敗しました'
                        + '</div>');
                }
            }).fail(function (oXhr, strStatus, errThrown) {
                $(oXhr.ccheck_notify_id).html(''
                    + '<div class="alert alert-danger alert-dismissable">'
                    + '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'
                    + '<strong><span class="glyphicon glyphicon-warning-sign"></span></strong>&nbsp;' + strStatus
                    + '</div>');
            });
        };
        view_CCircleEdit.prototype.evt_insert = function (oCEvt) {
            this.ajax_post(oCEvt, ccheck.E_EDIT_MODE.INSERT);
        };
        view_CCircleEdit.prototype.evt_update = function (oCEvt) {
            this.ajax_post(oCEvt, ccheck.E_EDIT_MODE.UPDATE);
        };
        view_CCircleEdit.prototype.evt_delete = function (oCEvt) {
            this.ajax_post(oCEvt, ccheck.E_EDIT_MODE.DELETE);
        };
        view_CCircleEdit.prototype.evt_menu_change = function (oCEvt) {
            $("#id_category_1").removeClass("active");
            $("#id_category_2").removeClass("active");
            $("#id_category_3").removeClass("active");
            $("#id_category_4").removeClass("active");
            $("#id_category_5").removeClass("active");
            $("#" + oCEvt.currentTarget.id).addClass("active");
            this.evt_view_change(oCEvt);
        };
        view_CCircleEdit.prototype.evt_view_change = function (oCEvt) {
            this.model.set("cedit_date", $("#id_date_circle_edit").val());
            if ($("#id_category_1").hasClass("active") == true) {
                this.model.set("cedit_category", E_CIRCLE_INFO_CATEGORY.MENU);
            }
            else if ($("#id_category_2").hasClass("active") == true) {
                this.model.set("cedit_category", E_CIRCLE_INFO_CATEGORY.NEW_ITEM);
            }
            else if ($("#id_category_3").hasClass("active") == true) {
                this.model.set("cedit_category", E_CIRCLE_INFO_CATEGORY.INV_ITEM);
            }
            else if ($("#id_category_4").hasClass("active") == true) {
                this.model.set("cedit_category", E_CIRCLE_INFO_CATEGORY.INFO);
            }
            else if ($("#id_category_5").hasClass("active") == true) {
                this.model.set("cedit_category", E_CIRCLE_INFO_CATEGORY.ABSENT);
            }
            else {
                this.model.set("cedit_category", E_CIRCLE_INFO_CATEGORY.INFO);
            }
            this.model.set("cedit_txt", $("#id_txt_circle_edit").val());
            this.model.set("cedit_url", $("#id_url_circle_edit").val());
            if ($("#id_check_circle_edit_r18").is(":checked") == true) {
                this.model.set("cedit_rating", 1);
            }
            else {
                this.model.set("cedit_rating", 0);
            }
        };
        view_CCircleEdit.prototype.ui_update = function (grp, idx, eEMode) {
            var o;
            var TPL_FOOTER = Hogan.compile(''
                + '<div id="{{id}}" class="{{class}}" data-grp="{{grp}}" data-idx="{{idx}}"><i class="check icon"></i>&nbsp;OK</div>'
                + '<div class="ui cancel button">Cancel</div>');
            $("#id_circle_edit_notify_area").html("");
            switch (eEMode) {
                case ccheck.E_EDIT_MODE.INSERT:
                    $("#id_circle_edit_form").show();
                    $("#id_dlg_circle_edit_caption").html("サークル通知情報の追加");
                    $("#id_circle_edit_footer").html(TPL_FOOTER.render({
                        "id": "id_btn_circle_info_insert",
                        "class": "ui primary button",
                        "grp": grp,
                        "idx": idx
                    }));
                    break;
                case ccheck.E_EDIT_MODE.UPDATE:
                    $("#id_circle_edit_form").show();
                    $("#id_dlg_circle_edit_caption").html("サークル通知情報の編集");
                    $("#id_circle_edit_footer").html(TPL_FOOTER.render({
                        "id": "id_btn_circle_info_update",
                        "class": "ui primary button",
                        "grp": grp,
                        "idx": idx
                    }));
                    break;
                case ccheck.E_EDIT_MODE.DELETE:
                    $("#id_circle_edit_form").hide();
                    $("#id_dlg_circle_edit_caption").html("<span class=\"text-danger\">サークル通知情報の削除</span>");
                    $("#id_circle_edit_footer").html(TPL_FOOTER.render({
                        "id": "id_btn_circle_info_delete",
                        "class": "ui red button",
                        "grp": grp,
                        "idx": idx
                    }));
                    break;
            }
            o = $("#id_date_circle_edit");
            o.val(this.model.get("cedit_date"));
            $("#id_url_circle_edit").val(this.model.get("cedit_url"));
            $("#id_txt_circle_edit").val(this.model.get("cedit_txt"));
            $("#id_category_1").removeClass("active");
            $("#id_category_2").removeClass("active");
            $("#id_category_3").removeClass("active");
            $("#id_category_4").removeClass("active");
            $("#id_category_5").removeClass("active");
            switch (this.model.get("cedit_category")) {
                case E_CIRCLE_INFO_CATEGORY.MENU:
                    $("#id_category_1").addClass("active");
                    break;
                case E_CIRCLE_INFO_CATEGORY.NEW_ITEM:
                    $("#id_category_2").addClass("active");
                    break;
                case E_CIRCLE_INFO_CATEGORY.INV_ITEM:
                    $("#id_category_3").addClass("active");
                    break;
                case E_CIRCLE_INFO_CATEGORY.INFO:
                    $("#id_category_4").addClass("active");
                    break;
                case E_CIRCLE_INFO_CATEGORY.ABSENT:
                    $("#id_category_5").addClass("active");
                    break;
                default:
                    $("#id_category_4").addClass("active");
                    break;
            }
            if (this.model.get("cedit_rating") == 1) {
                $("#id_check_circle_edit_r18").prop("checked", true);
            }
            else {
                $("#id_check_circle_edit_r18").prop("checked", false);
            }
        };
        view_CCircleEdit.prototype.render = function () {
            $("#id_preview_circle_edit").html(render_cinfo(null, this.model));
            $("#id_preview_circle_drop").html(render_cinfo(null, this.model));
            return this;
        };
        return view_CCircleEdit;
    }(Backbone.View));
    ccheck.view_CCircleEdit = view_CCircleEdit;
    function render_cinfo(oCItem, oCCInfo) {
        var preview_text = "";
        preview_text += oCCInfo.get("cedit_date");
        switch (oCCInfo.get("cedit_category")) {
            case E_CIRCLE_INFO_CATEGORY.MENU:
                preview_text += "&nbsp;";
                preview_text += "お品書き";
                break;
            case E_CIRCLE_INFO_CATEGORY.NEW_ITEM:
                preview_text += "&nbsp;";
                preview_text += "新刊・新作";
                break;
            case E_CIRCLE_INFO_CATEGORY.INV_ITEM:
                preview_text += "&nbsp;";
                preview_text += "既刊・在庫";
                break;
            case E_CIRCLE_INFO_CATEGORY.INFO:
                preview_text += "&nbsp;";
                preview_text += "お知らせ";
                break;
            case E_CIRCLE_INFO_CATEGORY.ABSENT:
                preview_text += "&nbsp;";
                preview_text += "欠席";
                break;
            default:
                preview_text += "&nbsp;";
                preview_text += "お知らせ";
                break;
        }
        if (oCCInfo.has("cedit_txt")) {
            if (oCCInfo.get("cedit_txt").length > 0) {
                preview_text += "&nbsp;";
                preview_text += $("<div>").text(oCCInfo.get("cedit_txt")).html();
            }
        }
        if (oCCInfo.get("cedit_rating") == true) {
            preview_text += "&nbsp;*R18";
        }
        if (oCCInfo.has("cedit_url") == true) {
            var strUrl = oCCInfo.get("cedit_url");
            if (strUrl.match("^https?:\/\/")) {
                preview_text = "<a href=\"" + oCCInfo.get("cedit_url") + "\" target=\"_blank\">" + preview_text + "</a>";
            }
        }
        if (oCItem != null) {
            if (oCItem.owner == true) {
                preview_text += TPL_OWNER_EDIT.render({
                    "grp": oCItem.grp,
                    "idx": oCItem.idx,
                    "_id": oCCInfo.get("_id"),
                    "_rev": oCCInfo.get("_rev"),
                    "layout": oCItem.layout
                });
            }
        }
        return "&nbsp;<span class=\"glyphicon glyphicon-comment\"></span>&nbsp;" + preview_text;
    }
    ccheck.render_cinfo = render_cinfo;
})(ccheck || (ccheck = {}));
//# sourceMappingURL=ccheck_cinfo.js.map