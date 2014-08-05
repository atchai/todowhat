app.TodosCollection = Backbone.Collection.extend({
    localStorage: new Backbone.LocalStorage("StoredTodos"),
    model: app.TodoModel,
    comparator: 'order'
})
app.todos = new app.TodosCollection([]);