var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
appRouter = require('./routers/router');

$(document).ready(function() {
    Backbone.eventBus = _.extend({}, Backbone.Events);
    new appRouter();
    Backbone.history.start();
    $('#todofield').keyup(function() {
        if ($(this).val() !== "") {
            $('.submit').removeClass('disabled');
        } else {
            $('.submit').addClass('disabled');
        }
    });
});