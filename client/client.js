var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var request = require('request');
var pool = mysql.createPool({
  connectionLimit : 100,
  host      : 'localhost',
  user      : 'root',
  password  : 'Zijie0722',
  database  : 'clientdb'
});
var bsserver = '';

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token, X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    next();
});

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use('/', router);

app.get('/resource/discover', function(req,res){
  var object = req.body.object;
  var instance = req.body.instance;
  var resource = req.body.resource;
  if(typeof object == "undefined" || object==null || object=="") {
    res.json({"code" : 404, "status" : "no object id!"});
    return;
  }
  var querySql = "select object,instance,resourceId from resource";
  var queryCon = " where object = ?";
  var queryPar = [object];
  if(typeof instance !== "undefined" && instance!=="" && instance!==null) {
    queryCon += " and instance = ?";
    queryPar.push(instance);
    if(typeof resource !== "undefined" && resource!=="" && resource!==null) {
      queryCon += " and resourceId = ?";
      queryPar.push(resource);
      querySql = "select object,instance,resourceId,minimumPeriod,maximumPeriod,greaterThan,lessThan,step,cancel from resource"
    }
  }
  console.log(querySql);
  pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }
        console.log('connected as id ' + connection.threadId);
        connection.query(querySql+queryCon, queryPar, function(err,rows){
            connection.release();
            if(!err) {
                res.json(rows);
                  console.log(rows);
                return;
            }
        });
        connection.on('error', function(err) {
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;
        });
  });
});

app.get('/resource/read', function(req,res){
  var object = req.body.object;
  var instance = req.body.instance;
  var resource = req.body.resource;
  if(typeof object == "undefined" || object==null || object=="") {
    res.json({"code" : 404, "status" : "no object id!"});
    return;
  }
  var querySql = "select object,instance,resourceId,value from resource";
  var queryCon = " where object = ?";
  var queryPar = [object];
  if(typeof instance !== "undefined" && instance!=="" && instance!==null) {
    queryCon += " and instance = ?";
    queryPar.push(instance);
    if(typeof resource !== "undefined" && resource!=="" && resource!==null) {
      queryCon += " and resourceId = ?";
      queryPar.push(resource);
    }
  }
  console.log(querySql);
  pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }
        console.log('connected as id ' + connection.threadId);
        connection.query(querySql+queryCon, queryPar, function(err,rows){
            connection.release();
            if(!err) {
                res.json(rows);
                  console.log(rows);
                return;
            }
        });
        connection.on('error', function(err) {
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;
        });
  });
});


app.put('/resource/write', function(req, res){
  console.log("I receive a resource Write request");
  var object = req.body.object;
  var instance = req.body.instance;
  var resource = req.body.resource;
  var value = req.body.value;
  if(typeof object == "undefined" || object==null || object=="") {
    res.json({"code" : 404, "status" : "no object id!"});
    return;
  }
  var querySql = "update resource set value = ? where object = ?";
  var queryPar = [value, object];
  if(typeof instance !== "undefined" && instance!=="" && instance!==null) {
    querySql += " and instance = ?";
    queryPar.push(instance);
  }
  if(typeof resource !== "undefined" && resource!=="" && resource!==null) {
    querySql += " and resourceId = ?";
    queryPar.push(resource);
  }
  console.log(querySql);
  pool.getConnection(function(err,connection){
      if (err) {
        res.json({"code" : 100, "status" : "Error in connection database"});
        return;
      }
      console.log('connected as id ' + connection.threadId);
      connection.query(querySql, queryPar, function(err,rows){
          if(!err) {
            connection.query("select object,instance,resourceId,value from resource where object = ? and instance = ? and resourceId = ?", [object,instance,resource], function(err,data){
              connection.release();
              if(!err) {
                console.log(data);
                res.json(data);
                return;
              }
          });
        }
      });
      connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
      });
    });
});

