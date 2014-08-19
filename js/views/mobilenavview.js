var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var Todos = require('../collections/todos');

module.exports = Backbone.View.extend({
    el: $('#mobilenavlinks'),

    template: _.template($('#mobile-nav-template').html()),

    render: function() {
        var html = this.template({
            items: [
                {   
                    name: 'todo',
                    href: '#todo',
                    disabled: (Todos.filterDone(false).length == 0),
                    bold: ('todo' == Backbone.history.fragment)
                },
                {
                    name: 'done',
                    href: '#done',
                    disabled: (Todos.filterDone(true).length == 0),
                    bold: ('done' == Backbone.history.fragment)
                },
                {
                    name: 'all',
                    href: '',
                    bold: ('' == Backbone.history.fragment)
                }
            ],
            current: Backbone.history.fragment
        });
        this.$el.html(html);
        return this;
    }
});