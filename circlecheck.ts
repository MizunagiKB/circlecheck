// ===========================================================================
/*!
 * @brief CircleCheck
 * @author @MizunagiKB
 */
// -------------------------------------------------------------- reference(s)
/// <reference path="./DefinitelyTyped/jquery/jquery.d.ts"/>
/// <reference path="./DefinitelyTyped/bootstrap/bootstrap.d.ts"/>
/// <reference path="./DefinitelyTyped/hogan/hogan.d.ts"/>
/// <reference path="./DefinitelyTyped/hogan/hogan.d.ts"/>

// ---------------------------------------------------------------- declare(s)

module circlecheck {

    // ---------------------------------------------------------- interface(s)
    interface ICIRCLE_LIST_TBL_ITEM {
        id: number;
        name: string;
    }

    interface ICIRCLE_LIST_DAT_ITEM {
        grp: number;
        idx: number;
        mode: string;

        layout: string;
        sortkey?: string;
        icon: string;
        circle?: string;
        writer?: string;
        url?: string;
        circle_list?: Array<ICIRCLE_LIST_DAT_ITEM>;
    }

    interface ICIRCLE_LIST_DAT {
        [id: string]: Array<ICIRCLE_LIST_DAT_ITEM>;
    }

    // ------------------------------------------------------------------- enum(s)
    enum E_CCHECK {
        CAT = 0,
        FAV = 1,
        FND = 2,
        CFG = 3,
        MAP = 4
    }
    var E_CCHECK_LIST: Array<E_CCHECK> = [
        E_CCHECK.CAT,
        E_CCHECK.FAV,
        E_CCHECK.FND,
        E_CCHECK.CFG,
        E_CCHECK.MAP
    ];


    // ------------------------------------------------------ Global Object(s)
    // -------------------------------------------------------------- class(s)
    // -----------------------------------------------------------------------
    /*!
     */
    export class CCircleCheck {
        static INSTANCE: CCircleCheck = null;
        static EVENT_MAP: any = null;
        static CIRCLE_DATA: any = null;
        static EVENT_NAME: string = "";
        static FAV: any = [];
        static COLUMN_CAT: any = [];
        static COLUMN_FAV: any = [];
        static COLUMN_FND: any = [];
        static KEYWORD_DELAY: number = 15;
        static CURRENT_KEYWORD: string = "";
        static CURRENT_KEYWORD_DELAY: number = 0;

        m_oCTplHead: any = null;
        m_oCTplDesc: any = null;

