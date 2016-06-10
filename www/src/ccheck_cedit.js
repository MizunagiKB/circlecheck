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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ccheck;
(function (ccheck) {
    (function (E_CIRCLE_EDIT_CATEGORY) {
        E_CIRCLE_EDIT_CATEGORY[E_CIRCLE_EDIT_CATEGORY["MENU"] = 0] = "MENU";
        E_CIRCLE_EDIT_CATEGORY[E_CIRCLE_EDIT_CATEGORY["NEW_ITEM"] = 1] = "NEW_ITEM";
        E_CIRCLE_EDIT_CATEGORY[E_CIRCLE_EDIT_CATEGORY["INV_ITEM"] = 2] = "INV_ITEM";
        E_CIRCLE_EDIT_CATEGORY[E_CIRCLE_EDIT_CATEGORY["INFO"] = 3] = "INFO";
        E_CIRCLE_EDIT_CATEGORY[E_CIRCLE_EDIT_CATEGORY["ABSENT"] = 4] = "ABSENT";
    })(ccheck.E_CIRCLE_EDIT_CATEGORY || (ccheck.E_CIRCLE_EDIT_CATEGORY = {}));
    var E_CIRCLE_EDIT_CATEGORY = ccheck.E_CIRCLE_EDIT_CATEGORY;
    var model_CCircleEdit = (function (_super) {
        __extends(model_CCircleEdit, _super);
        function model_CCircleEdit(attributes, options) {
            _super.call(this, attributes, options);
        }
        model_CCircleEdit.prototype.reset = function () {
            this.set("cedit_date", "");
            this.set("cedit_category", E_CIRCLE_EDIT_CATEGORY.MENU);
            this.unset("cedit_url");
            this.unset("cedit_txt");
            this.set("cedit_rating", false);
        };
        return model_CCircleEdit;
    }(Backbone.Model));
    ccheck.model_CCircleEdit = model_CCircleEdit;
    var view_CCircleEdit = (function (_super) {
        __extends(view_CCircleEdit, _super);
        function view_CCircleEdit(options, dictTemplate) {
            _super.call(this, options);
            this.listenTo(this.model, "change", this.render);
        }
        view_CCircleEdit.prototype.events = function () {
            return {
                "changeDate #id_tpl_circle_edit input#id_date_circle_edit": this.evt_view_change,
                "shown.bs.tab #id_tpl_circle_edit a[data-toggle=\"tab\"]": this.evt_view_change,
                "keyup #id_tpl_circle_edit input#id_text_circle_edit": this.evt_view_change,
                "change #id_tpl_circle_edit input#id_check_circle_edit_r18": this.evt_view_change,
            };
        };
        view_CCircleEdit.prototype.evt_view_change = function (oCEvt) {
            this.model.set("cedit_date", $("#id_date_circle_edit").val());
            if ($("#id_category_1").hasClass("active") == true) {
                this.model.set("cedit_category", E_CIRCLE_EDIT_CATEGORY.MENU);
            }
            else if ($("#id_category_2").hasClass("active") == true) {
                this.model.set("cedit_category", E_CIRCLE_EDIT_CATEGORY.NEW_ITEM);
            }
            else if ($("#id_category_3").hasClass("active") == true) {
                this.model.set("cedit_category", E_CIRCLE_EDIT_CATEGORY.INV_ITEM);
            }
            else if ($("#id_category_4").hasClass("active") == true) {
                this.model.set("cedit_category", E_CIRCLE_EDIT_CATEGORY.INFO);
            }
            else if ($("#id_category_5").hasClass("active") == true) {
                this.model.set("cedit_category", E_CIRCLE_EDIT_CATEGORY.ABSENT);
            }
            else {
                this.model.set("cedit_category", E_CIRCLE_EDIT_CATEGORY.INFO);
            }
            if ($("#id_text_circle_edit").val().match("^https?:\/\/")) {
                this.model.set("cedit_url", $("#id_text_circle_edit").val());
                this.model.unset("cedit_txt");
            }
            else {
                this.model.unset("cedit_url");
                this.model.set("cedit_txt", $("#id_text_circle_edit").val());
            }
            this.model.set("cedit_rating", $("#id_check_circle_edit_r18").is(":checked"));
        };
        view_CCircleEdit.prototype.ui_update = function () {
            $("#id_date_circle_edit").val(this.model.get("cedit_date"));
            if (this.model.get("cedit_url")) {
                $("#id_text_circle_edit").val(this.model.get("cedit_url"));
            }
            if (this.model.get("cedit_txt")) {
                $("#id_text_circle_edit").val(this.model.get("cedit_txt"));
            }
            $("#id_category_1").removeClass("active");
            $("#id_category_2").removeClass("active");
            $("#id_category_3").removeClass("active");
            $("#id_category_4").removeClass("active");
            $("#id_category_5").removeClass("active");
            switch (this.model.get("cedit_category")) {
                case E_CIRCLE_EDIT_CATEGORY.MENU:
                    $("#id_category_1").addClass("active");
                    break;
                case E_CIRCLE_EDIT_CATEGORY.NEW_ITEM:
                    $("#id_category_2").addClass("active");
                    break;
                case E_CIRCLE_EDIT_CATEGORY.INV_ITEM:
                    $("#id_category_3").addClass("active");
                    break;
                case E_CIRCLE_EDIT_CATEGORY.INFO:
                    $("#id_category_4").addClass("active");
                    break;
                case E_CIRCLE_EDIT_CATEGORY.ABSENT:
                    $("#id_category_5").addClass("active");
                    break;
                default:
                    $("#id_category_4").addClass("active");
                    break;
            }
            $("#id_check_circle_edit_r18").prop("checked", this.model.get("cedit_rating"));
        };
        view_CCircleEdit.prototype.render = function () {
            var preview_text = "";
            preview_text += this.model.attributes.cedit_date;
            switch (this.model.attributes.cedit_category) {
                case E_CIRCLE_EDIT_CATEGORY.MENU:
                    preview_text += "&nbsp;";
                    preview_text += "お品書き";
                    break;
                case E_CIRCLE_EDIT_CATEGORY.NEW_ITEM:
                    preview_text += "&nbsp;";
                    preview_text += "新刊・新作";
                    break;
                case E_CIRCLE_EDIT_CATEGORY.INV_ITEM:
                    preview_text += "&nbsp;";
                    preview_text += "既刊・在庫";
                    break;
                case E_CIRCLE_EDIT_CATEGORY.INFO:
                    preview_text += "&nbsp;";
                    preview_text += "お知らせ";
                    break;
                default:
                    preview_text += "&nbsp;";
                    preview_text += "欠席";
                    break;
            }
            if (this.model.attributes.cedit_txt) {
                preview_text += "&nbsp;";
                preview_text += this.model.attributes.cedit_txt;
            }
            if (this.model.attributes.cedit_rating == true) {
                preview_text += "&nbsp;*R18";
            }
            if (this.model.attributes.cedit_url) {
                preview_text = "<a href=\"" + this.model.attributes.cedit_url + "\">" + preview_text + "</a>";
            }
            $("#id_preview_circle_edit").html(preview_text);
            return this;
        };
        return view_CCircleEdit;
    }(Backbone.View));
    ccheck.view_CCircleEdit = view_CCircleEdit;
})(ccheck || (ccheck = {}));
//# sourceMappingURL=ccheck_cedit.js.map