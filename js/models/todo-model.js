app.TodoModel = Backbone.Model.extend({
    defaults: {
        done: false,
        order: 0
    },
    toggle: function() {
        this.save({
            done: !this.get("done")
        });
    }
})