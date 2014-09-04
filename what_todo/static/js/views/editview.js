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
            tags: this.model.getTags(),
            description: this.model.get('description')
        }));
        return this;
    },

    saveChanges: function() {
        var newContent = this.$('#editfield').val();
        var description = this.$('#descriptionfield').val();
        var newTags = this.$('#edittagfield').val();
        var oldTags = this.model.getTags();
        //clean up string of new tags into usable array and concatenate with the old tags
        var tagsContent = oldTags.concat(Tags.parseTags(newTags));
        //remove any duplicate tag which may already be in old tags array
        tagsContent = _.uniq(tagsContent, false);
        //remove any tags which are to be removed from the todo
        tagsContent = _.difference(tagsContent, this.tagsToRemoveArr);
        //if the user did not change anything just close the edit dialog
        if (newContent == this.model.get('content') && tagsContent == oldTags) {
        	this.$el.find('.modal').modal('hide');
        } else {
	        this.model.save(
	    		{
	            	content: newContent,
	            	tags: tagsContent,
                    description: description
	   			},
	   			{
	   				wait: true,
	   				success: function() {
	   					Todos.fetch();
	   					Tags.fetch();
	   				}
	   			});
	        (this.model.validationError) ? this.$('.alert-danger').toggleClass('hide') : $('.modal-backdrop').remove()
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
