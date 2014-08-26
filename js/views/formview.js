var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var Todos = require('../collections/todos');
var TagsView = require('./tagsview');
var Tags = require('../collections/tags');
var template = require('../../templates/formtemplate.html');

module.exports = Backbone.View.extend({
	events: {
		"click .submit": "addTodo",
		"keyup #todofield": "keyPressEventHandler",
        "keyup #tagsfield": "keyPressEventHandler"
	},
    
	render: function() {
		 this.$el.html(template);
		 return this;
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
        //grabs tag values deliminated by commas and removes whitespace
        tagsContent = _.map(this.$tagsfield.val().split(','), function(t) {
            return t.trim();
        }).filter(Boolean);
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
                        _.each(tagsContent, function(t) {
                            Tags.exist(t);
                        });
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