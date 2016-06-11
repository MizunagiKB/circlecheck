// ===========================================================================
/*!
 * @brief CircleCheck
 * @author @MizunagiKB
 */
// -------------------------------------------------------------- reference(s)
/// <reference path="../DefinitelyTyped/jquery/jquery.d.ts"/>
/// <reference path="../DefinitelyTyped/bootstrap/bootstrap.d.ts"/>
/// <reference path="../DefinitelyTyped/backbone/backbone.d.ts"/>
/// <reference path="./DefinitelyTyped/hogan/hogan.d.ts"/>
/// <reference path="./ccheck_model.ts"/>
/// <reference path="./ccheck_cdesc.ts"/>

// ---------------------------------------------------------------- declare(s)

module ccheck {

    // ---------------------------------------------------------- interface(s)
    interface IAUTH {
        twitter_user_id: string;
        twitter_screen_name: string;
        DATA_SOURCE: string;
        layout_list: Array<string>;
    }

    // --------------------------------------------------------------- enum(s)
    // ------------------------------------------------------ Global Object(s)
    export var app: CApplication = null;
    const DEMO: number = 0;

    // -------------------------------------------------------------- class(s)
    // -----------------------------------------------------------------------
    /*!
     */
    class CApplication {

        public m_model_event_catalog: model_CEventCatalog = null;
        public m_collection_circle_favo: collection_CCircleFavo = null;
        public m_collection_circle_find: collection_CCircleFind = null;
        public m_collection_event_list: collection_CEventList = null;

        public m_view_catalog_head: view_CCatalogHead = null;
        public m_view_catalog_list: view_CCatalogList = null;

        public m_view_circle_favo: view_CCircleFavo = null;
        public m_view_circle_find: view_CCircleFind = null;
        public m_view_event_list: view_CEventList = null;

        public m_model_circle_desc_hist: model_CCircleDesc_Hist = null;
        public m_view_circle_desc_hist: view_CCircleDesc_Hist = null;

        public m_model_circle_info: model_CCircleInfo = null;
        public m_view_circle_edit: view_CCircleEdit = null;

        public m_dictCircleInfoDB: { [key: string]: Array<model_CCircleInfo> } = null;
        public m_bCInfo: boolean = false;
        public m_dictAuth: IAUTH = null;

        private m_oCTplDesc = Hogan.compile($("#id_tpl_desc").html());

        // -------------------------------------------------------------------
        /*!
         */
        constructor(strJSData: string, strMode: string) {
            const listTemplate = [
                "#id_tpl_head",
                "#id_tpl_eventcatalog_list",
                "#id_tpl_favo_append",
                "#id_tpl_favo_remove",
                "#id_tpl_layout",
                "#id_tpl_circleinfo",
                "#id_tpl_show_circle_desc_1",
                "#id_tpl_show_circle_desc_2",
                "#id_tpl_notify_area",
                "#id_tpl_tbody_conf"
            ];
            let dictTemplate: { [key: string]: Array<ICIRCLE_LIST_DAT> } = {};

            for (let n: number = 0; n < listTemplate.length; n++) {
                dictTemplate[listTemplate[n]] = Hogan.compile($(listTemplate[n]).html());
            }

            this.m_model_event_catalog = new model_CEventCatalog();
            this.m_view_catalog_head = new view_CCatalogHead(
                {
                    el: "body",
                    model: this.m_model_event_catalog
                },
                dictTemplate
            );

            this.m_view_catalog_list = new view_CCatalogList(
                {
                    el: "body",
                    model: this.m_model_event_catalog
                },
                dictTemplate
            );

            //
            this.m_collection_circle_favo = new collection_CCircleFavo();
            this.m_view_circle_favo = new view_CCircleFavo(
                {
                    el: "body",
                    collection: this.m_collection_circle_favo
                },
                dictTemplate
            );

            //
            this.m_collection_circle_find = new collection_CCircleFind();
            this.m_view_circle_find = new view_CCircleFind(
                {
                    el: "body",
                    collection: this.m_collection_circle_find
                },
                dictTemplate
            );

            this.m_collection_event_list = new collection_CEventList();
            this.m_view_event_list = new view_CEventList(
                {
                    el: "body",
                    collection: this.m_collection_event_list
                },
                dictTemplate
            );

            this.m_model_circle_desc_hist = new model_CCircleDesc_Hist();
            this.m_view_circle_desc_hist = new view_CCircleDesc_Hist(
                {
                    el: "body",
                    model: this.m_model_circle_desc_hist
                }
            );

            //
            this.m_model_circle_info = new model_CCircleInfo();
            this.m_view_circle_edit = new view_CCircleEdit(
                {
                    el: "body",
                    model: this.m_model_circle_info
                }
            );

            // イベント情報をデータベースから取得
            if (strJSData == null) {
                if (DEMO == 1) {
                    this.import_from_url("./sample_01.json", "");
                }
            } else {
                if (strMode == null) {
                    this.import_from_url(strJSData, "");
                } else {
                    this.import_from_url(strJSData, strMode);
                }
            }

            //
            $("#id_btn_import_src").on("click", function(oCEvt) { app.import_from_url($("#jsdata").val(), ""); });
        }

