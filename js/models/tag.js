var app = app || {};

app.Tag = Backbone.Model.extend({
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