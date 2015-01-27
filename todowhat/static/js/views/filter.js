var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var Todos = require('../collections/todos');
var TodoView = require('./todo');

module.exports = Backbone.View.extend({
    tagName: 'ul',

    id: 'todoul',

    initialize: function() {
        // Changing done state of a model in this collection will rerender view so the todo is removed from view
        this.listenTo(this.collection, 'change', this.render);
        // Likewise if the todo is removed from collection
        this.listenTo(this.collection, 'remove', this.render);
        // If a new todo is added to collection, ensure user is routed back to all todos view
        this.listenTo(this.collection, 'add', this.close);
    },

    /**
    * Renders the todos that have been set to done.
    */
    render: function() {
        $('.list-group-item.active').removeClass('active');
        this.$el.empty();

        this.todoList.each(function(c) {
            var todoview = new TodoView({ model: c });
            this.$el.prepend(todoview.render().el);
        }, this);

        if (!this.todoList.last()) {
            this.close();
        }

        return this;
    },

    close: function() {
    	Backbone.history.navigate('', true);
    }
})
