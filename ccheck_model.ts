// ===========================================================================
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
// -------------------------------------------------------------- reference(s)
// ------------------------------------------------ http://definitelytyped.org
/// <reference path="./DefinitelyTyped/jquery/jquery.d.ts"/>
/// <reference path="./DefinitelyTyped/bootstrap/bootstrap.d.ts"/>
/// <reference path="./DefinitelyTyped/backbone/backbone.d.ts"/>
/// <reference path="./DefinitelyTyped/hogan/hogan.d.ts"/>

// ---------------------------------------------------------------- declare(s)

module ccheck {

    // ---------------------------------------------------------- interface(s)
    interface ICIRCLE_LIST_TBL {
        id: number;
        name: string;
    }

    interface ICIRCLE_LIST_DAT_ITEM {
        circle: string;
        writer?: string;
        icon?: string;
        url?: string;
    }

    export interface ICIRCLE_LIST_DAT {
        grp: number;
        idx: number;
        mode: string;
        layout: string;
        sortkey: string;
        circle_list?: Array<ICIRCLE_LIST_DAT_ITEM>;
    }

    interface ICIRCLE_LIST_LOCATION {
        latitude: number;
        longitude: number;
    }

    interface IEVENT_CATALOG {
        EVENT_URL: string;
        EVENT_MAP_LOCATION: ICIRCLE_LIST_LOCATION;
        DATA_SOURC: string;
        DATA_SOURCE_PREV: string;
        DATA_SOURCE_NEXT: string;

        EVENT_NAME: string;
        EVENT_ST: string;
        EVENT_EN: string;
        INFORMATION: Array<string>;

        CIRCLE_LIST_TBL: Array<ICIRCLE_LIST_TBL>;
        CIRCLE_LIST_DAT: { [key: string]: Array<ICIRCLE_LIST_DAT> };
    }

    interface ITEMPLATES {
        [key: string]: any;
    }

    // --------------------------------------------------------------- enum(s)
    // ------------------------------------------------------ Global Object(s)
    // -------------------------------------------------------------- class(s)

    export class model_CEventCatalog extends Backbone.Model {

        //
        constructor(attributes: any = {}, options: any = {}) {
            super(attributes, options);
        }

        //
        validate(attributes: any, options?: any): string {

            if (!attributes.DATA_SOURCE) return "E";
            if (!attributes.CIRCLE_LIST_TBL) return "E";
            if (!attributes.CIRCLE_LIST_DAT) return "E";

            return "";
        }
    }

    //
    export class model_CCircleFavo extends Backbone.Model {

        //
        constructor(attributes: any = {}, options: any = {}) {
            super(attributes, options);
        }
    }

    //
    export class collection_CCircleFavo extends Backbone.Collection<model_CCircleFavo> {

        //
        constructor() {
            super();
            this.on("add", this.evt_append);
            this.on("remove", this.evt_remove);
        }

        //
        modelId(attributes: ICIRCLE_LIST_DAT) {
            return attributes.layout;
        }

        //
        comparator(compare: model_CCircleFavo, to?: model_CCircleFavo): number {
            if (compare.attributes.sortkey > to.attributes.sortkey) return (1);
            if (compare.attributes.sortkey < to.attributes.sortkey) return (-1);
            return (0);
        }

        //
        evt_append(oCItem: model_CCircleFavo) {
            const listTargetId: Array<string> = ["#id_row_list_", "#id_row_find_"];

            for (let n: number = 0; n < listTargetId.length; n++) {
                const strTargetId: string = listTargetId[n] + oCItem.attributes.grp + "_" + oCItem.attributes.idx;

                $(strTargetId + " button.evt-favo-append").addClass("disabled");
                $(strTargetId).addClass("info");
            }

            $("#id_head_fav_count").text(String(app.m_collection_circle_favo.length));
            $("#id_head_fav_count").fadeIn();
        }

        //
        evt_remove(oCItem: model_CCircleFavo) {
            const listTargetId: Array<string> = ["#id_row_list_", "#id_row_find_"];

            for (let n: number = 0; n < listTargetId.length; n++) {
                const strTargetId: string = listTargetId[n] + oCItem.attributes.grp + "_" + oCItem.attributes.idx;

                $(strTargetId).removeClass("info");
                $(strTargetId + " button.evt-favo-append").removeClass("disabled");
            }

            if (app.m_collection_circle_favo.length > 0) {
                $("#id_head_fav_count").text(String(app.m_collection_circle_favo.length));
            } else {
                $("#id_head_fav_count").fadeOut();
            }
        }
    }