        //
        /*!
         */
        constructor() {

            this.m_oCTplHead = Hogan.compile($("#id_tpl_head").html());
            this.m_oCTplDesc = Hogan.compile($("#id_tpl_desc").html());

            // カラム要素のテンプレートを事前コンパイル
            // {{mode}}の項目をrender時に埋め込む処理を追加すること。

            let oCTpl_FAV_ADD = Hogan.compile(
                '\
                <button id="id_btn_fav_add_{{grp}}_{{idx}}_{{mode}}" class="btn btn-primary" onclick="circlecheck.evt_btn_fav_add({{grp}}, {{idx}});">\
                <span class="glyphicon glyphicon-star"></span>\
                </button>\
                '
            );

            let oCTpl_FAV_DEL = Hogan.compile(
                '\
                <button id="id_btn_fav_del_{{grp}}_{{idx}}_{{mode}}" class="btn btn-danger" onclick="circlecheck.evt_btn_fav_del({{grp}}, {{idx}});">\
                <span class="glyphicon glyphicon-remove"></span>\
                </button>\
                '
            );

            let oCTpl_LAYOUT = Hogan.compile(
                '{{layout}}'
            );

            let oCTpl_CIRCLE_INFO = Hogan.compile(
                '\
                {{#circle_list}}\
                <div>\
                <span class="glyphicon glyphicon-{{#icon}}{{icon}}{{/icon}}{{^icon}}home{{/icon}}"></span>&nbsp;\
                {{#url}}<a href="{{url}}" target="_blank">{{/url}}{{circle}}{{#url}}</a>{{/url}}\
                {{#writer}}<br />\
                <span class="glyphicon glyphicon-pencil"></span>&nbsp;\
                <small>{{writer}}</small>{{/writer}}\
                </div>\
                {{/circle_list}}\
                {{^circle_list}}\
                <div>\
                <span class="glyphicon glyphicon-{{#icon}}{{icon}}{{/icon}}{{^icon}}home{{/icon}}"></span>&nbsp;\
                {{#url}}<a href="{{url}}" target="_blank">{{/url}}{{circle}}{{#url}}</a>{{/url}}\
                {{#writer}}<br />\
                <span class="glyphicon glyphicon-pencil"></span>&nbsp;\
                <small>{{writer}}</small>{{/writer}}\
                </div>\
                {{/circle_list}}\
                '
            );

            let oCTpl_SHOW_CIRCLE_DESC_1 = Hogan.compile(
                '<button class="btn btn-default" onclick="circlecheck.evt_btn_desc({{grp}}, {{idx}});"><span class="glyphicon glyphicon-info-sign"></span></button>'
            );

            let oCTpl_SHOW_CIRCLE_DESC_2 = Hogan.compile(
                '\
                <div class="btn-group">\
                <button class="btn btn-default" onclick="circlecheck.evt_btn_desc({{grp}}, {{idx}});"><span class="glyphicon glyphicon-info-sign"></span></button>\
                <button class="btn btn-default" onclick="circlecheck.evt_btn_mark({{grp}}, {{idx}});"><span class="glyphicon glyphicon-ok"></span></button>\
                </div>\
                '
            );

            // 各テーブルにあわせたカラムセットを定義

            CCircleCheck.COLUMN_CAT = [
                oCTpl_FAV_ADD,
                oCTpl_LAYOUT,
                oCTpl_CIRCLE_INFO,
                oCTpl_SHOW_CIRCLE_DESC_1
            ];

            CCircleCheck.COLUMN_FAV = [
                oCTpl_FAV_DEL,
                oCTpl_LAYOUT,
                oCTpl_CIRCLE_INFO,
                oCTpl_SHOW_CIRCLE_DESC_2
            ];

            CCircleCheck.COLUMN_FND = [
                oCTpl_FAV_ADD,
                oCTpl_LAYOUT,
                oCTpl_CIRCLE_INFO,
                oCTpl_SHOW_CIRCLE_DESC_1
            ];

            show_view(E_CCHECK.CFG);

            // クリックイベントを設定

            $("#id_btn_search").click(function(oCEvt) { evt_btn_search(); });
            $("#id_btn_import_src").click(function(oCEvt) { evt_btn_import_url(); });

            $("#keyword").keyup(function(oCEvt) { evt_keyword(oCEvt); });

            // エンターキーでフォーム送信されてしまうのを抑制。
            $("form").submit(function() { return (false) });
        }
    }

    // ----------------------------------------------------------- function(s)
    // =======================================================================
    /*!
     */
    function get_url_param(): Array<string> {
        let listResult: string[] = [];
        let listParam: string[] = window.location.href.slice(window.location.href.indexOf("?") + 1).split("&");

        for (let n: number = 0; n < listParam.length; n++) {
            let listData: Array<string> = listParam[n].split("=");

            listResult.push(listData[0]);
            listResult[listData[0]] = listData[1];
        }

        return (listResult);
    }


    // =====================================================================
    /*!
     */
    function sort_layout(objA: any, objB: any): number {
        if (objA.sortkey > objB.sortkey) return (1);
        if (objA.sortkey < objB.sortkey) return (-1);

        return (0);
    }


    // =====================================================================
    /*!
     *  @brief データチェック用の関数定義
     */
    function is_valid_param(param: string): boolean {
        var bResult: boolean = false;

        if (param) {
            if (param != "#") {
                bResult = true;
            }
        }

        return (bResult);
    }


