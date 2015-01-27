var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var TodoView = require('./todo');


/**
* Base class for View for all todos in a collection
*/
module.exports = Backbone.View.extend({
    initialize: function() {
        this.listenTo(this.collection, 'reset', this.render);
        this.listenTo(this.collection, 'add', this.addTodo);
    },

    tagName: 'ul',

    id: 'todoul',

    /**
    * Renders every todo in the todos collection.
    */
    render: function() {
        this.replaceTodosWith(this.collection);
        if (this.collection.last()) { //if collection is empty
            $('.search-todos').fadeIn();
        }

        return this;
    },

    replaceTodosWith: function(todos) {
        // Clear all the filter actives
        $('.list-group-item.active').removeClass('active');
        this.$el.empty();

        todos.each(function(todo) {
            var todoview = new TodoView({ model: todo });
            this.$el.prepend(todoview.render().el);
        }, this);
    },

    addTodo: function(todo) {
        var todoview = new TodoView({
                model: todo
            });

        $(todoview.render().el)
            .hide()
            .prependTo(this.$el)
            .slideDown({easing: "easeInOutQuart"});

        if (this.collection.last()) {
            $('.search-todos').fadeIn();
        }
    }

})
