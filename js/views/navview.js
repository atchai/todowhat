var app = app || {};

app.NavView = Backbone.View.extend({
    el: $('#navlinks'),

    template: _.template($('#nav-template').html()),

    render: function() {
        var allDone, noneDone, boldDone, boldNotDone, boldAll;
        switch (app.router.filterParam) {
            case 'done':
                boldDone = true;
                break;
            case 'todo':
                boldNotDone = true;
                break;
            default:
                boldAll = true;
                break;
        }
        if (app.todos.filterDone(true).length === 0) {
            noneDone = true;
        }
        if (app.todos.filterDone(false).length === 0) {
            allDone = true;
        }
        var html = this.template({
            done: allDone,
            todo: noneDone,
            boldDone: boldDone,
            boldNotDone: boldNotDone,
            boldAll: boldAll
        });
        this.$el.html(html);
        return this;
    }
});