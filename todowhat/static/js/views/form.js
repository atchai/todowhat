var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var Todos = require('../collections/todos');
var GuestTodos = require('../collections/guesttodos');
var GuestTags = require('../collections/guesttags');
var TagsView = require('./tags');
var Tags = require('../collections/tags');
var template = require('../../templates/formtemplate.html');

module.exports = Backbone.View.extend({
    initialize: function() {
        this.listenTo(Backbone.eventBus, 'guestMode', this.guestMode);
    },

	events: {
		"click .submit": "parseInput",
		"keyup #todofield": "keyPressEventHandler",
        "keyup #tagsfield": "keyPressEventHandler"
	},

	render: function() {
		 this.$el.html(template);
		 return this;
	},

    guestMode: function() {
        this.isGuest = true;
        Todos = GuestTodos;
        Tags = GuestTags;
    },

    parseInput: function(e) {
        e.preventDefault();

        //cache input fields
        var todoContent = this.$('#todofield').val(),
            tagsContent = this.$('#tagsfield').val();

        //grabs tag values deliminated by commas and removes whitespace & repeats
        tagsContent = Tags.parseTags(this.$('#tagsfield').val());
        if (this.isGuest) {
            tagsContent.forEach(function(tag) {
                GuestTags.exist(tag);
            });
        }

        this.addTodo(todoContent, tagsContent);
    },

	/**
    * add a todo model (and tags) to the collection(s) using content in
    * input boxes
    */
	addTodo: function(todoContent, tagsContent) {
        Todos.create(
            {
                content: todoContent,
                order: Todos.newOrder(),
                tags: tagsContent
            },
            {
                //using Backbone collection.create so we must set wait:true so input can be validated by model
                wait: true,
                //if todo content was valid, see if tag(s) exists in collection so count can be updated appropriately
                success: function() {
                    Tags.fetch();
                }
            });

        this.$('#todofield').val('');
        this.$('#tagsfield').val('');
        this.$('.submit').addClass('disabled');

    },

    /**
    * clicks add todo button if enter key is pressed, toggles button appearance
    */
    keyPressEventHandler: function(event) {
        if (event.keyCode == 13 && this.$('#todofield').val()) {
            this.$(".submit").click();
            this.$("#todofield").focus();
        }

        if (this.$('#todofield').val()) {
            this.$('.submit').removeClass('disabled');
        } else {
            this.$('.submit').addClass('disabled');
        }

    }
});
