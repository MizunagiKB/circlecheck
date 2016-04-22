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
    var model_CCircleDesc_Hist = (function (_super) {
        __extends(model_CCircleDesc_Hist, _super);
        function model_CCircleDesc_Hist(attributes, options) {
            _super.call(this, attributes, options);
        }
        return model_CCircleDesc_Hist;
    }(Backbone.Model));
    ccheck.model_CCircleDesc_Hist = model_CCircleDesc_Hist;
    var view_CCircleDesc_Hist = (function (_super) {
        __extends(view_CCircleDesc_Hist, _super);
        function view_CCircleDesc_Hist(options, dictTemplate) {
            _super.call(this, options);
            this.listenTo(this.model, "change", this.render);
        }
        view_CCircleDesc_Hist.prototype.events = function () {
            return {};
        };
        view_CCircleDesc_Hist.prototype.render = function () {
            var strBaseAddress = window.location.href.split("?")[0];
            var oCTpl = Hogan.compile($("#id_tpl_circledesc_hist").html());
            var listCDescHist = [];
            if (this.model.attributes && this.model.attributes.rows) {
                for (var n = 0; n < this.model.attributes.rows.length; n++) {
                    listCDescHist.push({
                        id: this.model.attributes.rows[n].id,
                        circle: this.model.attributes.rows[n].key[0],
                        base_address: strBaseAddress,
                        EVENT_NAME: this.model.attributes.rows[n].value.EVENT_NAME,
                        LAYOUT: this.model.attributes.rows[n].value.LAYOUT,
                        EVENT_ST: this.model.attributes.rows[n].value.EVENT_ST
                    });
                }
                $("#id_circle_desc_hist").html(oCTpl.render({
                    rows: listCDescHist
                }));
            }
            return this;
        };
        return view_CCircleDesc_Hist;
    }(Backbone.View));
    ccheck.view_CCircleDesc_Hist = view_CCircleDesc_Hist;
})(ccheck || (ccheck = {}));
//# sourceMappingURL=ccheck_cdesc.js.map