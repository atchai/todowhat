var app = app || {};

app.NavView = Backbone.View.extend({
    el: $('#navlinks'),

    template: _.template($('#nav-template').html()),

    render: function() {
        var html = this.template({
            items: [
                {   
                    name: 'todo',
                    href: '#todo',
                    disabled: (app.todos.filterDone(false).length === 0),
                    bold: ('todo'==Backbone.history.fragment)
                },
                {
                    name: 'done',
                    href: '#done',
                    disabled: (app.todos.filterDone(true).length === 0),
                    bold: ('done'==Backbone.history.fragment)
                },
                {
                    name: 'all',
                    href: '',
                    bold: (''==Backbone.history.fragment)
                }
            ]
        });
        this.$el.html(html);
        return this;
    }
});