app.put('/resource/observe', function(req, res){
  console.log("I receive a resource Observe request");
  var object = req.body.object;
  var instance = req.body.instance;
  var resource = req.body.resource;
  if(typeof object == "undefined" || object==null || object=="") {
    res.json({"code" : 404, "status" : "no object id!"});
    return;
  }
  var querySql = "update resource set cancel = 'no' where object = ?";
  var queryPar = [object,instance, resource];
  if(typeof instance !== "undefined" && instance!=="" && instance!==null) {
    querySql += " and instance = ?";
    queryPar.push(instance);
  }
  if(typeof resource !== "undefined" && resource!=="" && resource!==null) {
    querySql += " and resourceId = ?";
    queryPar.push(resource);
  }
  console.log(querySql);
  pool.getConnection(function(err,connection){
      if (err) {
        res.json({"code" : 100, "status" : "Error in connection database"});
        return;
      }
      console.log('connected as id ' + connection.threadId);
      connection.query(querySql, queryPar, function(err,rows){
          if(!err) {
            connection.query("select object,instance,resourceId,minimumPeriod,maximumPeriod,greaterThan,lessThan,step,cancel from resource where object = ? and instance = ? and resourceId = ?", [object,instance,resource], function(err,data){
              connection.release();
              if(!err) {
                console.log(data);
                res.json(data);
                return;
              }
          });
        }
      });
      connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
      });
    });
});

app.put('/resource/cancel', function(req, res){
  console.log("I receive a resource Cancel request");
  var object = req.body.object;
  var instance = req.body.instance;
  var resource = req.body.resource;
  if(typeof object == "undefined" || object==null || object=="") {
    res.json({"code" : 404, "status" : "no object id!"});
    return;
  }
  var querySql = "update resource set cancel = 'yes' where object = ?";
  var queryPar = [object,instance, resource];
  if(typeof instance !== "undefined" && instance!=="" && instance!==null) {
    querySql += " and instance = ?";
    queryPar.push(instance);
  }
  if(typeof resource !== "undefined" && resource!=="" && resource!==null) {
    querySql += " and resourceId = ?";
    queryPar.push(resource);
  }
  console.log(querySql);
  pool.getConnection(function(err,connection){
      if (err) {
        res.json({"code" : 100, "status" : "Error in connection database"});
        return;
      }
      console.log('connected as id ' + connection.threadId);
      connection.query(querySql, queryPar, function(err,rows){
          if(!err) {
            connection.query("select object,instance,resourceId,minimumPeriod,maximumPeriod,greaterThan,lessThan,step,cancel from resource where object = ? and instance = ? and resourceId = ?", [object,instance,resource], function(err,data){
              connection.release();
              if(!err) {
                console.log(data);
                res.json(data);
                return;
              }
          });
        }
      });
      connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
      });
    });
});

app.put('/resource/writeAttr', function(req, res){
  console.log(req.body.object);
  if(typeof req.body.object === "undefined" || req.body.object===null || req.body.object==="") {
    res.json({"code" : 404, "status" : "no object id!"});
    return;
  }
  var querySql = "update resource set minimumPeriod =?, maximumPeriod = ?, greaterThan = ?, lessThan = ?, step = ?, cancel = ? where object = ?";
  var queryPar = [req.body.minimumPeriod, req.body.maximumPeriod,req.body.greaterThan,req.body.lessThan,req.body.step,req.body.cancel,req.body.object];
  if(typeof req.body.instance !== "undefined" && req.body.instance!=="" && req.body.instance!==null) {
    querySql += " and instance = ?";
    queryPar.push(req.body.instance);
  }
  if(typeof req.body.resourceId !== "undefined" && req.body.resourceId!=="" && req.body.resourceId!==null) {
    querySql += " and resourceId = ?";
    queryPar.push(req.body.resourceId);
  }
  console.log(querySql);
  pool.getConnection(function(err,connection){
      if (err) {
        res.json({"code" : 100, "status" : "Error in connection database"});
        return;
      }
      console.log('connected as id ' + connection.threadId);

      connection.query(querySql, queryPar, function(err,rows){
          if(!err) {
              connection.query('select object,instance,resourceId,minimumPeriod,maximumPeriod,greaterThan,lessThan,step,cancel from resource where object = ? and instance = ? and and resourceId = ?', [req.body.object,req.body.instance,req.body.resourceId], function(err,rows){
              connection.release();
              if(!err) {
                res.json(rows);
                return;
              }
            });
          }
      });
      connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
      });
    });
});

