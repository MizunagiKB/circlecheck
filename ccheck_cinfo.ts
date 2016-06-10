// ===========================================================================
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
// -------------------------------------------------------------- reference(s)
// ------------------------------------------------ http://definitelytyped.org
/// <reference path="../DefinitelyTyped/jquery/jquery.d.ts"/>
/// <reference path="../DefinitelyTyped/bootstrap/bootstrap.d.ts"/>
/// <reference path="../DefinitelyTyped/backbone/backbone.d.ts"/>
/// <reference path="./DefinitelyTyped/hogan/hogan.d.ts"/>
/// <reference path="./ccheck.ts"/>

// ---------------------------------------------------------------- declare(s)

module ccheck {

    // --------------------------------------------------------------- enum(s)
    export enum E_CIRCLE_INFO_CATEGORY {
        MENU,
        NEW_ITEM,
        INV_ITEM,
        INFO,
        ABSENT
    }

    export enum E_EDIT_MODE {
        INSERT,
        UPDATE,
        DELETE
    }

    // ---------------------------------------------------------- interface(s)
    export interface ICIRCLE_INFO {
        _id?: string;
        _rev?: string;
        DATA_SOURCE: string;
        layout: string;
        cedit_date: string;
        cedit_category: E_CIRCLE_INFO_CATEGORY;
        cedit_url: string;
        cedit_txt: string;
        cedit_rating: boolean;
    }

    const TPL_OWNER_EDIT = Hogan.compile(
        ''
        + '&nbsp;&nbsp;<a data-grp="{{grp}}" data-idx="{{idx}}" data-id="{{_id}}" data-rev="{{_rev}}" data-layout="{{layout}}" class="text-info evt-edit-circle" href="javascript:void(0);"><span class="glyphicon glyphicon-edit"></span></a>'
        + '&nbsp;&nbsp;<a data-grp="{{grp}}" data-idx="{{idx}}" data-id="{{_id}}" data-rev="{{_rev}}" data-layout="{{layout}}" class="text-danger evt-drop-circle" href="javascript:void(0);"><span class="glyphicon glyphicon-remove"></span></a>'
    );

    // ------------------------------------------------------ Global Object(s)
    // -------------------------------------------------------------- class(s)
    // -----------------------------------------------------------------------
    /*!
     */
    export class model_CCircleInfo extends Backbone.Model {
        //
        constructor(attributes?: any, options?: any) {
            super(attributes, options);
        }

        reset() {
            this.unset("_id");
            this.unset("_rev");
            this.set("DATA_SOURCE", "");
            this.set("layout", "");

            this.set("cedit_date", "");
            this.set("cedit_category", E_CIRCLE_INFO_CATEGORY.MENU);
            this.set("cedit_url", "");
            this.set("cedit_txt", "");
            this.set("cedit_rating", false);
        }
    }

    // -----------------------------------------------------------------------
    /*!
     */
    export class view_CCircleEdit extends Backbone.View<model_CCircleInfo> {
        //
        constructor(options?: Backbone.ViewOptions<model_CCircleInfo>, dictTemplate?: any) {
            super(options);

            this.listenTo(this.model, "change", this.render);
        }

        //
        events(): Backbone.EventsHash {
            return {
                "click button#id_btn_circle_info_insert": this.evt_insert,
                "click button#id_btn_circle_info_update": this.evt_update,
                "click button#id_btn_circle_info_delete": this.evt_delete,
                "changeDate #id_tpl_circle_edit input#id_date_circle_edit": this.evt_view_change,
                "shown.bs.tab #id_tpl_circle_edit a[data-toggle=\"tab\"]": this.evt_view_change,
                "keyup #id_tpl_circle_edit input#id_txt_circle_edit": this.evt_view_change,
                "keyup #id_tpl_circle_edit input#id_url_circle_edit": this.evt_view_change,
                "change #id_tpl_circle_edit input#id_check_circle_edit_r18": this.evt_view_change,
            }
        }

