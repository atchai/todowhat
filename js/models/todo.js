var app = app || {};

app.Todo = Backbone.Model.extend({
    defaults: {
        done: false,
        order: 0
    },

    getTags: function() {
    	return this.get('tags');
    },
    /**
    * validates the content from input field (no empty strings)
    */
    validate: function (attrs) {
        if(attrs.content.trim()=='') {
        	return 'mal';
        }
    }
})