    //
    export class model_CCircleFind extends Backbone.Model {

        //
        constructor(attributes: any = {}, options: any = {}) {
            super(attributes, options);
        }
    }

    //
    export class collection_CCircleFind extends Backbone.Collection<model_CCircleFind> {

        //
        modelId(attributes: ICIRCLE_LIST_DAT) {
            return attributes.layout;
        }

        //
        comparator(compare: model_CCircleFavo, to?: model_CCircleFavo): number {
            if (compare.attributes.sortkey > to.attributes.sortkey) return (1);
            if (compare.attributes.sortkey < to.attributes.sortkey) return (-1);
            return (0);
        }
    }

    //
    export class view_CCatalogHead extends Backbone.View<model_CEventCatalog> {
        private m_dictTemplate: ITEMPLATES;

        //
        constructor(options: any = {}) {
            super(options);
            this.listenTo(this.model, "change", this.render);
            this.on("view_change", this.view_change);

            this.m_dictTemplate = options.dictTemplate;
        }

        events(): Backbone.EventsHash {
            return {
                "click li#id_menu_list": this.evt_view_change,
                "click li#id_menu_favo": this.evt_view_change,
                "click li#id_menu_find": this.evt_view_change,
                "click li#id_menu_conf": this.evt_view_change,
                "click li#id_menu_area": this.evt_view_change
            }
        }

        //
        evt_view_change(oCEvt: any) {
            this.view_change("#" + oCEvt.currentTarget.id);
        }

        //
        view_change(strId: string) {

            $("nav li").removeClass("active");
            $(strId).removeClass("disabled");
            $(strId).addClass("active");

            $(".cchack_view").hide();
            $($(strId).data("target-view")).fadeIn();
        }

        //
        is_valid_param(strParam: string): boolean {
            let bResult: boolean = false;

            if (strParam) {
                if (strParam != "#") {
                    bResult = true;
                }
            }

            return bResult;
        }

        render_notify_area(): string {

            if (this.is_valid_param(this.model.attributes.EVENT_ST) != true) return;
            if (this.is_valid_param(this.model.attributes.EVENT_EN) != true) return;

            let oCDate = new Date();
            let oCDateSt = new Date(this.model.attributes.EVENT_ST);
            let oCDateEn = new Date(this.model.attributes.EVENT_EN);
            let strDateTimeSt = oCDateSt.getFullYear() + "年" + (oCDateSt.getMonth() + 1) + "月" + oCDateSt.getDate() + "日&nbsp;" + ("0" + oCDateSt.getHours()).slice(-2) + ":" + ("0" + oCDateSt.getMinutes()).slice(-2);
            let strDateTimeEn = oCDateEn.getFullYear() + "年" + (oCDateEn.getMonth() + 1) + "月" + oCDateEn.getDate() + "日&nbsp;" + ("0" + oCDateEn.getHours()).slice(-2) + ":" + ("0" + oCDateEn.getMinutes()).slice(-2);
            let listItem: Array<string> = [];

            if (oCDate.getTime() < oCDateSt.getTime()) {
                listItem.push(
                    this.m_dictTemplate["#id_tpl_notify_area"].render(
                        {
                            "alert": "info", "icon": "info-sign",
                            "text": "開催予定日&nbsp;[&nbsp;" + strDateTimeSt + "&nbsp;]"
                        }
                    )
                );
            } else if (oCDate.getTime() < oCDateEn.getTime()) {
                listItem.push(
                    this.m_dictTemplate["#id_tpl_notify_area"].render(
                        { "alert": "info", "icon": "info-sign", "text": "本日開催&nbsp;[&nbsp;" + strDateTimeSt + "&nbsp;-&nbsp;" + strDateTimeEn + "&nbsp;]" }
                    )
                );
            } else {
                listItem.push(
                    this.m_dictTemplate["#id_tpl_notify_area"].render(
                        { "alert": "danger", "icon": "exclamation-sign", "text": "このイベントは終了しました" }
                    )
                );
            }

            for (let n: number = 0; n < this.model.attributes.INFORMATION.length; n++) {
                listItem.push(this.m_dictTemplate["#id_tpl_notify_area"].render(this.model.attributes.INFORMATION[n]));
            }

            $("#id_notify_area").html(listItem.join(""));
        }

