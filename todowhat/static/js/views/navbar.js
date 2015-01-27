var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var Todos = require('../collections/todos');
var MobileNavView = require('./navigation/mobileStatus');
var TagsView = require('./tags');
var Tags = require('../collections/tags');
var template = require('../../templates/navbartemplate.html')

/**
* View for top navigation bar - contains navigation links and tag list for small screens
*/
module.exports = Backbone.View.extend({
	initialize: function() {
		this.listenTo(Tags, 'add', this.renderMobileTags);
		this.listenTo(Backbone.eventBus, 'statusChanged', this.renderMobileLinks);
		this.listenTo(Backbone.eventBus, 'guestMode', this.guestMode);
	},

	render: function() {
		this.$el.html(template({guest: this.guest}));
        this.renderMobileLinks();
        this.renderMobileTags();
        return this;
	},
	guestMode: function() {
		this.guest = true;
		this.render();
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
