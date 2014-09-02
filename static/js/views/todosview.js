var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var TodoView = require('./todoview');

/**
* View for all todos in the collection
*/
module.exports = Backbone.View.extend({
    // el: "#todoul",
    tagName: 'ul',
    id: 'todoul',
    initialize: function() {
        this.listenTo(this.collection, 'reset', this.render);
        // this.listenTo(this.collection, 'add', this.render);
        this.listenTo(this.collection, 'remove', this.render);
        // this.listenTo(Backbone.eventBus, 'serverCreatedTodo', this.render);
    },
    /**
     * renders every todo in the todos collection
     */
    render: function() {
        // Clear all the filter actives
        $('.list-group-item.active').removeClass('active');
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