var app = app || {};

app.FilterTodoView = Backbone.View.extend({
    tagName: 'ul',
    el: $("#todoul"),
    initialize: function() {
        //changing done state of a model in this collection will rerender view so the todo is removed from view
        this.listenTo(this.collection, 'change', this.render);
        this.listenTo(this.collection, 'add', this.close);
    },
    render: function() {
        var thing = app.todos.filterDone(false);
        this.$el.empty();
        thing.each(function(c) {
            var todoview = new app.TodoView({
                model: c
            });
            this.$el.prepend(todoview.render().el);
        }, this);
        if (!thing.last()) {
            console.log('none left redirect to root route');
            this.close();
        }
    },
    close: function() {
        app.router.navigate('', true);
        this.stopListening();
    }

})