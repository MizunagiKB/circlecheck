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

        private m_oCTplDesc = Hogan.compile($("#id_tpl_desc").html());

        // -------------------------------------------------------------------
        /*!
         */
        constructor(strJSData: string) {
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
            if (strJSData == null) {
                if (DEMO == 1) {
                    this.import_from_url("./sample_01.json");
                }
            } else {
                this.import_from_url(strJSData);
            }

            //
            $("#id_btn_import_src").on("click", function(oCEvt) { app.import_from_url($("#jsdata").val()); });
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
        public import_from_url(strUrl: string): void {

            $.getJSON(
                strUrl,
                function(dictEventCatalog) {
                    app.m_model_event_catalog.set(dictEventCatalog);

                    $("#jsdata").val(strUrl);
                }
            );
        }
    }

    // ----------------------------------------------------------- function(s)
    // =======================================================================
    /*!
     */
    function get_url_param(): { [key: string]: string }{
        let listResult: { [key: string]: string }= {};
        let listParam: string[] = window.location.href.slice(window.location.href.indexOf("?") + 1).split("&");

        for (let n: number = 0; n < listParam.length; n++) {
            let listData: Array<string> = listParam[n].split("=");

            listResult[listData[0]] = listData[1];
        }

        return (listResult);
    }

    // =====================================================================
    /*!
     *  @brief ローカルストレージからお気に入りを読込
     */
    export function storage_load(): any {
        if (!window.localStorage) return;

        let listResult: Array<any> = [];
        let strStorageData = window.localStorage.getItem(app.m_model_event_catalog.attributes.DATA_SOURCE) || -1;

        if (strStorageData != -1) {
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

        app = new CApplication(strJSData);

        if (strJSData == null) {
            app.m_model_event_catalog.set({ null: null });
        }
    }
}

// --------------------------------------------------------------------- [EOF]
