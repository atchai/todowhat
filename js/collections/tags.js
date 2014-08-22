var Backbone = require('backbone');
var _ = require('underscore');
var Tag = require('../models/tag');
Backbone.$ = window.$;
Backbone.LocalStorage = require('backbone.localstorage');

var Tags = Backbone.Collection.extend({
	localStorage: new Backbone.LocalStorage("StoredTags"),

	model: Tag,

	comparator: 'name', //so that models are inserted into collection alphabetically

	exist: function(tag) { //check if tag with same name exists in collection already
		var existingTag = this.find(function(model) {
				return model.get('name') == tag;
			});

		this.pluck('name').length == 0 ? this.create({
			'name': tag
		}) :
			existingTag ?
			existingTag.addCount() : this.create({
				'name': tag
			});

	},

	removeTag: function(tag) {
		var existingTag = this.find(function(model) {
				return model.get('name') == tag;
			});
		existingTag.get('count')==1 ? existingTag.destroy() : existingTag.decreaseCount();
	}
});
module.exports = new Tags([]);