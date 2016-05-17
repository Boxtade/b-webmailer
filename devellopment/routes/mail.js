var tokenGenerator = require('rand-token').uid;
var handlebars = require('handlebars');
var mail = require('b-mailer');
var fs = require('fs');
var token = 0;
var origin = undefined;
var timeOut;
var options;

var resetValues = function(){
  token = 0;
  origin = undefined;
};

exports.setting = function(opt){
  options = opt;
};

exports.send = function(request,response){
  clearTimeout(timeOut);
  var now = new Date();
  var date = now.getDay()+"-"+now.getMonth()+"-"+now.getFullYear()+"_"+now.getHours()+":"+now.getMinutes()+":"+now.getSeconds();

  if(request.headers.token === token && token !== 0) {
    if (request.headers.origin === origin && origin !== undefined) {
      resetValues();
      var data = {
        message:request.body.message
      };

      fs.readFile(options.template, 'utf-8', function(error, source){
        var template = handlebars.compile(source);
        var html = template(data);

        var mailOptions = {
          to:options.to,
          subject: options.subject,
          html: html
        };
        mail.sendOptionSync(options.setting, mailOptions,function(){
          response.status(200).json({response:200});
        });
      });
    }
    else {
      fs.appendFile('bwebmailer.log',date+" error origine\n");
      response.status(405);
    }
  }
  else{
      fs.appendFile('bwebmailer.log',date+" error token\n");
      response.status(405);
  }
};

exports.token = function(request,response){
  token = tokenGenerator(64);
  origin = request.headers.origin;
  timeOut = setTimeout(resetValues,1000);
  response.status(200).json({token:token});
};