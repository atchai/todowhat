var app = app || {};

app.Tags = Backbone.Collection.extend({
	localStorage: new Backbone.LocalStorage("StoredTags"),

	model: app.Tag,
	comparator: 'name',

	exist: function(tag) {
		var existingTag = app.tags.find(function(model) {
				return model.get('name') == tag;
			});

		this.pluck('name').length == 0 ? app.tags.create({
			'name': tag
		}) :
			existingTag ?
			existingTag.addCount() : app.tags.create({
				'name': tag
			});
	},
	removeTag: function(tag) {
		var existingTag = app.tags.find(function(model) {
				return model.get('name') == tag;
			});
		existingTag.get('count')==1 ? existingTag.destroy() : existingTag.decreaseCount();
	}
});
app.tags = new app.Tags([]);