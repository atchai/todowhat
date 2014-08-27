var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var Todo = require('../models/todo');
Backbone.LocalStorage = require('backbone.localstorage')

Todos = Backbone.Collection.extend({
	localStorage: new Backbone.LocalStorage("StoredTodos"),
	model: Todo,
	comparator: 'order',
	/**
	* this returns new collection containing only done or not done todos
	* status argument is boolean value
	*/
	filterDone: function(status) {
		return new Todos(
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
	},
	search : function(letters){
      if(letters == "") return this;
      var pattern = new RegExp(letters,"gi");
      return _(this.filter(function(data) {
          return pattern.test(data.get("content"));
      }));
  }
});
module.exports = new Todos([]);