var app = app || {};

app.TagView = Backbone.View.extend({
	initialize: function() {
		this.listenTo(this.model, 'change', this.render)	
	},
	tagName: 'li',
	id: function() {
        return 'tag' + this.model.cid;
    },
	template: _.template($('#tag-template').html()),
	render: function() {
		
		$(this.el).addClass('list-group-item');
        var html = this.template({
            tagName: this.model.get('name') ,
            tagCount: this.model.get('count')
        });
        this.$el.html(html);
        return this;

    }

});