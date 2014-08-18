var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('underscore');
todoAppView = require('./views/mainview');
appRouter = require('./routers/router');

$(document).ready(function() {
    new todoAppView();
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