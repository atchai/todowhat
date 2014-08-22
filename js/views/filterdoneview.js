var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var Todos = require('../collections/todos');
var TodoView = require('./todoview');

module.exports = Backbone.View.extend({
    tagName: 'ul',
    el: $("#todoul"),
    initialize: function() {
        //changing done state of a model in this collection will rerender view so the todo is removed from view
        this.listenTo(this.collection, 'change', this.render);
        this.listenTo(this.collection, 'add', this.close);
        this.listenTo(this.collection, 'remove', this.render);
        this.listenTo(Backbone.eventBus, 'stopFilter', this.stopListening);
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
        if (!thing.last()) {
            this.close();
        }
    },

    /**
    * stops listening to events from the todos collection so that
    * toggling done states of todos does not cause this view to render again
    */
    close: function() {
    	Backbone.history.navigate('', true);
        this.stopListening();
    }
})