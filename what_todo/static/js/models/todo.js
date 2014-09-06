var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');

module.exports = Backbone.Model.extend({
    defaults: {
        done: false,
        order: 0
    },

    getTags: function() {
    	return this.get('tags');
    },
    /**
    * validates the content from input field
    */
    validate: function(attrs) {
        //no empty strings allowed
        if(attrs.content.trim()=='') {
            return 'Todo field cannot be blank';
        }
        //no todo over 255 chars allowed
        if (attrs.content.length > 255) {
            return 'mal';
        }
    },

    parseReminderTime: function(hours, minutes) {
        if (hours == 0) {hours = ''}
        if (minutes == 0) {minutes = ''}
        // If a reminder time was given
        if (hours || minutes) {
            // Make user confirm they want to close the window
            window.onbeforeunload = function() {
                return 'You have a reminder set.';
            };
        // Calculate time in milliseconds until the reminder
        var deltaTime = (hours*3.6*Math.pow(10,6)) + (minutes*6*Math.pow(10,4));
        var reminderTime = Date.now() + deltaTime;
        return reminderTime;
        }
    }
})