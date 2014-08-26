var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var Todos = require('../collections/todos');
var MobileNavView = require('./mobilenavview');
var TagsView = require('./tagsview');
var Tags = require('../collections/tags');
var template = require('../../templates/navbartemplate.html')

module.exports = Backbone.View.extend({
	initialize: function() {
		this.listenTo(Tags, 'add', this.renderTags);
		this.listenTo(Backbone.eventBus, 'statusChanged', this.renderMobile);

	},
	
	render: function() {
		this.$el.html(template);
        this.renderMobile();
        this.renderTags();
        return this;
	},

	//renders mobile navigation links
	renderMobile: function() {
        this.$('.mobilelinks').html(new MobileNavView().render().el);
	},

	//renders mobile tags list
	renderTags: function() {
        this.$('.taglist').html(new TagsView({collection: Tags}).render().el);
	}
});