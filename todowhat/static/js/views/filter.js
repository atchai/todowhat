var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var TodosView = require('./todos');

/**
 * Base class for a filtered todos list view
 */
module.exports = TodosView.extend({

    initialize: function() {
        // Changing done state will rerender view so the todo is removed
        this.listenTo(this.todoList, 'change', this.render);
        // If a new todo is added to collection, ensure user is routed back to all todos view
        this.listenTo(this.collection, 'add', this.close);
    },

    /**
    * Renders the todos that have been set to done.
    */
    render: function() {
        this.refresh();
        TodosView.prototype.replaceTodosWith.call(this, this.todoList);

        if (!this.todoList.last()) {
            this.close();
        }

        return this;
    },

    close: function() {
    	Backbone.history.navigate('', true);
    }
})
