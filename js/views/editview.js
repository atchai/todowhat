var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var NavView = require('./navview');
var MobileNavView = require('./mobilenavview');
var Tags = require('../collections/tags');
var template = require('../../templates/edittemplate.html');

module.exports = Backbone.View.extend({
	tagName: 'span',
	events: {
		"click .save": "saveChanges"
	},
	render: function() {
		this.$el.html(template({
			modalId: 'modal'+this.model.cid,
            todoItem: this.model.get('content'),
            tags: this.model.getTags()
        }));
        return this;
	},

	saveChanges: function() {
        var newContent = this.$('#editfield').val();
        console.log(this.$el);
        this.model.save({'content': newContent});
$('.modal-backdrop').remove();
    }
});