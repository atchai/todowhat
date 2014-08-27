var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var TodoView = require('./todoview');

/**
* View for all todos in the collection
*/
module.exports = Backbone.View.extend({
    el: "#todoul",

    initialize: function() {
        this.listenTo(this.collection, 'reset', this.render);
        this.listenTo(this.collection, 'add', this.render);
        this.listenTo(this.collection, 'remove', this.render);
    },
    /**
     * renders every todo in the app.todos collection
     */
    render: function() {
        this.$el.empty();
        this.collection.each(function(todo) {
            var todoview = new TodoView({
                model: todo
            });
            this.$el.prepend(todoview.render().el);
        }, this);
        if (!this.collection.last()) { //if collection is empty
            this.$el.append('<li id="noTodos" class="list-group-item">Nothing to do</li>');
        }
        return this;
    }

})