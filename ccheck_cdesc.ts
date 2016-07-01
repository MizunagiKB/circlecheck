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

    // ---------------------------------------------------------- interface(s)
    interface ICIRCLE_DESC_HIST {
        id: string;
        circle: string;
        base_address: string;
        EVENT_NAME: string;
        LAYOUT: string;
        EVENT_ST: string;
    }

    // --------------------------------------------------------------- enum(s)
    // ------------------------------------------------------ Global Object(s)
    // -------------------------------------------------------------- class(s)
    // -----------------------------------------------------------------------
    /*!
     */
    export class model_CCircleDesc_Hist extends Backbone.Model {

        //
        constructor(attributes?: any, options?: any) {
            super(attributes, options);
        }
    }

    // -----------------------------------------------------------------------
    /*!
     */
    export class view_CCircleDesc_Hist extends Backbone.View<model_CCircleDesc_Hist> {
        //
        constructor(options?: Backbone.ViewOptions<model_CCircleDesc_Hist>, dictTemplate?: any) {
            super(options);

            this.listenTo(this.model, "change", this.render);
        }

        //
        events(): Backbone.EventsHash {
            return {
            }
        }

        //
        render() {
            const strBaseAddress: string = window.location.href.split("?")[0];
            const oCTpl: Hogan.template = Hogan.compile($("#id_tpl_circledesc_hist").html());
            let listCDescHist: Array<ICIRCLE_DESC_HIST> = [];

            if (this.model.attributes && this.model.attributes.rows) {

                for (let n: number = 0; n < this.model.attributes.rows.length; n++) {
                    listCDescHist.push(
                        {
                            id: this.model.attributes.rows[n].id,
                            circle: this.model.attributes.rows[n].key[0],
                            base_address: strBaseAddress,
                            EVENT_NAME: this.model.attributes.rows[n].value.EVENT_NAME,
                            LAYOUT: this.model.attributes.rows[n].value.LAYOUT,
                            EVENT_ST: this.model.attributes.rows[n].value.EVENT_ST
                        }
                    );
                }

                $("#id_circle_desc_hist").html(
                    oCTpl.render(
                        {
                            rows: listCDescHist
                        }
                    )
                )
            }

            return this;
        }
    }
}

// --------------------------------------------------------------------- [EOF]