        // -------------------------------------------------------------------
        /*!
         */
        show_circle(nGroup: number, nIndex: number): void {
            const oCItem: ICIRCLE_LIST_DAT = app.m_model_event_catalog.attributes.CIRCLE_LIST_DAT[nGroup][nIndex];
            const oCTpl = Hogan.compile(
                ''
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
                + '</table>'
            );

            $("#id_tpl_desc").html(
                this.m_oCTplDesc.render(
                    {
                        "layout": oCItem.layout,
                        "circle_desc_info": oCTpl.render(oCItem)
                    }
                )
            );

            this.m_model_circle_desc_hist.clear();
            this.m_model_circle_desc_hist.url = "/db/circlecheck/_design/catalog/_view/circle_list";
            this.m_model_circle_desc_hist.fetch(
                {
                    data: {
                        descending: true,
                        limit: 5,
                        startkey: JSON.stringify([oCItem.circle_list[0].circle, "Z"]),
                        endkey: JSON.stringify([oCItem.circle_list[0].circle, ""])
                    }
                }
            );

            $("#id_tpl_desc").modal("show");
        }

        // -------------------------------------------------------------------
        /*!
         */
        edit_circle(nGrp: number, nIdx: number, strLayout: string, _id: string, eEMode: E_EDIT_MODE): void {

            if (eEMode == E_EDIT_MODE.INSERT) {
                this.m_view_circle_edit.model.reset();
                this.m_view_circle_edit.model.set("DATA_SOURCE", this.m_model_event_catalog.get("DATA_SOURCE"));
                this.m_view_circle_edit.model.set("layout", strLayout);
            } else {
                let oCCInfo: model_CCircleInfo = app.select_circle_info_db(strLayout, _id);
                this.m_view_circle_edit.model.reset();
                this.m_view_circle_edit.model.set(oCCInfo.attributes);
            }

            this.m_view_circle_edit.ui_update(nGrp, nIdx, eEMode);
            this.m_view_circle_edit.render();

            $("#id_tpl_circle_edit").modal("show");
        }

        // -------------------------------------------------------------------
        /*!
         */
        create_circle_info_db(deffered_cinfo: any): void {
            this.m_dictCircleInfoDB = {};

            // cinfo用のデータベースを生成
            for (let n: number = 0; n < deffered_cinfo[0].rows.length; n++) {
                const strLayout: string = deffered_cinfo[0].rows[n].doc.layout;

                if (strLayout in this.m_dictCircleInfoDB) {
                    this.m_dictCircleInfoDB[strLayout].push(
                        new model_CCircleInfo(deffered_cinfo[0].rows[n].doc)
                    );
                } else {
                    this.m_dictCircleInfoDB[strLayout] = [new model_CCircleInfo(deffered_cinfo[0].rows[n].doc)];
                }
            }
        }

