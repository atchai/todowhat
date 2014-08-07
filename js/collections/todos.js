var app = app || {};

app.Todos = Backbone.Collection.extend({
	localStorage: new Backbone.LocalStorage("StoredTodos"),
	model: app.Todo,
	comparator: 'order',
	filterDone: function(status) {
		filtered = this.filter(function(todo) {
			return todo.get('done') === status;
		});
		return new app.Todos(filtered);
	}
});
app.todos = new app.Todos([]);