        ajax_post(oCEvt: any, eEMode: E_EDIT_MODE): void {
            const nGrp: number = $(oCEvt.currentTarget).data("grp");
            const nIdx: number = $(oCEvt.currentTarget).data("idx");
            let strUrl: string = "";
            let oXhr: any = null;

            switch (eEMode) {
                case E_EDIT_MODE.INSERT: strUrl = "iface_cinfo.php?order=insert"; break;
                case E_EDIT_MODE.UPDATE: strUrl = "iface_cinfo.php?order=update"; break;
                case E_EDIT_MODE.DELETE: strUrl = "iface_cinfo.php?order=delete"; break;
            }

            oXhr = $.ajax(
                {
                    type: "POST",
                    url: strUrl,
                    data: this.model.attributes,
                    dataType: "json"
                }
            )

            oXhr.ccheck_dialog_id = "#id_tpl_circle_edit";
            oXhr.ccheck_notify_id = "#id_circle_edit_notify_area";
            oXhr.ccheck_model = this.model;
            oXhr.ccheck_data_grp = nGrp;
            oXhr.ccheck_data_idx = nIdx;
            oXhr.done(
                function(jsonData: any, strStatus: string, oXhr: any) {
                    const nGrp: number = oXhr.ccheck_data_grp;
                    const nIdx: number = oXhr.ccheck_data_idx;
                    let nCheckCount: number = 0;
                    let bResult: boolean = false;

                    if (typeof jsonData === "object") {
                        if ("id" in jsonData) nCheckCount += 1;
                        if ("rev" in jsonData) nCheckCount += 1;
                        if ("ok" in jsonData) {
                            if (jsonData["ok"] == true) {
                                nCheckCount += 1;
                            }
                        }
                    }

                    if (nCheckCount == 3) {

                        switch (eEMode) {
                            case E_EDIT_MODE.INSERT:
                                bResult = app.insert_circle_info_db(
                                    oXhr.ccheck_model.get("layout"),
                                    jsonData._id,
                                    oXhr.ccheck_model
                                );
                                break;
                            case E_EDIT_MODE.UPDATE:
                                bResult = app.update_circle_info_db(
                                    oXhr.ccheck_model.get("layout"),
                                    jsonData._id,
                                    oXhr.ccheck_model
                                );
                                break;
                            case E_EDIT_MODE.DELETE:
                                bResult = app.delete_circle_info_db(
                                    oXhr.ccheck_model.get("layout"),
                                    jsonData._id,
                                    oXhr.ccheck_model
                                );
                                break;
                        }

                        if (bResult == true) {
                            let strLst: string = "#id_row_list_" + nGrp + "_" + nIdx;
                            let strFav: string = "#id_row_favo_" + nGrp + "_" + nIdx;

                            $(strLst).html(
                                app.m_view_catalog_list.render_table_dat_row(nGrp, nIdx)
                            )
                            $(strLst).html(
                                app.m_view_circle_favo.render_table_dat_row(nGrp, nIdx)
                            )

                            if ($(strLst).hasClass("info") == true) {
                                $(strLst + " button.evt-favo-append").addClass("disabled");
                            }

                            $(oXhr.ccheck_dialog_id).modal("hide");
                        }
                    }

                    if (bResult != true) {
                        $(oXhr.ccheck_notify_id).html(
                            ''
                            + '<div class="alert alert-danger alert-dismissable">'
                            + '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'
                            + '<strong><span class="glyphicon glyphicon-warning-sign"></span></strong>&nbsp;処理に失敗しました'
                            + '</div>'
                        );
                    }
                }
            ).fail(
                function(oXhr: any, strStatus: string, errThrown: any) {
                    $(oXhr.ccheck_notify_id).html(
                        ''
                        + '<div class="alert alert-danger alert-dismissable">'
                        + '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'
                        + '<strong><span class="glyphicon glyphicon-warning-sign"></span></strong>&nbsp;処理に失敗しました'
                        + '</div>'
                    );
                }
                );
        }

        //http://docs.couchdb.org/en/1.6.1/api/database/common.html
        evt_insert(oCEvt: any): void {
            this.ajax_post(oCEvt, E_EDIT_MODE.INSERT);
        }

        evt_update(oCEvt: any): void {
            this.ajax_post(oCEvt, E_EDIT_MODE.UPDATE);
        }

        evt_delete(oCEvt: any): void {
            this.ajax_post(oCEvt, E_EDIT_MODE.DELETE);
        }

        evt_view_change(oCEvt: any): void {

            this.model.set("cedit_date", $("#id_date_circle_edit").val());

            if ($("#id_category_1").hasClass("active") == true) {
                this.model.set("cedit_category", E_CIRCLE_INFO_CATEGORY.MENU);
            } else if ($("#id_category_2").hasClass("active") == true) {
                this.model.set("cedit_category", E_CIRCLE_INFO_CATEGORY.NEW_ITEM);
            } else if ($("#id_category_3").hasClass("active") == true) {
                this.model.set("cedit_category", E_CIRCLE_INFO_CATEGORY.INV_ITEM);
            } else if ($("#id_category_4").hasClass("active") == true) {
                this.model.set("cedit_category", E_CIRCLE_INFO_CATEGORY.INFO);
            } else if ($("#id_category_5").hasClass("active") == true) {
                this.model.set("cedit_category", E_CIRCLE_INFO_CATEGORY.ABSENT);
            } else {
                this.model.set("cedit_category", E_CIRCLE_INFO_CATEGORY.INFO);
            }

            this.model.set("cedit_txt", $("#id_txt_circle_edit").val());
            this.model.set("cedit_url", $("#id_url_circle_edit").val());

            this.model.set("cedit_rating", $("#id_check_circle_edit_r18").is(":checked"));
        }