        // -------------------------------------------------------------------
        /*!
         */
        select_circle_info_db(strLayout: string, _id: string): model_CCircleInfo {

            if (strLayout in this.m_dictCircleInfoDB) {
                const listCCInfo: Array<model_CCircleInfo> = this.m_dictCircleInfoDB[strLayout];

                for (let n: number = 0; n < listCCInfo.length; n++) {
                    if (_id == listCCInfo[n].get("_id")) {
                        return listCCInfo[n];
                    }
                }
            }

            return null;
        }

        // -------------------------------------------------------------------
        /*!
         */
        insert_circle_info_db(strLayout: string, _id: string, oCCInfo: model_CCircleInfo): boolean {

            if (strLayout in this.m_dictCircleInfoDB) {
                const listCCInfo: Array<model_CCircleInfo> = this.m_dictCircleInfoDB[strLayout];
                let oCCInfoNew: model_CCircleInfo = new model_CCircleInfo();
                oCCInfoNew.set(oCCInfo.attributes);

                listCCInfo.push(oCCInfoNew);
                listCCInfo.sort(compare_cedit_date);
            } else {
                let oCCInfoNew: model_CCircleInfo = new model_CCircleInfo();
                oCCInfoNew.set(oCCInfo.attributes);

                this.m_dictCircleInfoDB[strLayout] = [oCCInfoNew];
            }

            return true;
        }

        // -------------------------------------------------------------------
        /*!
         */
        update_circle_info_db(strLayout: string, _id: string, oCCInfo: model_CCircleInfo): boolean {
            let bResult: boolean = false;

            if (strLayout in this.m_dictCircleInfoDB) {
                const listCCInfo: Array<model_CCircleInfo> = this.m_dictCircleInfoDB[strLayout];

                for (let n: number = 0; n < listCCInfo.length; n++) {
                    if (_id == listCCInfo[n].get("_id")) {
                        listCCInfo[n].set(oCCInfo.attributes);
                        listCCInfo.sort(compare_cedit_date);
                        bResult = true;
                        break;
                    }
                }
            }

            return bResult;
        }

        // -------------------------------------------------------------------
        /*!
         */
        delete_circle_info_db(strLayout: string, _id: string, oCCInfo: model_CCircleInfo): boolean {
            let bResult: boolean = false;

            if (strLayout in this.m_dictCircleInfoDB) {
                const listCCInfo: Array<model_CCircleInfo> = this.m_dictCircleInfoDB[strLayout];

                for (let n: number = 0; n < listCCInfo.length; n++) {
                    if (_id == listCCInfo[n].get("_id")) {
                        listCCInfo.splice(n, 1);
                        bResult = true;
                        break;
                    }
                }
            }

            return bResult;
        }

        // -------------------------------------------------------------------
        /*!
         */
        public import_from_url(strUrl: string, strMode: string): void {

            $.when(
                $.getJSON(strUrl)
            ).done(
                function(dictEventCatalog: any) {
                    //const URL_CIRCLE_INFO: string = "sample_01_circle_info.json";
                    //const URL_AUTH: string = "sample_01_auth.json";
                    const URL_CIRCLE_INFO: string = "/db/circlecheck_cinfo/_design/event/_view/circle_information?";
                    const URL_AUTH: string = "iface_auth.php?";
                    let listCParam: Array<string> = [
                        "startkey=" + JSON.stringify([dictEventCatalog.DATA_SOURCE, "Z"]),
                        "endkey=" + JSON.stringify([dictEventCatalog.DATA_SOURCE, ""]),
                        "descending=true",
                        "include_docs=true"
                    ];
                    let listAParam: Array<string> = [
                        "DATA_SOURCE=" + dictEventCatalog.DATA_SOURCE
                    ];

                    if (strMode.match("cinfo")) {
                        $.when(
                            $.getJSON(URL_CIRCLE_INFO + listCParam.join("&")),
                            $.getJSON(URL_AUTH + listAParam.join("&"))
                        ).done(
                            function(deffered_cinfo: any, deffered_auth: any) {

                                app.m_bCInfo = true;

                                app.create_circle_info_db(deffered_cinfo);

                                if (typeof deffered_auth[0].twitter_user_id === "undefined") {
                                    app.m_dictAuth = null;
                                } else {
                                    app.m_dictAuth = {
                                        "DATA_SOURCE": deffered_auth[0].DATA_SOURCE,
                                        "twitter_screen_name": deffered_auth[0].twitter_screen_name,
                                        "twitter_user_id": deffered_auth[0].twitter_user_id,
                                        "layout_list": deffered_auth[0].layout_list
                                    };
                                }

                                $("#jsdata").val(strUrl);
                                app.m_model_event_catalog.set(dictEventCatalog);
                            }
                            ).fail(
                            function(deffered_cinfo: any, deffered_auth: any) {
                                app.m_bCInfo = false;

                                $("#jsdata").val(strUrl);
                                app.m_model_event_catalog.set(dictEventCatalog);
                            }
                            );
                    } else {
                        app.m_bCInfo = false;

                        $("#jsdata").val(strUrl);
                        app.m_model_event_catalog.set(dictEventCatalog);
                    }
                }
                );
        }
    }