    // =====================================================================
    /*!
     */
    function fav_search_idx(oCItem: ICIRCLE_LIST_DAT_ITEM): number {
        for (let n: number = 0; n < CCircleCheck.FAV.length; n++) {
            if (oCItem.layout == CCircleCheck.FAV[n].layout) {
                return (n);
            }
        }

        return (-1);
    }


    // =====================================================================
    /*!
     */
    function update_row_class(strId: string, strClass: string): HTMLElement {
        let oCRow: HTMLElement = document.getElementById(strId);

        if (oCRow != null) {
            oCRow.className = strClass;
        }

        return (oCRow)
    }


    // =====================================================================
    /*!
     */
    function fav_append(nGroup: number, nIndex: number): void {
        let oCItem: any = CCircleCheck.CIRCLE_DATA.CIRCLE_LIST_DAT[nGroup][nIndex];
        let nIdx: number = fav_search_idx(oCItem);

        if (nIdx == -1) {
            CCircleCheck.FAV.push(oCItem);
            CCircleCheck.FAV.sort(sort_layout);

            if (update_row_class("id_row_lst_" + nGroup + "_" + nIndex, "info") != null) {
                $("#id_btn_fav_add_" + nGroup + "_" + nIndex + "_" + E_CCHECK[E_CCHECK.CAT]).addClass("disabled");
            }

            if (update_row_class("id_row_fnd_" + nGroup + "_" + nIndex, "info") != null) {
                $("#id_btn_fav_add_" + nGroup + "_" + nIndex + "_" + E_CCHECK[E_CCHECK.FND]).addClass("disabled");
            }

            storage_save();

            render_head();

            render_fav();
        }
    }


    // =====================================================================
    /*!
     */
    function fav_remove(nGroup: number, nIndex: number): void {
        let oCItem: any = CCircleCheck.CIRCLE_DATA.CIRCLE_LIST_DAT[nGroup][nIndex];
        let nIdx: number = fav_search_idx(oCItem);

        if (nIdx != -1) {
            let oCRow = document.getElementById("id_row_fav_" + nGroup + "_" + nIndex);

            oCRow.parentNode.removeChild(oCRow);

            if (update_row_class("id_row_lst_" + nGroup + "_" + nIndex, "") != null) {
                $("#id_btn_fav_add_" + nGroup + "_" + nIndex + "_" + E_CCHECK[E_CCHECK.CAT]).removeClass("disabled");
            }

            if (update_row_class("id_row_fnd_" + nGroup + "_" + nIndex, "") != null) {
                $("#id_btn_fav_add_" + nGroup + "_" + nIndex + "_" + E_CCHECK[E_CCHECK.FND]).removeClass("disabled");
            }

            CCircleCheck.FAV.splice(nIdx, 1);

            storage_save();

            render_head();
        }
    }


    // =====================================================================
    /*!
     */
    function show_view(e_ccheck: E_CCHECK): void {
        for (let i: number = 0; i < E_CCHECK_LIST.length; i++) {
            $("#id_menu_" + E_CCHECK[i]).removeClass("active");
            $("#id_view_" + E_CCHECK[i]).hide();
        }

        $("#id_menu_" + E_CCHECK[e_ccheck]).addClass("active");
        $("#id_view_" + E_CCHECK[e_ccheck]).show();
    }

    // =====================================================================
    /*!
     */
    function get_event_series(strUrl: string): void {
        $.getJSON(
            strUrl,
            function(oCJson) {

                let oCTpl = Hogan.compile(
                    '\
                    {{#rows}}\
                    <tr><td>{{value.EVENT_SERIES}}</td><td><a href="./index.html?jsdata=/db/circlecheck/{{id}}">{{value.EVENT_NAME}}</a></td><td>{{value.EVENT_ST}}</td></tr>\
                    {{/rows}}\
                    '
                );

                $("#id_tbl_cfg_0").html(
                    oCTpl.render(oCJson)
                );
            }
        );
    }

