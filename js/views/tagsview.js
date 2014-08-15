var app = app || {};

app.TagsView = Backbone.View.extend({
    tagName: 'ul',

    el: $("#taglist"),

    initialize: function() {
        this.listenTo(this.collection, 'reset', this.render);
        this.listenTo(this.collection, 'add', this.render); //so that new tags are added alphabetically
        this.listenTo(this.collection, 'remove', this.removeTagView);
    },

    /**
    * renders list of all tags in collection
    */
    render: function() {
        this.$el.empty();
        this.$el.append('<li class="list-group-item tags-head"><span class="glyphicon glyphicon-tags"></span>tags</li>');
        app.tags.each(function(t) {
            var tagList = new app.TagView({
                model: t
            });
            this.$el.append(tagList.render().el);
        }, this);
        return this;
    },

    /**
    * removes a tag from the list if no longer in the collection
    */
    removeTagView: function(tag) {
        var cid = '#tag' + tag.cid;
        $(cid).remove();
    }
})