var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var TagView = require('./tag');
var NavView = require('./nav');
var tagsTemplate = require('../../templates/tagsTemplate.html');
var Tags = require('../collections/tags');
var GuestTags = require('../collections/guesttags');
Backbone.$ = $;

module.exports = Backbone.View.extend({
    events: {
        "click .all-todo": "activateAll"
    },

    initialize: function() {
        this.listenTo(Backbone.eventBus, 'guestMode', this.guestMode);
        this.listenTo(Backbone.eventBus, 'userMode', this.userMode);
        this.listenTo(Backbone.eventBus, 'todoRemoved', this.render);

        //so that new tags are added alphabetically
        this.listenTo(Tags, 'add', this.render);
        this.listenTo(Tags, 'reset', this.render);
        this.listenTo(Tags, 'remove', this.removeTagView);

        Tags.fetch();
    },

    /**
    * Renders list of all tags in collection.
    */
    render: function() {
        //this.$el.empty();
        this.$el.html(tagsTemplate);

        Tags.each(function(t) {
                var tagList = new TagView({ model: t });
                this.$el.append(tagList.render().el);
            }, this);

        if(!Tags.last()) {
           this.$el.append('<li class="list-group-item">No tags yet, try adding one</li>');
        }
        return this;
    },

    /**
    * Renders the guest tags from local storage instead of
    * tags associated with a user from the server
    */
    guestMode: function() {
        Tags = GuestTags;
        Tags.fetch();
        this.render();
    },

    userMode: function() {
        GuestTags.fetch();
        for (var i = GuestTags.length- 1; i >= 0; i--) {
          GuestTags.at(i).destroy();
        }
    },

    /**
    * Removes a tag from the list if no longer in the collection.
    */
    removeTagView: function(tag) {
        var cid = '#tag' + tag.cid;
        $(cid).remove();
    },

    activateAll: function() {
        var $all = this.$('.all-todo').parent();
        if($all.hasClass('active')) {
            $all.removeClass('active');
        } else {
            $('.list-group-item.active').removeClass('active');
            $all.addClass('active');
        }
    }
});