        //
        render_map() {
            if (this.model.attributes.EVENT_MAP_LOCATION) {
                let oCMap = new Microsoft.Maps.Map(
                    document.getElementById("id_bing_map"),
                    {
                        credentials: "AnFn8oGtujPjISREG74t6AjvDUiHBPJxXT0Dai0p2WlPyZtIB9FoBnFwyNGnKkFr",
                        center: new Microsoft.Maps.Location(
                            this.model.attributes.EVENT_MAP_LOCATION.latitude,
                            this.model.attributes.EVENT_MAP_LOCATION.longitude
                        ),
                        mapTypeId: Microsoft.Maps.MapTypeId.road,
                        enableSearchLogo: false,
                        enableClickableLogo: false,
                        showDashboard: true,
                        zoom: 16
                    }
                );

                oCMap.entities.push(
                    new Microsoft.Maps.Pushpin(oCMap.getCenter())
                );
            }
        }

        //
        render() {
            let strBaseAddress: string = window.location.href.split("?")[0];

            if (this.model.isValid() == false) {

                $("#id_tpl_head").html(
                    this.m_dictTemplate["#id_tpl_head"].render({ "EVENT_NAME": "イベント一覧" })
                );

                this.view_change("#id_menu_conf");

            } else {

                $("#id_tpl_head").html(
                    this.m_dictTemplate["#id_tpl_head"].render(this.model.attributes)
                );

                $("nav li").removeClass("disabled");

                this.view_change("#id_menu_list");

                if (this.is_valid_param(this.model.attributes.DATA_SOURCE_PREV) == true) {
                    $("#id_menu_prev a").attr("href", strBaseAddress + "?jsdata=" + this.model.attributes.DATA_SOURCE_PREV);
                } else {
                    $("#id_menu_prev").addClass("disabled");
                }

                if (this.is_valid_param(this.model.attributes.DATA_SOURCE_NEXT) == true) {
                    $("#id_menu_next a").attr("href", strBaseAddress + "?jsdata=" + this.model.attributes.DATA_SOURCE_NEXT);
                } else {
                    $("#id_menu_next").addClass("disabled");
                }

                this.render_notify_area();
                this.render_map();
            }

            return this;
        }
    }

    //
    export class view_CCatalogList extends Backbone.View<model_CEventCatalog> {
        private m_dictTemplate: ITEMPLATES;

        //
        constructor(options: any = {}) {
            super(options);

            this.listenTo(this.model, "change", this.render);

            this.m_dictTemplate = options.dictTemplate;
        }

        //
        events(): Backbone.EventsHash {
            return {
                "click #id_view_list button.evt-favo-append": this.evt_favo_append,
                "click #id_view_list button.evt-show-circle": this.evt_show_circle
            }
        }

        //
        evt_favo_append(oCEvt: any) {
            const nGrp: number = $(oCEvt.currentTarget).data("grp");
            const nIdx: number = $(oCEvt.currentTarget).data("idx");
            const oCItem: ICIRCLE_LIST_DAT = this.model.attributes.CIRCLE_LIST_DAT[nGrp][nIdx];

            app.m_collection_circle_favo.add(
                oCItem
            );

            storage_save();
        }

        evt_show_circle(oCEvt: any) {
            let nGrp: number = $(oCEvt.currentTarget).data("grp");
            let nIdx: number = $(oCEvt.currentTarget).data("idx");

            app.show_circle(nGrp, nIdx);
        }

        //
        render_table_tab(): void {
            const oCTbl: Array<ICIRCLE_LIST_TBL> = this.model.attributes.CIRCLE_LIST_TBL;

            $("#id_view_list").html(this.m_dictTemplate["#id_tpl_eventcatalog_list"].render({ "CIRCLE_LIST_TBL": oCTbl }));
        }

