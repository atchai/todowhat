var app = app || {};

app.Todo = Backbone.Model.extend({
    defaults: {
        done: false,
        order: 0
    },
    getTags: function() {
    	return this.get('tags');
    },
    validate: function (attrs) {
        if(attrs.content=='') {
        	return 'bad';
        }
    }
})