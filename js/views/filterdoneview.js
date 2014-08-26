var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var Todos = require('../collections/todos');
var TodoView = require('./todoview');

module.exports = Backbone.View.extend({
    el: "#todoul",
    initialize: function() {
        //changing done state of a model in this collection will rerender view so the todo is removed from view
        this.listenTo(this.collection, 'change', this.render);
        //likewise if the todo is removed from collection
        this.listenTo(this.collection, 'remove', this.render);
        //if a new todo is added to collection, ensure user is routed back to all todos view
        this.listenTo(this.collection, 'add', this.close);
        //when user is on all todos view, stop listening to changes in collection to prevent this view rerendering
        this.listenTo(Backbone.eventBus, 'filterAll', this.stopListening);
    },
    
    /**
    * renders the todos that have been done
    */
    render: function() {
        var thing = Todos.filterDone(true);
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
    },

    close: function() {
    	Backbone.history.navigate('', true);
    }
})