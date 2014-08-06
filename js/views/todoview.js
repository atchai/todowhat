app.TodoView = Backbone.View.extend({
    tagName: 'li',
    id: function() {
        return this.model.cid
    },
    events: {
        "click .remove": "removeTodo"
    },
    template: _.template($('#todo-template').html()),
    render: function() {
        var html = this.template({
            todoItem: this.model.get('content')
        });
        this.$el.html(html);
        return this;
    },
    removeTodo: function() {
        this.model.destroy();
    }
});