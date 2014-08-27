var Backbone = require('backbone');
var _ = require('underscore');
var Tag = require('../models/tag');
Backbone.$ = window.$;
Backbone.LocalStorage = require('backbone.localstorage');

var Tags = Backbone.Collection.extend({
	localStorage: new Backbone.LocalStorage("StoredTags"),

	model: Tag,

	comparator: 'name', //so that models are inserted into collection alphabetically

	/**
	* Check if tag with same name exists in collection already
	*/
	exist: function(tag) {
		//try and grab the tag we're looking for in the collection by name
		var existingTag = this.find(function(model) {
				return model.get('name') == tag;
			});

		//if there are no tags or tags with same name in collection, create new tag
		if (this.pluck('name').length == 0 || !existingTag) {
		    this.create({name: tag});
		} else {//otherwise increase count on the existing tag with same name
		    existingTag.addCount();
		}

	},
	/**
	* Remove a tag/decrease tag count
	*/
	removeTag: function(tag) {
		var existingTag = this.find(function(model) {
				return model.get('name') == tag;
			});	
		existingTag.get('count') == 1 ? existingTag.destroy() : existingTag.decreaseCount();
	}
});

//calling this module from others returns a new tag model
module.exports = new Tags([]);