var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
appRouter = require('./routers/router');

$(document).ready(function() {
    new appRouter();
    Backbone.eventBus = _.extend({}, Backbone.Events);
    Backbone.history.start();
    $('#todofield').keyup(function() {
        if ($(this).val() !== "") {
            $('.submit').removeClass('disabled');
        } else {
            $('.submit').addClass('disabled');
        }
    });
});