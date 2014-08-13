var app = app || {};

app.TagsView = Backbone.View.extend({
    tagName: 'ul',

    el: $("#taglist"),
    initialize: function() {
        this.listenTo(this.collection, 'reset', this.render);
        this.listenTo(this.collection, 'add', this.render); //so that new tags are added alphabetically
        this.listenTo(this.collection, 'remove', this.removeTagView);
    },
    render: function() {
        this.$el.empty();
        app.tags.each(function(t) {
            var tagList = new app.TagView({
                model: t
            });
            this.$el.append(tagList.render().el);
        }, this);
        return this;
    },

    removeTagView: function(tag) {
        var cid = '#tag' + tag.cid;
        $(cid).remove();
    }

})