        //
        render_table_dat(): void {
            const oCTbl: Array<ICIRCLE_LIST_TBL> = this.model.attributes.CIRCLE_LIST_TBL;
            const oCDat: { [key: string]: Array<ICIRCLE_LIST_DAT> } = this.model.attributes.CIRCLE_LIST_DAT;

            for (let nT: number = 0; nT < oCTbl.length; nT++) {
                let listTable: Array<string> = [];

                for (let nD: number = 0; nD < oCDat[String(nT)].length; nD++) {
                    let oCItem = oCDat[String(nT)][nD];

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
        }

        //
        render() {

            if (this.model.isValid() == false) {
                app.get_event_series(
                    "/db/circlecheck/_design/catalog/_view/list_by_date?descending=true&limit=30"
                );
            } else {
                app.get_event_series(
                    "/db/circlecheck/_design/catalog/_view/list?descending=true&startkey=[\"" + this.model.attributes.EVENT_SERIES + "\", \"Z\"]&endkey=[\"" + this.model.attributes.EVENT_SERIES + "\", \"\"]"
                );

                this.render_table_tab();
                this.render_table_dat();

                $("#id_tab_circle_lst a:first").tab("show");

                resume();
            }

            return this;
        }
    }

    // -----------------------------------------------------------------------
    export class view_CCircleFavo extends Backbone.View<model_CCircleFavo> {
        private m_dictTemplate: ITEMPLATES;

        //
        constructor(options: any = {}) {
            super(options);

            this.listenTo(this.collection, "add", this.render);
            this.listenTo(this.collection, "remove", this.render);

            this.m_dictTemplate = options.dictTemplate;
        }

        //
        events(): Backbone.EventsHash {
            return {
                "click #id_view_favo button.evt-favo-remove": "evt_favo_remove",
                "click #id_view_favo button.evt-show-circle": "evt_show_circle",
                "click #id_view_favo button.evt-favo-check": "evt_favo_check",
            }
        }

        //
        evt_favo_remove(oCEvt: any) {
            const nGrp: number = $(oCEvt.currentTarget).data("grp");
            const nIdx: number = $(oCEvt.currentTarget).data("idx");
            const oCItem: ICIRCLE_LIST_DAT = app.m_model_event_catalog.attributes.CIRCLE_LIST_DAT[nGrp][nIdx];

            app.m_collection_circle_favo.remove(
                new model_CCircleFavo(oCItem)
            );

            storage_save();
        }

        //
        evt_show_circle(oCEvt: any) {
            let nGrp: number = $(oCEvt.currentTarget).data("grp");
            let nIdx: number = $(oCEvt.currentTarget).data("idx");

            app.show_circle(nGrp, nIdx);
        }

        //
        evt_favo_check(oCEvt: any) {
            let nGrp: number = $(oCEvt.currentTarget).data("grp");
            let nIdx: number = $(oCEvt.currentTarget).data("idx");
            let oCItem: ICIRCLE_LIST_DAT = app.m_model_event_catalog.attributes.CIRCLE_LIST_DAT[nGrp][nIdx];

            $("#id_row_favo_" + nGrp + "_" + nIdx).toggleClass("success");
        }

        //
        render_table_tab() {
        }

        //
        render_table_dat() {
            let listTable: Array<string> = [];

            for (var n = 0; n < this.collection.length; n++) {
                const oCItem: ICIRCLE_LIST_DAT = this.collection.models[n].attributes;

                listTable.push('<tr id="id_row_favo_' + oCItem.grp + '_' + oCItem.idx + '">');
                listTable.push('<td>' + this.m_dictTemplate["#id_tpl_favo_remove"].render(oCItem) + '</td>');
                listTable.push('<td>' + this.m_dictTemplate["#id_tpl_layout"].render(oCItem) + '</td>');
                listTable.push('<td>' + this.m_dictTemplate["#id_tpl_circleinfo"].render(oCItem) + '</td>');
                listTable.push('<td>' + this.m_dictTemplate["#id_tpl_show_circle_desc_2"].render(oCItem) + '</td>');
                listTable.push('</tr>')
            }

            $("#id_tbl_favo_0").html(listTable.join(''));
        }

        //
        render() {
            this.render_table_tab();
            this.render_table_dat();

            return this;
        }
    }

    // -----------------------------------------------------------------------
    export class view_CCircleFind extends Backbone.View<model_CEventCatalog> {
        private m_dictTemplate: ITEMPLATES;
        private m_hTimer: number = null;
        private m_strSearchKeyword: string = "";

        //
        constructor(options: any = {}) {
            super(options);

            this.m_dictTemplate = options.dictTemplate;
        }

        //
        events(): Backbone.EventsHash {
            return {
                "keyup #id_input_keyword": this.evt_search,
                "click button#id_btn_search": this.evt_search,
                "click #id_view_find button.evt-favo-append": this.evt_favo_append,
                "click #id_view_find button.evt-show-circle": this.evt_show_circle
            }
        }

        //
        evt_favo_append(oCEvt: any) {
            const nGrp: number = $(oCEvt.currentTarget).data("grp");
            const nIdx: number = $(oCEvt.currentTarget).data("idx");
            const oCItem: ICIRCLE_LIST_DAT = app.m_model_event_catalog.attributes.CIRCLE_LIST_DAT[nGrp][nIdx];

            app.m_collection_circle_favo.add(
                oCItem
            );

            storage_save();
        }

        evt_show_circle(oCEvt: any) {
            let nGrp: number = $(oCEvt.currentTarget).data("grp");
            let nIdx: number = $(oCEvt.currentTarget).data("idx");

            app.show_circle(nGrp, nIdx);
        }

        //
        search_circle_item(strKeyword: string, oCItem: ICIRCLE_LIST_DAT): boolean {
            let bFound: boolean = false;

            for (let n: number = 0; n < oCItem.circle_list.length; n++) {
                const oCDatItem = oCItem.circle_list[n];

                for (let k in oCDatItem) {
                    if (oCDatItem[k].indexOf(strKeyword, 0) != -1) bFound = true;
                }
            }
            return bFound;
        }

        //
        evt_search(oCEvt: any): void {
            const strKeyword: string = $("#id_input_keyword").val();

            if (!strKeyword) return;
            if (strKeyword.length < 2) return;
            if (strKeyword == this.m_strSearchKeyword) return;

            if (this.m_hTimer != null) {
                clearTimeout(this.m_hTimer);
                this.m_hTimer = null;
            }

            $("#id_search_progress").css("width", "0%");

            this.m_hTimer = setTimeout(
                function() {
                    app.m_view_circle_find.search(strKeyword)
                }, 1000
            );
        }

        //
        search(strKeyword: string): void {
            const oCTBL: Array<ICIRCLE_LIST_TBL> = app.m_model_event_catalog.attributes.CIRCLE_LIST_TBL
            const oCDAT: { [key: string]: Array<ICIRCLE_LIST_DAT> } = app.m_model_event_catalog.attributes.CIRCLE_LIST_DAT;
            let listFavItem: Array<ICIRCLE_LIST_DAT_ITEM> = [];

            $("#id_search_progress").css("width", "100%");

            this.collection.reset();

            for (let grp: number = 0; grp < oCTBL.length; grp++) {
                for (let idx: number = 0; idx < oCDAT[grp].length; idx++) {
                    let oCItem = oCDAT[grp][idx];

                    if (this.search_circle_item(strKeyword, oCItem) == true) {
                        this.collection.add(oCItem);
                    }
                }
            }

            this.m_strSearchKeyword = strKeyword;

            this.render();
        }

        //
        render() {
            let listTable: Array<string> = [];

            for (let n: number = 0; n < this.collection.length; n++) {
                const oCItem: ICIRCLE_LIST_DAT = this.collection.at(n).attributes;

                listTable.push('<tr id="' + "id_row_find_" + oCItem.grp + "_" + oCItem.idx + '">');
                listTable.push('<td>' + this.m_dictTemplate["#id_tpl_favo_append"].render(oCItem) + '</td>');
                listTable.push('<td>' + this.m_dictTemplate["#id_tpl_layout"].render(oCItem) + '</td>');
                listTable.push('<td>' + this.m_dictTemplate["#id_tpl_circleinfo"].render(oCItem) + '</td>');
                listTable.push('<td>' + this.m_dictTemplate["#id_tpl_show_circle_desc_1"].render(oCItem) + '</td>');
                listTable.push('</tr>');
            }

            $("#id_tbl_find_0").html(listTable.join(''));

            for (let n: number = 0; n < app.m_collection_circle_favo.length; n++) {
                const oCItem: ICIRCLE_LIST_DAT = app.m_collection_circle_favo.at(n).attributes;
                const strTargetId: string = "#id_row_find_" + oCItem.grp + "_" + oCItem.idx;

                $(strTargetId + " button.evt-favo-append").addClass("disabled");
                $(strTargetId).addClass("info");
            }

            if (this.collection.length > 0) {
                $("#id_search_result").html(
                    '<p class="text-center">' + this.collection.length + ' 件 見つかりました。</p>'
                );

            } else {
                $("#id_search_result").html(
                    '<p class="text-center">見つかりませんでした。</p>'
                );
            }

            return this;
        }
    }
}

// --------------------------------------------------------------------- [EOF]
