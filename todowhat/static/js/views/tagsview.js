var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
var Tags = require('../collections/tags');
var GuestTags = require('../collections/guesttags');
var TagView = require('./tagview');
var NavView = require('./navview');
var tagsTemplate = require('../../templates/tagsTemplate.html');
Backbone.$ = $;

module.exports = Backbone.View.extend({
    events: {
        "click .all-todo": "activateAll"
    },

    initialize: function() {
        this.listenTo(Backbone.eventBus, 'guestMode', this.guestMode);
        this.listenTo(Backbone.eventBus, 'userMode', this.userMode);
        this.listenTo(this.collection, 'reset', this.render);
        this.listenTo(this.collection, 'add', this.render); //so that new tags are added alphabetically
        this.listenTo(this.collection, 'remove', this.removeTagView);
        Tags.fetch();
    },

    /**
    * Renders list of all tags in collection.
    */
    render: function() {
        this.$el.empty();
        this.$el.append(tagsTemplate);
        Tags.each(function(t) {
            var tagList = new TagView({
                model: t
            });
            this.$el.append(tagList.render().el);
        }, this);
        if(!Tags.last()) {
           this.$el.append('<li class="list-group-item">No tags yet, trying adding one</li>');
        }
        return this;
    },

    /**
    * Renders the guest tags from local storage instead of
    * tags associated with a user from the server
    */
    guestMode: function() {
        // Set Tags variable to GuestTags collection
        Tags = GuestTags;
        // Fetch the guest tags from localStorage
        Tags.fetch();
        // Render the collection
        this.render();
    },

    /**
    * When logged in, make sure the guest tags collection is cleared.
    * Render the users own tags from the server.
    */
    userMode: function() {
        GuestTags.fetch();
        var length = GuestTags.length;
        for (var i = length - 1; i >= 0; i--) {
            GuestTags.at(i).destroy();
        }
        Tags.fetch();
        this.render();
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
        }
        else {
            $('.list-group-item.active').removeClass('active');
            $all.addClass('active');
        }
    }
});