var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var Todos = require('../collections/todos');
var MobileNavView = require('./mobilenavview');
var TagsView = require('./tagsview');
var Tags = require('../collections/tags');
var template = require('../../templates/navbartemplate.html')

/**
* View for top navigation bar - contains navigation links and tag list for small screens
*/
module.exports = Backbone.View.extend({
	initialize: function() {
		this.listenTo(Tags, 'add', this.renderMobileTags);
		this.listenTo(Backbone.eventBus, 'statusChanged', this.renderMobileLinks);
	},
	
	render: function() {
		this.$el.html(template);
        this.renderMobileLinks();
        this.renderMobileTags();
        return this;
	},

	//renders mobile navigation links
	renderMobileLinks: function() {
        this.$('.mobilelinks').html(new MobileNavView().render().el);
	},

	//renders mobile tags list
	renderMobileTags: function() {
        this.$('.taglist').html(new TagsView({collection: Tags}).render().el);
	}
});