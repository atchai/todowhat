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
	},
	newOrder: function() {
		if (this.last()) {
			return this.last().get('order') + 1;
		}
		else {
			return 0;
		}
	}
});
app.todos = new app.Todos([]);