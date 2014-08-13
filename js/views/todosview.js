var app = app || {};

app.TodosView = Backbone.View.extend({
	tagName: 'ul',

    el: $("#todoul"),
	initialize: function() {
		console.log(this.collection);
        this.listenTo(app.todos, 'reset', this.render);
        this.listenTo(app.todos, 'add', this.render);
        this.listenTo(app.todos, 'remove', this.render);
	},
	render: function() {

        this.$el.empty();
		this.collection.each(function(todo){
          var todoview = new app.TodoView({ model: todo });
          this.$el.prepend(todoview.render().el);
      }, this);
		if (!app.todos.last()) {
            this.$el.append('<li id="noTodos" class="list-group-item">Nothing to do</li>');
        }
      return this;
	}

})