    // =====================================================================
    /*!
     */
    function import_from_url(strUrl: string): void {
        $.getJSON(
            strUrl,
            function(oCJson) {
                CCircleCheck.FAV = [];
                CCircleCheck.CIRCLE_DATA = oCJson;

                init_tabhead(
                    CCircleCheck.CIRCLE_DATA.CIRCLE_LIST_TBL
                );

                init_tabdata(
                    CCircleCheck.CIRCLE_DATA.CIRCLE_LIST_TBL,
                    CCircleCheck.CIRCLE_DATA.CIRCLE_LIST_DAT
                );

                $("#id_title").text(CCircleCheck.CIRCLE_DATA.EVENT_NAME);

                $("#id_tpl_head").html(CCircleCheck.INSTANCE.m_oCTplHead.render(CCircleCheck.CIRCLE_DATA));

                var strHref_base: string = window.location.href.split("?")[0];

                if (is_valid_param(CCircleCheck.CIRCLE_DATA.DATA_SOURCE_PREV) == true) {
                    $("#id_menu_prev").click(function(oCEvt) { window.location.href = strHref_base + "?jsdata=" + CCircleCheck.CIRCLE_DATA.DATA_SOURCE_PREV });
                } else {
                    $("#id_menu_prev").click(function(oCEvt) { $("#id_tpl_empty").modal("show"); });
                }

                if (is_valid_param(CCircleCheck.CIRCLE_DATA.DATA_SOURCE_NEXT) == true) {
                    $("#id_menu_next").click(function(oCEvt) { window.location.href = strHref_base + "?jsdata=" + CCircleCheck.CIRCLE_DATA.DATA_SOURCE_NEXT });
                } else {
                    $("#id_menu_next").click(function(oCEvt) { $("#id_tpl_empty").modal("show"); });
                }

                $("#id_menu_" + E_CCHECK[E_CCHECK.CAT]).click(function(oCEvt) { show_view(E_CCHECK.CAT); });
                $("#id_menu_" + E_CCHECK[E_CCHECK.FAV]).click(function(oCEvt) { show_view(E_CCHECK.FAV); });
                $("#id_menu_" + E_CCHECK[E_CCHECK.FND]).click(function(oCEvt) { show_view(E_CCHECK.FND); });
                $("#id_menu_" + E_CCHECK[E_CCHECK.CFG]).click(function(oCEvt) { show_view(E_CCHECK.CFG); });
                $("#id_menu_" + E_CCHECK[E_CCHECK.MAP]).click(function(oCEvt) { show_view(E_CCHECK.MAP); });

                if (CCircleCheck.CIRCLE_DATA.EVENT_MAP_LOCATION) {
                    CCircleCheck.EVENT_MAP = new Microsoft.Maps.Map(
                        document.getElementById("id_bing_map"),
                        {
                            credentials: "AnFn8oGtujPjISREG74t6AjvDUiHBPJxXT0Dai0p2WlPyZtIB9FoBnFwyNGnKkFr",
                            center: new Microsoft.Maps.Location(
                                CCircleCheck.CIRCLE_DATA.EVENT_MAP_LOCATION.latitude,
                                CCircleCheck.CIRCLE_DATA.EVENT_MAP_LOCATION.longitude
                            ),
                            mapTypeId: Microsoft.Maps.MapTypeId.road,
                            enableSearchLogo: false,
                            enableClickableLogo: false,
                            showDashboard: true,
                            zoom: 16
                        }
                    );

                    CCircleCheck.EVENT_MAP.entities.push(
                        new Microsoft.Maps.Pushpin(CCircleCheck.EVENT_MAP.getCenter())
                    );
                }

                get_event_series(
                    "/db/circlecheck/_design/catalog/_view/list?startkey=[\"" + CCircleCheck.CIRCLE_DATA.EVENT_SERIES + "\", \"\"]&endkey=[\"" + CCircleCheck.CIRCLE_DATA.EVENT_SERIES +"\", \"Z\"]"
                );

                resume();

                show_view(E_CCHECK.CAT);

                render_info();

                render_fav();

                $("#jsdata").val(strUrl);

                setInterval(evt_keyword_timer, 100);
            }
        );
    }


