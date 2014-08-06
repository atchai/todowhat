var app = app || {};

app.Todos = Backbone.Collection.extend({
    localStorage: new Backbone.LocalStorage("StoredTodos"),
    model: app.Todo,
    comparator: 'order'
});
app.todos = new app.Todos([]);