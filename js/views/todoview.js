var app = app || {};

app.TodoView = Backbone.View.extend({
    initialize: function(){
        //changing done state of model will rerender the view of that todo, toggling appropriate styling
        this.listenTo(this.model, 'change', this.render);
        this.$navlinks = $('#navlinks');
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

    /**
    * renders view of a todo as well as the navigation links
    *
    */
    render: function() {
        this.$el.addClass('list-group-item');
        var html = this.template({
            todoItem: this.model.get('content') ,
            done: this.model.get('done'),
            tags: this.model.getTags()
        });
        this.$el.html(html);
        this.$navlinks.empty();
        var links = new app.NavView({});
        this.$navlinks.append(links.render().el);
        return this;
    },

    /**
    * removes model from collection, and decreases count of associated tags
    */
    removeTodo: function() {
        _.each(this.model.getTags(), function(tag) {
            app.tags.removeTag(tag);
        });
        this.model.destroy();
    },

    toggleDone: function() {
        var done = this.model.get('done');
        this.model.save({'done': !done});
    }
});
