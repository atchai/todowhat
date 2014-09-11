var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var Todos = require('../collections/todos');
var GuestTodos = require('../collections/guesttodos');
var GuestTags = require('../collections/guesttags');
var TagsView = require('./tagsview');
var Tags = require('../collections/tags');
var template = require('../../templates/formtemplate.html');

module.exports = Backbone.View.extend({
    initialize: function() {
        this.listenTo(Backbone.eventBus, 'guestMode', this.guestMode);
    },
	events: {
		"click .submit": "addTodo",
		"keyup #todofield": "keyPressEventHandler",
        "keyup #tagsfield": "keyPressEventHandler"
	},

	render: function() {
		 this.$el.html(template);
		 return this;
	},
    guestMode: function() {
        Todos = GuestTodos;
        Tags = GuestTags;
    },
	/**
    * add a todo model (and tags) to the collection(s) using content in
    * input boxes
    */
	addTodo: function(e) {
        e.preventDefault();
        //cache input fields
        this.$todofield = this.$('#todofield');
        this.$tagsfield = this.$('#tagsfield');
        var todoContent, tagsContent;
        todoContent = this.$todofield.val();
        tagsContent = this.$tagsfield.val();
        //grabs tag values deliminated by commas and removes whitespace & repeats
        tagsContent = Tags.parseTags(this.$tagsfield.val());
        tagsContent.forEach(function(tag) {
                            GuestTags.exist(tag);
                        });
        Todos.create(
                {
                    content: todoContent,
                    order: Todos.newOrder(),
                    tags: tagsContent
                },
                {
                    //using .create so we must set wait:true so input can be validated by model
                    wait: true,
                    //if todo content was valid, see if tag(s) exists in collection so count can be updated appropriately
                    success: function() {
                        Todos.fetch();
                        Tags.fetch();
                    }
                });

        this.$todofield.val('');
        this.$tagsfield.val('');
        this.$('.submit').addClass('disabled');

    },
    /**
    * clicks add todo button if enter key is pressed, toggles button appearance
    */
    keyPressEventHandler: function(event) {
        if (event.keyCode == 13) {
            this.$(".submit").click();
        }
        if (this.$('#todofield').val() !== "") {
            this.$('.submit').removeClass('disabled');
        } else {
            this.$('.submit').addClass('disabled');
        }

    }
});