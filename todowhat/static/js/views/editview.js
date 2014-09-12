var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var NavView = require('./navview');
var MobileNavView = require('./mobilenavview');
var Tags = require('../collections/tags');
var GuestTags = require('../collections/guesttags');
var GuestTodos = require('../collections/guesttodos');
var template = require('../../templates/edittemplate.html');
var Todos = require('../collections/todos');

module.exports = Backbone.View.extend({
    tagName: 'span',
    events: {
        "click .save": "parseContent",
        "click .edit-add-tag": "showTagField",
        "click .edit-remove-tag": "removeTagsMode",
		"click .remove-tag-mode": "removeTag",
		"keyup #editfield": "liveUpdateTodo",
        "click .remove-reminder": "removeReminder",
        "click .activate-reminder-mode": "activateReminderMode"

    },

    initialize: function() {
        //Create empty array to contain any tags that are to be removed
    	this.tagsToRemoveArr = [];
        this.notifySupported = ("Notification" in window);
    },
    render: function() {
        this.$el.html(template({
            modalId: 'modal' + this.model.cid,
            todoItem: this.model.get('content'),
            tags: this.model.getTags(),
            description: this.model.get('description'),
            reminder: this.model.get('reminder'),
            notifySupported: this.notifySupported
        }));
        return this;
    },

    activateReminderMode: function() {
        this.$('.set-reminder').toggleClass('hide');
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
        var tagsContent = Tags.parseNewTags(newTags, oldTags, this.tagsToRemoveArr);
        this.parseReminder(newContent, tagsContent, description);

    },

    /**
    * Second step of updating the todo model
    * This prepares the requested reminder time (if given)
    * Then passes the todo content, tags, description and reminder time to saveChanges method
    */
    parseReminder: function(nC, tC, d) {
        var hours, minutes, reminderTime, oldReminderTime;
        //If the model doesn't already have a time set for reminder
        hours = this.$('#hours').val();
        minutes = this.$('#minutes').val();
        oldReminderTime = this.model.get('reminder');

        if (!oldReminderTime) {
            reminderTime = this.model.parseReminderTime(hours, minutes);
            // Check the user has allowed notifications
            this.checkNotificationPermission();
            // Show the success alert for setting reminder
        }

        else { // Otherwise just set the reminderTime variable to what is on the model
            reminderTime = oldReminderTime
            this.$el.find('.modal').modal('hide');
        }

        this.saveChanges(nC, tC, d, reminderTime);
    },

    /**
    * Sends PUT request to server with updated content
    */
    saveChanges: function(newContent, tagsContent, description, reminderTime) {
            this.model.get('tags').forEach(function(tag) {
                GuestTags.removeTag(tag);
            });
            tagsContent.forEach(function(tag){
                GuestTags.exist(tag);
            });

            this.model.save(
                {
                    content: newContent,
                    tags: tagsContent,
                    description: description,
                    reminder: reminderTime
                },
                {
                    wait: true,
                    success: function() {
                        Tags.fetch();
                    }
                });
	        (this.model.validationError) ? this.$('.alert-danger').toggleClass('hide') : $('.modal-backdrop').remove()
    },

    showTagField: function() {
        if (this.$('#edittagfield').is( ":hidden" ) ) {
            console.log('yo');
        this.$('#edittagfield').slideDown({duration:"fast", easing: "easeInQuad"}); }
        else { this.$('#edittagfield').slideUp();}
    },

    /**
    * 'Activates' mode where user can remove tags by clicking them
    */
    removeTagsMode: function() {
        this.$('.edit-tag').toggleClass('remove-tag-mode');
    },

    /**
    * This removes tags from the DOM and adds tag name to an array so all tags
    * to be removed can be done so at once when user saves changes
    */
	removeTag: function(e) {
		var tagToRemove = e.currentTarget
		this.tagsToRemoveArr.push(tagToRemove.innerHTML);
		tagToRemove.remove();
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
            if (Notification.permission == "default" || Notification.permission == "denied") {
                Notification.requestPermission();
            }
        } else {
            alert("Sorry! Your browser doesn't support notfication API");
        }
    }
});
