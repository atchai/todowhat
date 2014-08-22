var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var Todos = require('../collections/todos');

module.exports = Backbone.View.extend({
    initialize: function() {
        //listens for change in done status so navigation link can be disabled if necessary
        this.listenTo(Backbone.eventBus, 'statusChanged', this.render);
        //listens for change in router so relevant navigation link is given active styling
        this.listenTo(Backbone.eventBus, 'routeChanged', this.render);
    },

    template: _.template($('#nav-template').html()),

    render: function() {
        var html = this.template({
            //data for navigation links
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
                
            ]
        });
        this.$el.html(html);
        return this;
    }
});