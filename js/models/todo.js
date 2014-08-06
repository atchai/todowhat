var app = app || {};

app.Todo = Backbone.Model.extend({
    defaults: {
        done: false,
        order: 0
    },
    localStorage: new Backbone.LocalStorage("StoredTodos")	
})