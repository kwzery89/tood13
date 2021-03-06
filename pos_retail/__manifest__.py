# -*- coding: utf-8 -*-
# License: Odoo Proprietary License v1.0
{
    'name': "POS All-In-One (Shop & Restaurant)",
    'version': '1.3.1.1.3',
    'category': 'Point of Sale',
    'author': 'TL Technology',
    'live_test_url': 'http://posodoo.com/web/signup',
    'price': '450',
    'website': 'http://posodoo.com/web/signup',
    'sequence': 0,
    'depends': [
        'sale_stock',
        'account',
        'sale_management',
        'bus',
        'stock',
        'purchase',
        'product',
        'product_expiry',
        'pos_restaurant',
        'pos_discount',
    ],
    'demo': ['demo/demo_data.xml'],
    'data': [
        'security/ir.model.access.csv',
        'security/group.xml',
        'security/ir_rule.xml',
        'views/pos_menu.xml',
        'reports/pos_lot_barcode.xml',
        'reports/pos_sale_analytic.xml',
        'reports/report_pos_order.xml',
        'reports/pos_sale_report_template.xml',
        'reports/pos_sale_report_view.xml',
        'reports/pos_order_report.xml',
        'datas/product.xml',
        'datas/schedule.xml',
        'datas/email_template.xml',
        'datas/customer.xml',
        'datas/res_partner_type.xml',
        'datas/barcode_rule.xml',
        'datas/pos_loyalty_category.xml',
        'import/import_libraties.xml',
        'views/pos_config.xml',
        'views/pos_config_image.xml',
        'views/pos_session.xml',
        'views/product_template.xml',
        'views/product_variant.xml',
        'views/product_barcode.xml',
        'views/product_pricelist.xml',
        'views/pos_order.xml',
        'views/pos_payment.xml',
        'views/sale_order.xml',
        'views/pos_loyalty.xml',
        'views/res_partner_credit.xml',
        'views/res_partner_group.xml',
        'views/res_partner_type.xml',
        'views/res_partner.xml',
        'views/res_users.xml',
        'views/pos_promotion.xml',
        'views/account_journal.xml',
        'views/account_move.xml',
        'views/pos_voucher.xml',
        'views/pos_branch.xml',
        'views/pos_tag.xml',
        'views/pos_note.xml',
        'views/pos_combo_item.xml',
        'views/stock_production_lot.xml',
        'views/stock_picking.xml',
        'views/pos_quickly_payment.xml',
        'views/pos_global_discount.xml',
        'views/purchase_order.xml',
        'views/medical_insurance.xml',
        'views/pos_call_log.xml',
        'views/pos_category.xml',
        'views/pos_cache_database.xml',
        'views/sale_extra.xml',
        'views/product_packaging.xml',
        'views/pos_iot.xml',
        'views/pos_sync_session_log.xml',
        'views/pos_service_charge.xml',
        'views/pos_cache_config.xml',
        'wizards/sale_order_line_insert.xml',
        'wizards/remove_pos_order.xml',
        'wizards/pos_remote_session.xml',
        'wizards/pos_box.xml',
    ],
    'qweb': [
        'static/src/xml/*.xml',
    ],
    "currency": 'EUR',
    'installable': True,
    'application': True,
    'images': ['static/description/icon.png'],
    'support': 'thanhchatvn@gmail.com',
    "license": "OPL-1",
    'post_init_hook': '_auto_clean_cache_when_installed',
}
