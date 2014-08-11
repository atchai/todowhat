var app = app || {};

app.Todo = Backbone.Model.extend({
    defaults: {
        done: false,
        order: 0
    },
    getTags: function() {
    	return this.get('tags');
    },
    localStorage: new Backbone.LocalStorage("StoredTodos")	
})