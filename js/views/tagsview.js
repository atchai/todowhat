var app = app || {};

app.TagsView = Backbone.View.extend({
    tagName: 'ul',

    el: $("#taglist"),
    initialize: function() {
        console.log(this.collection);
        this.listenTo(this.collection, 'reset', this.render);
        this.listenTo(this.collection, 'add', this.render); //so that new tags are added alphabetically
        this.listenTo(this.collection, 'remove', this.removeTagView);
    },
    render: function() {
        this.$el.empty();
        console.log('hi');
        app.tags.each(function(t) { //all tags to be visible in taglist always
            var tagList = new app.TagView({
                model: t
            });
            this.$el.append(tagList.render().el);
        }, this);
        return this; // returning this for chaining..
    },

    removeTagView: function(tag) {
        var cid = '#tag' + tag.cid;
        $(cid).remove();
    }

})