app.get('/bootstrap', function(req,res){
  console.log("I receive a bootstrap request");
  pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }
        console.log('connected as id ' + connection.threadId);
        connection.query("select * from config where object = 'bsserver'",function(err,rows){
            if(!err) {
                bsserver = rows[0].value;
                console.log(bsserver);
                formData = {"model":"raspberry_pi_3", "name":"raspberry pi", "iot_client_uri":"http://localhost:3000"}
                request.post(bsserver,{json:formData},function(error,response,body){
                  if(error){
      							res.json({"code" : 400, "status" : "Bootstrap Failed!"});
                    return;
      						}else if(response.statusCode == 200){
                    var iot_server_uri = body['iot_server_uri'];
                    console.log(iot_server_uri);
                    connection.query('insert into config set ?', {
                    object : "iot_server_uri",
                    value : iot_server_uri});
                    res.json({"code" : 200, "status" : "Bootstrap Successfull!"});
                    return;
      						}else{
      							res.json({"code" : 400, "status" : "Bootstrap Failed!"});
                    return;
      						}
      					});
            }else {
              res.json({"code" : 100, "status" : "Error in query"});
              return;
            }
        });
        connection.on('error', function(err) {
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;
        });
  });
});

app.get('/client', function(req,res){
  console.log("I receive a GET request");
  pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }
        console.log('connected as id ' + connection.threadId);
        connection.query("select * from config where object = 'iot_server_uri'",function(err,rows){
            connection.release();
            if(!err) {
              iotserver = rows[0].value;
              console.log(iotserver);
              request.get(iotserver+'/iotlist',function(error,response,body){
                if(error){
                  res.json({"code" : 400, "status" : "Get Registered Client Failed!"});
                  return;
                }else if(response.statusCode == 200){
                  console.log(body);
                  body = JSON.parse(body);
                  res.json(body);
                  return;
                }else{
                  res.json({"code" : 400, "status" : "Get Registered Client Failed!"});
                  return;
                }
              });
            }
        });
        connection.on('error', function(err) {
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;
        });
  });
});

app.post('/client', function(req, res){
  console.log(req.body);
  pool.getConnection(function(err,connection){
      if (err) {
        res.json({"code" : 100, "status" : "Error in connection database"});
        return;
      }
      console.log('connected as id ' + connection.threadId);
      connection.query("select * from config where object = 'iot_server_uri'",function(err,rows){
          connection.release();
          if(!err) {
            iotserver = rows[0].value;
            console.log(iotserver);
            postData = {"name": req.body.name, "object": req.body.object, "instance": req.body.instance, "value": req.body.value};
            request.post(iotserver+'/iotlist',{json: postData},function(error,response,body){
              if(error){
                res.json({"code" : 400, "status" : "Get Registered Client Failed!"});
                return;
              }else if(response.statusCode == 200){
                console.log(body);
                res.json(body);
                return;
              }else{
                res.json({"code" : 400, "status" : "Get Registered Client Failed!"});
                return;
              }
            });
          }
      });
      connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
      });
    });
});

app.put('/client/:id', function(req,res){
  console.log("I receive a PUT request");
  var id = req.params.id;
  console.log(req.body.name);
  console.log(req.params.id);
  pool.getConnection(function(err,connection){
      if (err) {
        res.json({"code" : 100, "status" : "Error in connection database"});
        return;
      }
      console.log('connected as id ' + connection.threadId);
      connection.query("select * from config where object = 'iot_server_uri'",function(err,rows){
          connection.release();
          if(!err) {
            iotserver = rows[0].value;
            console.log(iotserver);
            postData = {"name": req.body.name, "object": req.body.object, "instance": req.body.instance, "value": req.body.value};
            request.put(iotserver+'/iotlist/'+id,{json: postData},function(error,response,body){
              if(error){
                res.json({"code" : 400, "status" : "Get Registered Client Failed!"});
                return;
              }else if(response.statusCode == 200){
                console.log(body);
                res.json(body);
                return;
              }else{
                res.json({"code" : 400, "status" : "Get Registered Client Failed!"});
                return;
              }
            });
          }
      });
      connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
      });
  });
});

