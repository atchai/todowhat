var app = app || {};

app.Todos = Backbone.Collection.extend({
	localStorage: new Backbone.LocalStorage("StoredTodos"),
	model: app.Todo,
	comparator: 'order',
	/**
	* this returns new collection containing only done or not done todos
	*/
	filterDone: function(status) {
		return new app.Todos(
			this.filter(function(todo) {
				return todo.get('done') === status;
			})
		);
	},
	/**
	* used to set order property of new model to one more than last existing model in collection
	*/
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