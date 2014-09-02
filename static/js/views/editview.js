var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var NavView = require('./navview');
var MobileNavView = require('./mobilenavview');
var Tags = require('../collections/tags');
var template = require('../../../templates/edittemplate.html');
var Todos = require('../collections/todos');

module.exports = Backbone.View.extend({
    tagName: 'span',
    events: {
        "click .save": "saveChanges",
        "click .edit-add-tag": "showTagField",
        "click .edit-remove-tag": "removeTagsMode",
		"click .remove-tag-mode": "removeTag",
		"keyup #editfield": "liveUpdateTodo"

    },
    initialize: function() {
    	this.tagsToRemoveArr = [];
    },
    render: function() {
        this.$el.html(template({
            modalId: 'modal' + this.model.cid,
            todoItem: this.model.get('content'),
            tags: this.model.getTags()
        }));
        return this;
    },

    saveChanges: function() {
        var newContent = this.$('#editfield').val();
        var newTags = this.$('#edittagfield').val();
        var oldTags = this.model.getTags();
        var tagsContent = _.map(newTags.split(','), function(t) {
            return t.trim();
        }).filter(Boolean);
        var oldAndNewTags = oldTags.concat(tagsContent);
        oldAndNewTags = _.uniq(oldAndNewTags, false);
        oldAndNewTags = _.difference(oldAndNewTags, this.tagsToRemoveArr);
        console.log('this is the array of old and new tags');
        console.log(oldAndNewTags);
        if (newContent == this.model.get('content') && oldAndNewTags == oldTags) {
        	this.$el.find('.modal').modal('hide');
        }
        else {
	        this.model.save(
	    		{
	            	content: newContent,
	            	tags: oldAndNewTags
	   			},
	   			{
	   				wait: true,
	   				success: function() {
	   					Todos.fetch();
	   					Tags.fetch();
	   				}
	   			});

	        if (this.model.validationError) {
	        	this.$('.alert-danger').toggleClass('hide');
	    	}
	    	else {
	    		$('.modal-backdrop').remove();
	    	}
    	}
    },
    showTagField: function() {
        this.$('#edittagfield').toggleClass('hide');
    },
    removeTagsMode: function() {
        this.$('.edit-tag').toggleClass('remove-tag-mode');
    },
	removeTag: function(e) {
		console.log('imhere');
		var tagToRemove = e.currentTarget.innerHTML;
		console.log(tagToRemove);
		this.tagsToRemoveArr.push(tagToRemove);
		console.log(this.tagsToRemoveArr);
		e.currentTarget.remove();
	},
	liveUpdateTodo: function() {
		var todo = this.$('#editfield').val();
		this.$el.closest('.list-group-item').find('span:eq(1)').html(todo);

	}
});
