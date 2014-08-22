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
    
    render: function() {
        var thing = Todos.filterDone(false);
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
    
    close: function() {
        Backbone.history.navigate('', true);
        this.stopListening();
    }
})