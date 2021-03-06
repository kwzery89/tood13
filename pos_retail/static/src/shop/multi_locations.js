odoo.define('pos_retail.multi_locations', function (require) {
    var screens = require('point_of_sale.screens');
    var core = require('web.core');
    var _t = core._t;
    var qweb = core.qweb;
    var PopupWidget = require('point_of_sale.popups');
    var gui = require('point_of_sale.gui');

    var popup_set_locations = PopupWidget.extend({
        template: 'popup_set_locations',
        show: function (options) {
            var self = this;
            this.options = options;
            this._super(options);
            this.location_selected = [];
            var locations = this.pos.stock_locations;
            this.$el.find('.card-content').html(qweb.render('locations_list', {
                locations: locations,
                widget: this
            }));
            this.$('.selection-item').click(function () {
                var location_id = parseInt($(this).data('id'));
                var location = self.pos.stock_location_by_id[location_id];
                if (location) {
                    if ($(this).closest('.selection-item').hasClass("item-selected") == true) {
                        $(this).closest('.selection-item').toggleClass("item-selected");
                        for (var i = 0; i < self.location_selected.length; ++i) {
                            if (self.location_selected[i].id == location.id) {
                                self.location_selected.splice(i, 1);
                            }
                        }
                        if (self.location_selected.length == 0) {
                            return self.wrong_input("div[class='card-content']", "(*) Please select minimum 1 location")
                        } else {
                            return self.passed_input("div[class='card-content']")
                        }
                    } else {
                        $(this).closest('.selection-item').toggleClass("item-selected");
                        self.location_selected.push(location);
                        if (self.location_selected.length != 0) {
                            return self.passed_input("div[class='card-content']")
                        }
                    }
                }
            });
            this.$('.confirm').click(function () {
                if (self.location_selected.length == 0) {
                    return self.wrong_input("div[class='card-content']", "(*) Please select minimum 1 location")
                } else {
                    self.pos.gui.close_popup();
                    var location_ids = [];
                    for (var i = 0; i < self.location_selected.length; i++) {
                        location_ids.push(self.location_selected[i]['id'])
                    }
                    return self.pos._get_stock_on_hand_by_location_ids([], location_ids).then(function (datas) {
                        self.pos.stock_datas_by_location_id = datas;
                        var stock_datas = {};
                        var products = [];
                        for (var location_id in datas) {
                            var stock_datas_by_location_id = datas[location_id];
                            for (var product_id in stock_datas_by_location_id) {
                                if (stock_datas[product_id] == undefined) {
                                    stock_datas[product_id] = stock_datas_by_location_id[product_id]
                                } else {
                                    stock_datas[product_id] += stock_datas_by_location_id[product_id]
                                }
                                var product = self.pos.db.product_by_id[product_id];
                                if (product) {
                                    products.push(product)
                                }
                            }
                        }
                        self.pos.db.stock_datas = stock_datas;
                        if (products.length) {
                            self.pos.gui.screen_instances["products"].do_update_products_cache(products);
                            self.pos.gui.screen_instances["products_operation"].refresh_screen();
                        }
                        return self.gui.show_popup('dialog', {
                            title: _t('Succeed'),
                            body: _t('Products Screen with display stock available with your stock locations selected'),
                            color: 'success'
                        });
                    });
                }
            });
            this.$('.cancel').click(function () {
                self.pos.gui.close_popup();
            });
        }
    });
    gui.define_popup({name: 'popup_set_locations', widget: popup_set_locations});

    var button_set_locations = screens.ActionButtonWidget.extend({
        template: 'button_set_locations',
        init: function (parent, options) {
            this._super(parent, options);
        },
        button_click: function () {
            if (this.pos.stock_locations.length != 0) {
                this.gui.show_popup('popup_set_locations', {
                    title: _t('Please Choice Stock Locations'),
                    body: _t('Please select locations and see all qty on hand of products')
                })
            } else {
                this.gui.show_popup('dialog', {
                    'title': 'Warning',
                    'body': 'Your stock locations have not any location checked to checkbox [Available in POS]. Please back to backend and config it'
                })
            }
        }
    });
    screens.define_action_button({
        'name': 'button_set_locations',
        'widget': button_set_locations,
        'condition': function () {
            return this.pos.stock_locations && this.pos.config.display_onhand && this.pos.config.multi_location_check_all_stock;
        }
    });

    var popup_set_location = PopupWidget.extend({
        template: 'popup_set_location',
        show: function (options) {
            var self = this;
            this.options = options;
            this._super(options);
            var stock_locations = this.pos.stock_locations;
            var locations = [];
            for (var i = 0; i < stock_locations.length; i++) {
                var location = stock_locations[i];
                if (location.company_id && location.company_id[0] == self.pos.company.id) {
                    locations.push(location)
                }
            }
            this.$el.find('.card-content').html(qweb.render('locations_list', {
                locations: locations,
                widget: this
            }));
            this.$('.selection-item').click(function () {
                var location_id = parseInt($(this).data('id'));
                var location = self.pos.stock_location_by_id[location_id];
                var order = self.pos.get_order();
                if (location && order) {
                    order.set_picking_source_location(location);
                    self.pos.gui.close_popup();
                } else {
                    self.pos.gui.show_popup('confirm', {
                        title: 'Warning',
                        body: 'Order is null or location not found'
                    });
                }
                return self.pos._get_stock_on_hand_by_location_ids([], [location_id]).then(function (stock_datas_by_location_id) {
                    self.pos.stock_datas_by_location_id = stock_datas_by_location_id;
                    var location = self.pos.get_picking_source_location();
                    var datas = stock_datas_by_location_id[location.id];
                    var products = [];
                    self.pos.db.stock_datas = datas;
                    for (var product_id in datas) {
                        var product = self.pos.db.product_by_id[product_id];
                        if (product) {
                            product['qty_available'] = datas[product_id];
                            products.push(product)
                        }
                    }
                    if (products.length) {
                        self.pos.gui.screen_instances["products"].do_update_products_cache(products);
                        self.pos.gui.screen_instances["products_operation"].refresh_screen();
                    }
                    return self.gui.show_popup('dialog', {
                        title: _t('Succeed'),
                        body: _t('Delivery Order of Selected Order will set Source Location from ' + location.name),
                        color: 'success'
                    });
                })
            });
            this.$('.cancel').click(function () {
                self.pos.gui.close_popup();
            });
        }
    });
    gui.define_popup({name: 'popup_set_location', widget: popup_set_location});

    var button_set_location = screens.ActionButtonWidget.extend({
        template: 'button_set_location',
        init: function (parent, options) {
            this._super(parent, options);
            this.pos.bind('change:selectedOrder', function () {
                this.renderElement();
                this.pos.update_stock_on_hand_products();
            }, this);
        },
        button_click: function () {
            if (this.pos.stock_locations.length != 0) {
                this.gui.show_popup('popup_set_location', {
                    title: _t('Change Default Stock Localtion of Orders'),
                    body: _t('This is list location have company the same your user company, Please choice location and add to order, when order done quantity available of product will reduce from location selected')
                })
            } else {
                this.gui.show_popup('dialog', {
                    'title': _t('Warning'),
                    'body': _t('Your stock locations have not any location checked to checkbox [Available in POS]. Please back to backend and config it')
                })
            }
        }
    });
    screens.define_action_button({
        'name': 'button_set_location',
        'widget': button_set_location,
        'condition': function () {
            return this.pos.config.multi_location && this.pos.stock_locations && this.pos.config.multi_location_update_default_stock;
        }
    });

    var button_check_stock = screens.ActionButtonWidget.extend({
        template: 'button_check_stock',
        button_click: function () {
            var order = this.pos.get_order();
            if (!order) {
                return this.pos.gui.show_popup('dialog', {
                    title: _t('Warning'),
                    body: _t('Have not order selected, please select order')
                })
            }
            var selected_line = order.get_selected_orderline();
            if (!selected_line) {
                return this.pos.gui.show_popup('dialog', {
                    title: _t('Warning'),
                    body: _t('Have not line selected, please select line')
                })
            }
            if (selected_line.product.type != 'product') {
                return this.pos.gui.show_popup('dialog', {
                    title: _t('Warning'),
                    body: _t('Product selected have type is not Storable Product')
                })
            }
            return this.pos.update_onhand_by_product(selected_line.product)
        }
    });
    screens.define_action_button({
        'name': 'button_check_stock',
        'widget': button_check_stock,
        'condition': function () {
            return this.pos.config.multi_location && this.pos.config.display_onhand && this.pos.config.multi_location_check_stock_line_selected;
        }
    });
});