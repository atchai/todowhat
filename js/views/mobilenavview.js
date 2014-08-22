var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var Todos = require('../collections/todos');

module.exports = Backbone.View.extend({
    template: _.template($('#mobile-nav-template').html()),

    render: function() {
        var html = this.template({
            items: [
                {
                    name: 'all',
                    href: '',
                    bold: ('' == window.location.hash)
                },
                {   
                    name: 'todo',
                    href: '#todo',
                    disabled: (Todos.filterDone(false).length == 0),
                    bold: ('#todo' == window.location.hash)
                },
                {
                    name: 'done',
                    href: '#done',
                    disabled: (Todos.filterDone(true).length == 0),
                    bold: ('#done' == window.location.hash)
                }
            ],
            current: window.location.hash
        });
        this.$el.html(html);
        return this;
    }
});