    // ----------------------------------------------------------- function(s)

    // =======================================================================
    /*!
     */
    function compare_cedit_date(compare: model_CCircleInfo, to: model_CCircleInfo): number {
        if (compare.get("cedit_date") > to.get("cedit_date")) return (-1);
        if (compare.get("cedit_date") < to.get("cedit_date")) return (1);
        return (0);
    }

    // =======================================================================
    /*!
     */
    function get_url_param(): { [key: string]: string } {
        let listResult: { [key: string]: string } = {};
        let listParam: string[] = window.location.href.slice(window.location.href.indexOf("?") + 1).split("&");

        for (let n: number = 0; n < listParam.length; n++) {
            let listData: Array<string> = listParam[n].split("=");

            listResult[listData[0]] = listData[1];
        }

        return listResult;
    }

    // =====================================================================
    /*!
     *  @brief ローカルストレージからお気に入りを読込
     */
    export function storage_load(): any {
        if (!window.localStorage) return;

        let listResult: Array<any> = [];
        let strStorageData: string = window.localStorage.getItem(app.m_model_event_catalog.attributes.DATA_SOURCE) || "-1";

        if (strStorageData != "-1") {
            listResult = JSON.parse(strStorageData);
        }

        return listResult;
    }

    // =====================================================================
    /*!
     *  @brief ローカルストレージにお気に入りを保存
     */
    export function storage_save(): void {
        if (!window.localStorage) return;

        window.localStorage.setItem(
            app.m_model_event_catalog.attributes.DATA_SOURCE,
            JSON.stringify(app.m_collection_circle_favo)
        );
    }

    // =====================================================================
    /*!
     */
    export function resume(): void {
        if (!window.localStorage) {
            document.getElementById("id_notify_area_1").innerHTML = (
                '<div class="alert alert-block">\
                <button type="button" class="close" data-dismiss="alert">×</button>\
                <h4>ご利用の環境ではローカルストレージが使用出来ないようです。</h4>ローカルストレージが使用出来ない場合、お気に入りを保存する事が出来ません。\
                </div>\
                '
            );
        } else {
            let listFav: any = storage_load();
            let listTbl: any = app.m_model_event_catalog.attributes.CIRCLE_LIST_TBL;
            let listDat: any = app.m_model_event_catalog.attributes.CIRCLE_LIST_DAT;

            for (let grp: number = 0; grp < listTbl.length; grp++) {
                for (let idx: number = 0; idx < listDat[grp].length; idx++) {
                    for (let n: number = 0; n < listFav.length; n++) {
                        if (listDat[grp][idx].layout == listFav[n].layout) {
                            app.m_collection_circle_favo.add(
                                listFav[n]
                            );
                        }
                    }
                }
            }
        }
    }

    // =======================================================================
    export function main() {
        const dictParam: { [key: string]: string } = get_url_param();
        const strJSData: string = dictParam["jsdata"];
        const strMode: string = dictParam["m"];

        app = new CApplication(strJSData, strMode);

        if (strJSData == null) {
            app.m_model_event_catalog.set({ null: null });
        }
    }
}

// --------------------------------------------------------------------- [EOF]
