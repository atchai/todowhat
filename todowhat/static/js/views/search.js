var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var TodosView = require ('./todos');
var template = require('../../templates/searchtemplate.html');
var Tags = require('../collections/tags');
var Todos = require('../collections/todos');
var GuestTodos = require('../collections/guesttodos');

module.exports = Backbone.View.extend({
	el: '.search-todos',

	events: {
		"keyup .search-field": "findTodos",
		"click .reset-search": "resetSearch"
	},

	initialize: function() {
        this.listenTo(Backbone.eventBus, 'guestMode', this.guestMode);
		this.listenTo(Todos, 'remove', this.checkVisible);
		this.listenTo(Todos, 'sync', this.checkVisible);
		this.render();
	},

    guestMode: function() {
        this.isGuest = true;
        Todos = GuestTodos;
    },

	render: function() {
		this.$el.prepend(template());
        return this;
	},

	checkVisible: function() {
		if (!Todos.last()) {//if collection is empty
            this.$el.addClass('hide');
		} else {
            this.$el.removeClass('hide');
		}
	},

	/**
	* Debounced function to filter Todos collection to those
	* containing the search term.
	*/
	findTodos: _.debounce(function(e) {
        var searchTerm = e.target.value;
        if (!searchTerm) {
        	this.resetSearch();
        }

        var filteredTodos = Todos.search(searchTerm);
        this.searchView = new TodosView({collection: filteredTodos});
        this.$('#todoul').html(this.searchView.render().el);
    }, 800),

	/**
	* Removes the search term from input box and removes the filtered
	* todos view.
	*/
    resetSearch: function() {
    	this.$('.search-field').val('');
    	this.searchView.remove();
    	Backbone.eventBus.trigger('filterAll');
    }
})