    // ===============================================================
    /*!
     */
    function search_keyword(strKeyword: string, oCDatItem: ICIRCLE_LIST_DAT_ITEM): boolean {
        let bFound: boolean = false;
        let listCItem: Array<ICIRCLE_LIST_DAT_ITEM>;

        if (oCDatItem.circle_list) {
            listCItem = oCDatItem.circle_list;
        } else {
            listCItem = [oCDatItem];
        }

        for (let i: number = 0; i < listCItem.length; i++) {
            let oCItem = listCItem[i];

            if (oCItem.circle) {
                if (oCItem.circle.indexOf(strKeyword, 0) != -1) bFound = true;
            }

            if (oCItem.writer) {
                if (oCItem.writer.indexOf(strKeyword, 0) != -1) bFound = true;
            }
        }

        return (bFound);
    }


    // ===============================================================
    /*!
     */
    function evt_keyword_timer(): void {
        if (CCircleCheck.CURRENT_KEYWORD_DELAY > 0) {
            CCircleCheck.CURRENT_KEYWORD_DELAY--;

            var fProgress: number = (CCircleCheck.KEYWORD_DELAY - CCircleCheck.CURRENT_KEYWORD_DELAY) * 100;
            fProgress /= CCircleCheck.KEYWORD_DELAY;

            $("#id_search_progress").css("width", fProgress + "%");

            if (CCircleCheck.CURRENT_KEYWORD_DELAY == 0) {
                var strKeyword: string = $("#keyword").val();
                var oCTBL = CCircleCheck.CIRCLE_DATA.CIRCLE_LIST_TBL;
                var oCDAT: ICIRCLE_LIST_DAT = CCircleCheck.CIRCLE_DATA.CIRCLE_LIST_DAT;
                var nFoundCount: number = 0;
                var listFavItem: Array<ICIRCLE_LIST_DAT_ITEM> = [];
                var listTable: Array<string> = [];

                listTable.push('<thead><tr><th><span class="glyphicon glyphicon-star"></span></th><th><span class="glyphicon glyphicon-map-marker"></span></th><th>サークル名 / 執筆者</th><th><span class="glyphicon glyphicon-info-sign"></span></th></tr></thead>');
                if (strKeyword) {

                    listTable.push('<tbody>');

                    for (var i: number = 0; i < oCTBL.length; i++) {
                        for (var j: number = 0; j < oCDAT[i].length; j++) {
                            var oCItem = oCDAT[i][j];

                            oCItem.mode = E_CCHECK[E_CCHECK.FND];

                            if (search_keyword(strKeyword, oCItem) == true) {
                                var rowId = "id_row_fnd_" + oCItem.grp + "_" + oCItem.idx;

                                listTable.push('<tr id="' + rowId + '">');
                                for (var k: number = 0; k < CCircleCheck.COLUMN_FND.length; k++) {
                                    listTable.push('<td>' + CCircleCheck.COLUMN_FND[k].render(oCItem) + '</td>');
                                }
                                listTable.push('</tr>');

                                var nIdx: number = fav_search_idx(oCItem);

                                if (nIdx != -1) {
                                    listFavItem.push(oCItem);
                                }

                                nFoundCount += 1;
                            }
                        }
                    }

                    listTable.push('</tbody>');

                    $("#id_tbl_fnd_0").html(listTable.join(''));

                    for (var i: number = 0; i < listFavItem.length; i++) {
                        var oCItem = listFavItem[i];

                        if (update_row_class("id_row_fnd_" + oCItem.grp + "_" + oCItem.idx, "info") != null) {
                            $("#id_btn_fav_add_" + oCItem.grp + "_" + oCItem.idx + "_" + E_CCHECK[E_CCHECK.FND]).addClass("disabled");
                        }
                    }
                }

                if (nFoundCount > 0) {
                    $("#id_search_result").html(
                        '<p class="text-center">' + nFoundCount + ' 件 見つかりました。</p>'
                    );

                } else {
                    $("#id_search_result").html(
                        '<p class="text-center">見つかりませんでした。</p>'
                    );
                }

            }
        }
    }