app.delete('/client/:id', function(req,res){
  console.log("I got a delete request!");
  console.log(req.params.id);
  pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }
        console.log('connected as id ' + connection.threadId);
        connection.query("select * from config where object = 'iot_server_uri'",function(err,rows){
            connection.release();
            if(!err) {
              iotserver = rows[0].value;
              console.log(iotserver);
              postData = {"id": req.params.id};
              request.delete(iotserver+'/iotlist/'+req.params.id,function(error,response,body){
                if(error){
                  res.json({"code" : 400, "status" : "Delete Registered Client Failed!"});
                  return;
                }else if(response.statusCode == 200){
                  console.log(body);
                  res.json(body);
                  return;
                }else{
                  res.json({"code" : 400, "status" : "Delete Registered Client Failed!"});
                  return;
                }
              });
            }
        });
        connection.on('error', function(err) {
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;
        });
  });
});

app.get('/client/:id', function(req,res){
  var id = req.params.id;
  console.log(id);
  pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }
        console.log('connected as id ' + connection.threadId);
        connection.query("select * from config where object = 'iot_server_uri'",function(err,rows){
            connection.release();
            if(!err) {
              iotserver = rows[0].value;
              console.log(iotserver);
              request.get(iotserver+'/iotlist/'+id,function(error,response,body){
                if(error){
                  res.json({"code" : 400, "status" : "Get Client Failed!"});
                  return;
                }else if(response.statusCode == 200){
                  console.log(body);
                  body = JSON.parse(body);
                  res.json(body);
                  return;
                }else{
                  res.json({"code" : 400, "status" : "Get Client Failed!"});
                  return;
                }
              });
            }
        });
        connection.on('error', function(err) {
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;
        });
  });
});

setInterval(function() {
    // your function
    pool.getConnection(function(err,connection){
      if (err) {
        res.json({"code" : 100, "status" : "Error in connection database"});
        return;
      }
      console.log('connected as id ' + connection.threadId);
      connection.query("select * from resource", function(err,rows){
        if(!err) {
              for(var resource of rows){
                var value = 5;
                if(resource.cancel=="no"){
                  resource.current += 1;
                  console.log(resource.current+"/"+resource.maximumPeriod+"/"+resource.minimumPeriod);
                  if(resource.current > ((resource.maximumPeriod + resource.minimumPeriod) / 2)) value = Math.random() * 10;
                  console.log(value);
                  if( (resource.current > resource.maximumPeriod) || ((resource.current > resource.minimumPeriod) && ((value > resource.greaterThan) || (value < resource.lessThan))) || ((value > resource.step) && (value != resource.value)) ){
                    resource.current = 0;
                    connection.query("select * from config where object = 'iot_server_uri'",function(err,rows){
                      if(!err) {
                          iotserver = rows[0].value;
                          console.log(iotserver);
                          postData = {"name": resource.name, "object": resource.object, "instance": resource.instance, "resource": resource.resourceId, "value": value, "notifytime": Math.round(new Date().getTime())};
                          request.put(iotserver+'/notify',{json: postData},function(error,response,body){
                            if(error){
                              console.log(error);
                            }
                          });
                        }else{
                          connection.release();
                          return;
                        }
                    });
                  }else {
                    resource.value = value;
                  }
                  var querySql = "update resource set current = ?, value = ? where object = ? and instance = ? and resourceId = ?";
                  var queryPar = [resource.current, resource.value, resource.object, resource.instance, resource.resourceId];
                  connection.query(querySql, queryPar, function(err,rows){
                      if(err) {
                        connection.release();
                        console.log(err);
                      }else{
                        connection.release();
                        return;
                      }
                  });
                }
              }
              console.log("connection release");
              return;
          }else{
            connection.release();
            return;
          }
      });
      connection.on('error', function(err) {
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
      });
    });
}, 1000);

app.listen(3000);
console.log("Server running on port 3000");
