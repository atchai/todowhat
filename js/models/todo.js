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
    validate: function (attrs) {
        //no empty strings allowed
        if(attrs.content.trim()=='') {
        	return 'mal';
        }
        //no todo over 255 chars allowed
        if (attrs.content.length > 255) {
            return 'mal';
        }
    }
})