    // ===============================================================
    /*!
     */
    export function evt_keyword(oCEvt: any): void {
        if (oCEvt.keyCode == 0x0D) {
            CCircleCheck.CURRENT_KEYWORD_DELAY = CCircleCheck.KEYWORD_DELAY;

            $("#id_search_progress").css("width", "0%");
        }
    }


    // =====================================================================
    /*!
     */
    export function evt_btn_search(): void {
        CCircleCheck.CURRENT_KEYWORD_DELAY = CCircleCheck.KEYWORD_DELAY;

        $("#id_search_progress").css("width", "0%");
    }


    // =====================================================================
    /*!
     */
    export function evt_btn_fav_add(nGroup: number, nIndex: number): void {
        fav_append(nGroup, nIndex);

        //console.log( "evt_btn_fav_add " + nGroup + ", " + nIndex );
    }


    // =====================================================================
    /*!
     */
    export function evt_btn_fav_del(nGroup: number, nIndex: number): void {
        fav_remove(nGroup, nIndex);

        //console.log( "evt_btn_fav_del " + nGroup + ", " + nIndex );
    }


    // =====================================================================
    /*!
     */
    export function evt_btn_desc(nGroup: number, nIndex: number): void {
        let oCItem = CCircleCheck.CIRCLE_DATA.CIRCLE_LIST_DAT[nGroup][nIndex];
        let oCTpl = Hogan.compile(
            ''
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
            + '</table>'
        );

        $("#id_tpl_desc").html(
            CCircleCheck.INSTANCE.m_oCTplDesc.render(
                {
                    "layout": oCItem.layout,
                    "circle_table_item": oCTpl.render(oCItem)
                }
            )
        );
        $("#id_tpl_desc").modal("show");

        //console.log( "evt_btn_desc " + nGroup + ", " + nIndex );
        //console.log( oCItem );
    }


    // =====================================================================
    /*!
     */
    export function evt_btn_mark(nGroup: number, nIndex: number): void {
        var oCItem = CCircleCheck.CIRCLE_DATA.CIRCLE_LIST_DAT[nGroup][nIndex];

        var oCRow = document.getElementById("id_row_fav_" + nGroup + "_" + nIndex);

        if (oCRow.className != "") {
            oCRow.className = "";
        } else {
            oCRow.className = "success";
        }

        //console.log( "evt_btn_mark " + nGroup + ", " + nIndex );
    }


    // =====================================================================
    /*!
     */
    function evt_btn_import_url() {
        import_from_url($("#jsdata").val());
    }


    // =====================================================================
    /*!
     */
    function render_head() {
        $("#id_head_fav_count").text(CCircleCheck.FAV.length);
    }