        //
        ui_update(grp: number, idx: number, eEMode: E_EDIT_MODE) {
            let o: any;
            let TPL_FOOTER: any = Hogan.compile(
                ''
                + '<button id="{{id}}" class="{{class}}" data-grp="{{grp}}" data-idx="{{idx}}"><span class="glyphicon glyphicon-ok"></span>&nbsp;OK</button>'
                + '<button type="button" class="btn btn-default" data-dismiss="modal" aria-hidden="true">Cancel</button>'
            );

            $("#id_circle_edit_notify_area").html("");

            switch (eEMode) {

                case E_EDIT_MODE.INSERT:
                    $("#id_circle_edit_form").show();
                    $("#id_dlg_circle_edit_caption").html("サークル通知情報の追加");
                    $("#id_circle_edit_footer").html(
                        TPL_FOOTER.render(
                            {
                                "id": "id_btn_circle_info_insert",
                                "class": "btn btn-primary",
                                "grp": grp,
                                "idx": idx
                            }
                        )
                    );
                    break;

                case E_EDIT_MODE.UPDATE:
                    $("#id_circle_edit_form").show();
                    $("#id_dlg_circle_edit_caption").html("サークル通知情報の編集");
                    $("#id_circle_edit_footer").html(
                        TPL_FOOTER.render(
                            {
                                "id": "id_btn_circle_info_update",
                                "class": "btn btn-primary",
                                "grp": grp,
                                "idx": idx
                            }
                        )
                    );
                    break;

                case E_EDIT_MODE.DELETE:
                    $("#id_circle_edit_form").hide();
                    $("#id_dlg_circle_edit_caption").html("<span class=\"text-danger\">サークル通知情報の削除</span>");
                    $("#id_circle_edit_footer").html(
                        TPL_FOOTER.render(
                            {
                                "id": "id_btn_circle_info_delete",
                                "class": "btn btn-danger",
                                "grp": grp,
                                "idx": idx
                            }
                        )
                    );
                    break;
            }

            o = $("#id_date_circle_edit");
            o.val(this.model.get("cedit_date"));
            o.datepicker("update", this.model.get("cedit_date"));

            $("#id_url_circle_edit").val(this.model.get("cedit_url"));
            $("#id_txt_circle_edit").val(this.model.get("cedit_txt"));

            $("#id_category_1").removeClass("active");
            $("#id_category_2").removeClass("active");
            $("#id_category_3").removeClass("active");
            $("#id_category_4").removeClass("active");
            $("#id_category_5").removeClass("active");

            switch (this.model.get("cedit_category")) {
                case E_CIRCLE_INFO_CATEGORY.MENU: $("#id_category_1").addClass("active"); break;
                case E_CIRCLE_INFO_CATEGORY.NEW_ITEM: $("#id_category_2").addClass("active"); break;
                case E_CIRCLE_INFO_CATEGORY.INV_ITEM: $("#id_category_3").addClass("active"); break;
                case E_CIRCLE_INFO_CATEGORY.INFO: $("#id_category_4").addClass("active"); break;
                case E_CIRCLE_INFO_CATEGORY.ABSENT: $("#id_category_5").addClass("active"); break;
                default: $("#id_category_4").addClass("active"); break;
            }

            $("#id_check_circle_edit_r18").prop("checked", this.model.get("cedit_rating"));
        }

        //
        render() {

            $("#id_preview_circle_edit").html(render_cinfo(null, this.model));

            return this;
        }
    }

    // =======================================================================
    /*!
     */
    export function render_cinfo(oCItem: ICIRCLE_LIST_DAT, oCCInfo: model_CCircleInfo): string {
        let preview_text: string = "";

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
            let strUrl: string = oCCInfo.get("cedit_url");
            if (strUrl.match("^https?:\/\/")) {
                preview_text = "<a href=\"" + oCCInfo.get("cedit_url") + "\">" + preview_text + "</a>";
            }
        }

        if (oCItem != null) {
            if (oCItem.owner == true) {
                preview_text += TPL_OWNER_EDIT.render(
                    {
                        "grp": oCItem.grp,
                        "idx": oCItem.idx,
                        "_id": oCCInfo.get("_id"),
                        "_rev": oCCInfo.get("_rev"),
                        "layout": oCItem.layout
                    }
                );
            }
        }

        return "<span class=\"glyphicon glyphicon-info-sign\"></span>&nbsp;" + preview_text;
    }
}

// --------------------------------------------------------------------- [EOF]
