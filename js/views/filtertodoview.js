var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var Todos = require('../collections/todos');
var TodoView = require('./todoview');

module.exports = Backbone.View.extend({
    tagName: 'ul',
    id: 'todoul',
    initialize: function() {
        //changing done state of a model in this collection will rerender view so the todo is removed from view
        this.listenTo(this.collection, 'change', this.render);
        //likewise if the todo is removed from collection
        this.listenTo(this.collection, 'remove', this.render);
        //if a new todo is added to collection, ensure user is routed back to all todos view
        this.listenTo(this.collection, 'add', this.close);
    },

    /**
    * renders the todos that are yet to be done
    */
    render: function() {
        // Clear all the filter actives
        $('.list-group-item.active').removeClass('active');
        var thing = Todos.filterDone(false);
        this.$el.empty();
        thing.each(function(c) {
            var todoview = new TodoView({
                model: c
            });
            this.$el.prepend(todoview.render().el);
        }, this);
        //if there are no more todos in this filtered view, go back to all todos view
        if (!thing.last()) {
            this.close();
        }
        return this;
    },

    close: function() {
        Backbone.history.navigate('', true);
    }
})