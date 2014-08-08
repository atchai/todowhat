var app = app || {};

app.TodoView = Backbone.View.extend({
    initialize: function(){
        this.listenTo(this.model, 'change', this.render)
    },
    tagName: 'li',
    id: function() {
        return this.model.cid;
    },
    events: {
        "click .remove": "removeTodo",
        "click .toggle": "toggleDone"
    },
    template: _.template($('#todo-template').html()),
    render: function() {
        var html = this.template({
            todoItem: this.model.get('content') ,
            done: this.model.get('done')
        });
        this.$el.html(html);
        return this;
    },
    removeTodo: function() {
        this.model.destroy();
    },
    toggleDone: function() {
        var done = this.model.get('done');
        this.model.save({'done': !done});
    }
});