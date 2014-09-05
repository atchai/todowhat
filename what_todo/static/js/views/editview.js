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
        "click .save": "parseContent",
        "click .edit-add-tag": "showTagField",
        "click .edit-remove-tag": "removeTagsMode",
		"click .remove-tag-mode": "removeTag",
		"keyup #editfield": "liveUpdateTodo",
        "click .remove-reminder": "removeReminder"

    },

    initialize: function() {
        //Create empty array to contain any tags that are to be removed
    	this.tagsToRemoveArr = [];
    },
    render: function() {
        this.$el.html(template({
            modalId: 'modal' + this.model.cid,
            todoItem: this.model.get('content'),
            tags: this.model.getTags(),
            description: this.model.get('description'),
            reminder: this.model.get('reminder')
        }));
        return this;
    },

    /**
    * First step of updating the todo model
    * This prepares the todo content, tags and description
    * Then calls the parseReminder method with those as arguments
    */
    parseContent: function() {
        // Get whatever content user provided and assign to variables
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
        console.log('parseContent got done');
        // Go to second step of updating todo model
        this.parseReminder(newContent, tagsContent, description);

    },

    /**
    * Second step of updating the todo model
    * This prepares the requested reminder time (if given)
    * Then passes the todo content, tags, description and reminder time to saveChanges method
    */
    parseReminder: function(nC, tC, d) {
        console.log('parseReminder starting');
        //If the model doesn't already have a time set for reminder
        if (this.model.get('reminder') == null) {
            // get hours and minutes from input
            var hours = this.$('#hours').val();
            var minutes = this.$('#minutes').val();
            if (hours == 0) {hours = ''}
            if (minutes == 0) {minutes = ''}

            // If a reminder time was given
            if (hours!=='' || minutes!=='') {
                // Calculate time in milliseconds until the reminder
                var deltaTime = (hours*3.6*Math.pow(10,6)) + (minutes*6*Math.pow(10,4));
                var reminderTime = Date.now() + deltaTime;

                // Make sure the user has allowed notifications!
                this.checkNotificationPermission();
                // Show the success alert for setting reminder
                $('.alert-reminder').toggleClass('hide');
            }
        } else { // Otherwise just set the reminderTime variable to what is on the model
            reminderTime = this.model.get('reminder');
            this.$el.find('.modal').modal('hide');
        }
        var testfieldval = this.$('#testfield').val();
        this.saveChanges(nC, tC, d, reminderTime, testfieldval);

    },

    /**
    * Sends PUT request to server with updated content
    */
    saveChanges: function(newContent, tagsContent, description, reminderTime, tfv) {

	        this.model.save(
	    		{
	            	content: newContent,
	            	tags: tagsContent,
                    description: description,
                    reminder: reminderTime,
                    test: tfv
	   			},
	   			{
	   				wait: true,
	   				success: function() {
	   					Todos.fetch();
	   					Tags.fetch();
	   				}
	   			});
	        (this.model.validationError) ? this.$('.alert-danger').toggleClass('hide') : $('.modal-backdrop').remove()
    },

    showTagField: function() {
        this.$('#edittagfield').toggleClass('hide');
    },

    /**
    * 'Activates' mode where user can remove tags by clicking them
    */
    removeTagsMode: function() {
        this.$('.edit-tag').toggleClass('remove-tag-mode');
    },

    /**
    * This removes tags from the DOM and adds it to an array so all tags
    * to be removed can be done so at once when user saves changes
    */
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

	},

    /**
    * This resets any reminder the user may have set
    */
    removeReminder: function() {
        this.model.save({
            reminder: null
        });
        $('.modal-backdrop').remove();
    },

    checkNotificationPermission: function() {
        //Check browser supports notifications API
        if ("Notification" in window) {
            // Check permissions for notifications has been given
            if (Notification.permission == "default") {
                Notification.requestPermission();
            }
        } else {
            alert("Sorry! Your browser doesn't support notfication API");
        }
    }
});
