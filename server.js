var express = require('express');
var app = express();
var mangojs = require('mongojs');
var db = mangojs('iotlist',['iotlist']);
var ep = mangojs('endpoint',['endpoint']);
var bodyParser = require('body-parser');
var request = require('request');
var nodemailer = require('nodemailer');
var cron = require('node-cron');
var payment = "basic";
var paid = false;
var notification = false;
var notifycontent;


app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token, X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    next();
});
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

app.post('/payment/:type', function(req,res){
  console.log("I receive a payment POST request");
  payment = req.params.type;
  paid = yes;
});

app.get('/iotlist', function(req,res){
  console.log("I receive a iotlist GET request");
  db.iotlist.find(function(err,docs){
    console.log(docs);
    res.json(docs);
  });
});

app.get('/resource/discover', function(req,res){
  console.log("I receive a resource Discover request");
  
  var object = req.query.object;
  var instance = req.query.instance;
  var resource = req.query.resource;
  console.log(object + "/" + instance + "/" + resource);
  postData = {"object": object, "instance": instance, "resource": resource};
  request.get('http://localhost:3000/resource/discover',{json: postData},function(error,response,body){
    if(error){
      res.json({"code" : 400, "status" : "Discover Resource Failed!"});
      return;
    }else if(response.statusCode == 200){
      console.log(body);
      res.json(body);
      return;
    }else{
      res.json({"code" : 400, "status" : "Discover Resource Failed!"});
      return;
    }
  });
});

app.get('/resource/read', function(req,res){
  console.log("I receive a resource Read request");
  var object = req.query.object;
  var instance = req.query.instance;
  var resource = req.query.resource;
  console.log(object + "/" + instance + "/" + resource);
  postData = {"object": object, "instance": instance, "resource": resource}
  request.get('http://localhost:3000/resource/read',{json: postData},function(error,response,body){
    if(error){
      res.json({"code" : 400, "status" : "Read Resource Failed!"});
      return;
    }else if(response.statusCode == 200){
      console.log(body);
      res.json(body);
      return;
    }else{
      res.json({"code" : 400, "status" : "Read Resource Failed!"});
      return;
    }
  });
});


app.post('/resource', function(req,res){
  console.log("I receive a resource attribute POST request");
  console.log(req.body);
  request.post('http://localhost:3000/resource',{json: req.body},function(error,response,body){
    if(error){
      res.json({"code" : 400, "status" : "Post Resource Failed!"});
      return;
    }else if(response.statusCode == 200){
      console.log(body);
      res.json(body);
      return;
    }else{
      res.json({"code" : 400, "status" : "Post Resource Failed!"});
      return;
    }
  });
});

app.put('/resource/write', function(req,res){
  console.log("I receive a resource write request");
  var object = req.body.object;
  var instance = req.body.instance;
  var resource = req.body.resource;
  var value = req.body.value;
  console.log(object + "/" + instance + "/" + resource + "/" + value);
  postData = {"object": object, "instance": instance, "resource": resource, "value": value}
  request.put('http://localhost:3000/resource/write',{json:postData},function(error,response,body){
    if(error){
      res.json({"code" : 400, "status" : "Post Resource Failed!"});
      return;
    }else if(response.statusCode == 200){
      console.log(body);
      res.json(body);
      return;
    }else{
      res.json({"code" : 400, "status" : "Post Resource Failed!"});
      return;
    }
  });
});

app.put('/resource/observe', function(req,res){
  console.log("I receive a resource observe request");
  var object = req.body.object;
  var instance = req.body.instance;
  var resource = req.body.resource;
  console.log(object + "/" + instance + "/" + resource);
  postData = {"object": object, "instance": instance, "resource": resource}
  request.put('http://localhost:3000/resource/observe',{json:postData},function(error,response,body){
    if(error){
      res.json({"code" : 400, "status" : "Post Resource Failed!"});
      return;
    }else if(response.statusCode == 200){
      console.log(body);
      res.json(body);
      return;
    }else{
      res.json({"code" : 400, "status" : "Post Resource Failed!"});
      return;
    }
  });
});

app.put('/resource/cancel', function(req,res){
  console.log("I receive a resource cancel request");
  notification = false;
  var object = req.body.object;
  var instance = req.body.instance;
  var resource = req.body.resource;
  console.log(object + "/" + instance + "/" + resource);
  postData = {"object": object, "instance": instance, "resource": resource}
  request.put('http://localhost:3000/resource/cancel',{json:postData},function(error,response,body){
    if(error){
      res.json({"code" : 400, "status" : "Post Resource Failed!"});
      return;
    }else if(response.statusCode == 200){
      console.log(body);
      res.json(body);
      return;
    }else{
      res.json({"code" : 400, "status" : "Post Resource Failed!"});
      return;
    }
  });
});

