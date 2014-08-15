var app = app || {};

app.TodosView = Backbone.View.extend({
	tagName: 'ul',

    el: $("#todoul"),

	initialize: function() {
        this.listenTo(this.collection, 'reset', this.render);
        this.listenTo(this.collection, 'add', this.render);
        this.listenTo(this.collection, 'remove', this.remove);
	},
	/**
	* renders every todo in the app.todos collection
	*/
	render: function() {
        this.$el.empty();
		this.collection.each(function(todo){
          var todoview = new app.TodoView({ model: todo });
          this.$el.prepend(todoview.render().el);
      }, this);
		if (!this.collection.last()) {//if collection is empty
            this.$el.append('<li id="noTodos" class="list-group-item">Nothing to do</li>');
        }
      return this;
	}, 

	remove: function(todo) {
		var that = this;
		console.log(todo.cid);
		$('#'+todo.cid).toggle( "fade" );
		setTimeout(function(){that.render()}, 650);
	}

})