    // ==========================================================================
    /*!
     */
    function check_event_schedule(): any[] {
        let aryResult: Array<any> = [];

        if (is_valid_param(CCircleCheck.CIRCLE_DATA.EVENT_ST) != true) return (aryResult);
        if (is_valid_param(CCircleCheck.CIRCLE_DATA.EVENT_EN) != true) return (aryResult);

        let oCDate = new Date();
        let oCDateSt = new Date(CCircleCheck.CIRCLE_DATA.EVENT_ST);
        let oCDateEn = new Date(CCircleCheck.CIRCLE_DATA.EVENT_EN);

        let strDateTimeSt = oCDateSt.getFullYear() + "年" + (oCDateSt.getMonth() + 1) + "月" + oCDateSt.getDate() + "日&nbsp;" + ("0" + oCDateSt.getHours()).slice(-2) + ":" + ("0" + oCDateSt.getMinutes()).slice(-2);
        let strDateTimeEn = oCDateEn.getFullYear() + "年" + (oCDateEn.getMonth() + 1) + "月" + oCDateEn.getDate() + "日&nbsp;" + ("0" + oCDateEn.getHours()).slice(-2) + ":" + ("0" + oCDateEn.getMinutes()).slice(-2);

        if (oCDate.getTime() < oCDateSt.getTime()) {
            aryResult.push(
                {
                    "alert": "info", "icon": "info-sign",
                    "text": "開催予定日&nbsp;[&nbsp;" + strDateTimeSt + "&nbsp;]"
                }
            );
        } else if (oCDate.getTime() < oCDateEn.getTime()) {
            aryResult.push({ "alert": "info", "icon": "info-sign", "text": "本日開催&nbsp;[&nbsp;" + strDateTimeSt + "&nbsp;-&nbsp;" + strDateTimeEn + "&nbsp;]" });
        } else {
            aryResult.push({ "alert": "danger", "icon": "exclamation-sign", "text": "このイベントは終了しました" });
        }

        return (aryResult);
    }


    // ==========================================================================
    /*!
    */
    function render_info() {
        let strInfo: string = '';

        let oCTpl = Hogan.compile(
            ''
            + '<div class="alert alert-{{#alert}}{{alert}}{{/alert}}{{^alert}}info{{/alert}} alert-dismissable">'
            + '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>'
            + '<strong><span class="glyphicon glyphicon-{{#icon}}{{icon}}{{/icon}}{{^icon}}info-sign{{/icon}}"></span></strong>&nbsp;{{{text}}}'
            + '</div>'
        );

        var oCItem = check_event_schedule();

        for (let n: number = 0; n < oCItem.length; n++) {
            strInfo += oCTpl.render(oCItem[n]);
        }

        var oCItem: any[] = CCircleCheck.CIRCLE_DATA.INFORMATION;
        for (let n: number = 0; n < oCItem.length; n++) {
            strInfo += oCTpl.render(oCItem[n]);
        }

        $("#id_notify_area_1").html(strInfo);
    }


    // =====================================================================
    /*!
     */
    function render_fav(): void {
        let listTable: Array<string> = [];

        listTable.push('<tr><th><span class="glyphicon glyphicon-remove"></span></th><th><span class="glyphicon glyphicon-map-marker"></span></th><th>サークル名 / 執筆者</th><th><span class="glyphicon glyphicon-info-sign"></span></th></tr>');

        for (var i = 0; i < CCircleCheck.FAV.length; i++) {
            let oCItem = CCircleCheck.FAV[i];

            listTable.push('<tr id="id_row_fav_' + oCItem.grp + '_' + oCItem.idx + '">');

            for (let n = 0; n < CCircleCheck.COLUMN_FAV.length; n++) {
                listTable.push('<td>' + CCircleCheck.COLUMN_FAV[n].render(oCItem) + '</td>');
            }
            listTable.push('</tr>')
        }

        $("#id_tbl_fav_0").html(listTable.join(''));
    }


    // =====================================================================
    /*!
     */
    function init_tabhead(oCListTbl: Array<ICIRCLE_LIST_TBL_ITEM>): void {
        let strUl_T: string = '';
        let strUl_V: string = '';
        let oCTpl_T: any = Hogan.compile(
            '<li><a href="#id_tab_{{id}}" data-toggle="tab">{{name}}</a></li>'
        );
        let oCTpl_V: any = Hogan.compile(
            ''
            + '<div class="tab-pane fade" id="id_tab_{{id}}">'
            + '<table id="id_tbl_lst_{{id}}" class="table table-striped table-condensed">'
            + '</table>'
            + '</div>'
        );

        for (let n: number = 0; n < oCListTbl.length; n++) {
            strUl_T += oCTpl_T.render(oCListTbl[n]);
            strUl_V += oCTpl_V.render(oCListTbl[n]);
        }

        $("#id_view_" + E_CCHECK[E_CCHECK.CAT]).html(
            ''
            + '<ul id="id_tab_circle_lst" class="nav nav-tabs">'
            + strUl_T
            + '</ul>'
            + '<div id="id_view_lst_content" class="tab-content">'
            + '<p>'
            + strUl_V
            + '</p>'
            + '</div>'
        );

        $("#id_tab_circle_lst a:first").tab("show");
    }