app.put('/resource/writeAttr', function(req,res){
  console.log("I receive a resource write attribute request");
  var object = req.body.object;
  var instance = req.body.instance;
  var resource = req.body.resourceId;
  console.log(object + "/" + instance + "/" + resource);
  postData = {"object": object, "instance": instance, "resource": resource}
  request.put('http://localhost:3000/resource/writeAttr',{json:req.body},function(error,response,body){
    if(error){
      res.json({"code" : 400, "status" : "Post Resource Attribute Failed!"});
      return;
    }else if(response.statusCode == 200){
      console.log(body);
      res.json(body);
      return;
    }else{
      res.json({"code" : 400, "status" : "Post Resource Attribute Failed!"});
      return;
    }
  });
});

app.get('/iotlist', function(req,res){
  console.log("I receive a GET request");
  db.iotlist.find(function(err,docs){
    console.log(docs);
    res.json(docs);
  });
});

app.post('/bootstrap', function(req,res){
  console.log("I receive a bootstrap request");
  var postData = {iot_client_uri:req.body.iot_client_uri, name: req.body.name, model: req.body.model};
  ep.endpoint.findOne({name: req.body.name}, function(err,doc){
    if(doc==null) {
      ep.endpoint.insert(postData);
    }
  });
  res.json({"iot_server_uri":"http://localhost:3001", "name":"Server", "id":"cmpe273server"});
});

app.post('/iotlist', function(req, res){
  console.log("I receive a post request");
  console.log(req.body);
  db.iotlist.insert({name: req.body.name, object: req.body.object, instance: req.body.instance, value: req.body.value}, function(err,doc){
      res.json(doc);
  });
});

app.delete('/iotlist/:id', function(req,res){
  console.log("I receive a delete request");
  var id = req.params.id;
  console.log(id);
  db.iotlist.remove({_id: mangojs.ObjectId(id)}, function(err,doc){
    if(!err) {
        res.json(doc);
        return;
    }else{
      res.json(err);
      return;
    }
  });
});

app.get('/iotlist/:id', function(req,res){
  var id = req.params.id;
  console.log(id);
  db.iotlist.findOne({_id: mangojs.ObjectId(id)}, function(err,doc){
    res.json(doc);
  });
});

app.put('/iotlist/:id', function(req,res){
  var id = req.params.id;
  console.log(req.body.name);
  console.log(req.params.id);
  db.iotlist.findAndModify({query: {_id: mangojs.ObjectId(id)},
    update: {$set: {name: req.body.name, object: req.body.object, instance: req.body.instance, value: req.body.value}},
    new: true}, function(err,doc){
      res.json(doc);
    });
});

app.put('/notify', function(req,res){
  console.log(req.body.object);
  notification = true;
  notifycontent = req.body;

  var smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'benforest1980@gmail.com',
        pass: 'cowmilk29'
    }
};
var transporter = nodemailer.createTransport(smtpConfig);

  var mailOptions = {
      from: '"hanping lin" <hanping.lin@sjsu.edu>', // sender address
      to: '153638921@qq.com', // list of receivers
      subject: 'PIR Motion Detected!!!', // Subject line
      text: 'Warning!!!' , // plain text body
      html: '<b>Warning!!!</b>' // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
  });
});

app.put('/payment', function(req,res){
  console.log(req.body);

  var smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'benforest1980@gmail.com',
        pass: 'cowmilk29'
    }
};
var transporter = nodemailer.createTransport(smtpConfig);

if(req.body.payment == "basic"){
  var mailOptions = {
      from: '"hanping lin" <hanping.lin@sjsu.edu>', // sender address
      to: '153638921@qq.com', // list of receivers
      subject: 'You Have Chosen Basic Payment for client!!', // Subject line
      text: 'Monthly Bill is Basic!!!' , // plain text body
      html: '<b>Payment Bill!!! 10 USD per month!!!</b>' // html body
  };
}
if(req.body.payment == "premium"){
  var mailOptions = {
      from: '"hanping lin" <hanping.lin@sjsu.edu>', // sender address
      to: '153638921@qq.com', // list of receivers
      subject: 'You Have Chosen Premium Payment for client!!', // Subject line
      text: 'Monthly Bill is Premium!!!' , // plain text body
      html: '<b>Payment Bill!!! 100 USD per month!!!</b>' // html body
  };
}

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
  });
});


app.get('/resource/check', function(req,res){
  if(notification == true){
    res.json(notifycontent);
  }else res.json(notification);
});

app.listen(3001);
console.log("Server running on port 3001");
