var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var Todos = require('../collections/todos');
var template = require('../../templates/mobilenavtemplate.html')

/**
* View for navigation links on small screens
*/
module.exports = Backbone.View.extend({
    initialize: function() {
        //listens for change in todos so navigation link can be disabled if necessary
        this.listenTo(Backbone.eventBus, 'statusChanged', this.render);
        this.listenTo(Todos, 'remove', this.render);
        this.listenTo(Todos, 'add', this.render);
        //listens for change in router so relevant navigation link is given active styling
        this.listenTo(Backbone.eventBus, 'routeChanged', this.render);
    },

    render: function() {
        this.$el.html(template({
            items: [
                {
                    name: 'all',
                    href: '#',
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
        }));
        return this;
    }
});