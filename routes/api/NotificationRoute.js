var email 	= require("emailjs");
var ctx = require('../util/conf.js').context();

var server 	= email.server.connect({
   user:     "admin@upsalsa.com",
   password: "sAlsA123!",
   host:     "smtp.zoho.com",
   port:     465,
   ssl:      true
});


exports.notify = function(req, res, next) {

  if (ctx.NOTIFICATIONS_ENABLED) {
    var message	= {
       text:	JSON.stringify(req.body),
       from:	"No Reply <admin@upsalsa.com>",
       to:		"upsalsa@gmail.com",
       subject:	"Notification POST" + req.originalUrl
    };

    // send the message and get a callback with an error or details of the message that was sent
    server.send(message, function(err, message) { console.log(err || message); });
  } else {
    console.warn("Notifications are disabled");
  }
  
  next();
}
