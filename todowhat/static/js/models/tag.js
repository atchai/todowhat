var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');

module.exports = Backbone.Model.extend({
    defaults: {
        count: 1
    },

    addCount: function() {
    	this.save({'count': this.get('count')+1});
    },

    decreaseCount: function() {
    	this.save({'count': this.get('count')-1});
    }
})
