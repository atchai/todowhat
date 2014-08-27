var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var template = require('../../templates/tagtemplate.html');

module.exports = Backbone.View.extend({
    events: {
        'click .tag': 'activateTag'
    },

	initialize: function() {
		this.listenTo(this.model, 'change', this.render)
	},

	tagName: 'li',

	id: function() {
        return 'tag' + this.model.cid;
    },

	render: function() {
		$(this.el).addClass('list-group-item');
        this.$el.html(template({
            tagName: this.model.get('name') ,
            tagCount: this.model.get('count')
        }));
        return this;
    },

    activateTag: function(e) {
        $('.list-group-item.active').removeClass('active');
        this.$el.addClass('active');
    }
});