odoo.define('einv_pos_sa.pos', function (require) {
    "use strict";

       var gui = require('point_of_sale.gui');
    var screens = require('point_of_sale.screens');
    var core = require('web.core');
    var QWeb = core.qweb;
    var _t = core._t;
        screens.ReceiptScreenWidget.include({
               render_receipt: function () {
            this._super();
            if (1==1) {
                var order = this.pos.get_order();
                var receipt_reference = order.get_name();
                var receipt_subtotal = order.get_subtotal();
                 var qrcode= document.getElementById("qrcode");
                    if (qrcode){
                        var QR_CODE = new QRCode(qrcode, {
                        width: 125,
                        height: 125,
                        colorDark: "#000000",
                        colorLight: "#ffffff",
                        correctLevel: QRCode.CorrectLevel.H,
                    });
                        var st=receipt_reference;
                         st+="\n";
                         st+="PRICE :";
                         st+="\n";
                         st+=receipt_subtotal;
                         st+="\n";
                         st+="TOOD";
                        QR_CODE.makeCode(st);

                    }

            }
        },
//        print_xml: function () {
//            if (1==1) {
//                var env = {
//                    widget: this,
//                    pos: this.pos,
//                    order: this.pos.get_order(),
//                    receipt: this.pos.get_order().export_for_printing(),
//                    paymentlines: this.pos.get_order().get_paymentlines(),
//                };
//                // TODO: print barcode via tag <barcode>
//                var receipt = QWeb.render("XmlReceipt", env);
//                var barcode = this.$el
//                    .find("#barcode")
//                    .parent()
//                    .html();
//                receipt = receipt.split('<img id="barcode"/>');
//                receipt[0] = receipt[0] + barcode + "</img>";
//                receipt = receipt.join("");
//                this.pos.proxy.print_receipt(receipt);
//                this.pos.get_order()._printed = true;
//            } else {
//                this._super();
//            }
//        },
    });

    });