    // ==========================================================================
    /*!
     *  @brief サークル一覧用のテーブルを生成
     */
    function init_tabdata(oCListTbl: Array<ICIRCLE_LIST_TBL_ITEM>, oCListDat: ICIRCLE_LIST_DAT): void {
        let strTableHead: string = $("#id_tpl_circleinfo_head").html().trim();

        for (let i: number = 0; i < oCListTbl.length; i++) {
            let listTable: Array<string> = [];

            listTable.push(strTableHead);

            for (let j: number = 0; j < oCListDat[i].length; j++) {
                let oCItem = oCListDat[i][j];

                oCItem.grp = i;
                oCItem.idx = j;
                oCItem.mode = E_CCHECK[E_CCHECK.CAT];

                listTable.push('<tr id="id_row_lst_' + oCItem.grp + '_' + oCItem.idx + '">');

                for (let k: number = 0; k < CCircleCheck.COLUMN_CAT.length; k++) {
                    listTable.push('<td>' + CCircleCheck.COLUMN_CAT[k].render(oCItem) + '</td>');
                }

                listTable.push('</tr>');
            }

            $("#id_tbl_lst_" + i).html(listTable.join(''));
        }
    }


    // =====================================================================
    /*!
     *  @brief ローカルストレージからお気に入りを読込
     */
    function storage_load(): any {
        if (!window.localStorage) return;

        let listResult: Array<any> = [];
        let strStorageData = window.localStorage.getItem(CCircleCheck.CIRCLE_DATA.DATA_SOURCE) || -1;

        if (strStorageData != -1) {
            listResult = JSON.parse(strStorageData);
        }

        return (listResult);
    }


    // =====================================================================
    /*!
     *  @brief ローカルストレージにお気に入りを保存
     */
    function storage_save(): void {
        if (!window.localStorage) return;

        window.localStorage.setItem(CCircleCheck.CIRCLE_DATA.DATA_SOURCE, JSON.stringify(CCircleCheck.FAV));
    }


    // =====================================================================
    /*!
     */
    function resume(): void {
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
            let listTbl: any = CCircleCheck.CIRCLE_DATA.CIRCLE_LIST_TBL;
            let listDat: any = CCircleCheck.CIRCLE_DATA.CIRCLE_LIST_DAT;

            for (let grp: number = 0; grp < listTbl.length; grp++) {
                for (let idx: number = 0; idx < listDat[grp].length; idx++) {
                    for (let n: number = 0; n < listFav.length; n++) {
                        if (listDat[grp][idx].layout == listFav[n].layout) {
                            fav_append(grp, idx);
                        }
                    }
                }
            }
        }
    }

    // =======================================================================
    /*!
     * @brief ディスプレイインスタンスの生成処理
     */
    export function create_instance(strId: string): CCircleCheck {
        const listParam: Array<string> = get_url_param();

        let strAsset: string = listParam["jsdata"];
        let oCResult: CCircleCheck = null;

        if (strAsset == null) {
            //strAsset = "jsdata/sample.json.sample";
        }

        if (CCircleCheck.INSTANCE != null) {
            oCResult = CCircleCheck.INSTANCE;
        } else {
            oCResult = new CCircleCheck();
            CCircleCheck.INSTANCE = oCResult;

            import_from_url(strAsset);
        }

        return (oCResult);
    }
}


// --------------------------------------------------------------------- [EOF]
