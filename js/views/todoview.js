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
        $(this.el).addClass('list-group-item');
        var html = this.template({
            todoItem: this.model.get('content') ,
            done: this.model.get('done'),
            tags: this.model.getTags()
        });
        this.$el.html(html);
        return this;

    },
    removeTodo: function() {
        _.each(this.model.getTags(), function(tag) {
            app.tags.removeTag(tag)
        });
        this.model.destroy();
    },
    toggleDone: function() {
        var done = this.model.get('done');
        this.model.save({'done': !done});

        if (app.todos.filterDone(true).length==0) {
            $('#filterDone').addClass('disabled');
        }
        else {
            $('#filterDone').removeClass('disabled');
        }
        if (app.todos.filterDone(false).length==0) {
            $('#filterNotDone').addClass('disabled');
        }
        else {
            $('#filterNotDone').removeClass('disabled');
        }     
        // app.todos.trigger('reset');
        switch(app.router.filterParam) {
            case "done":
            case "todo":
                app.todos.trigger('reset'); 
                break;
            default:
                break;  
        }
    }
});