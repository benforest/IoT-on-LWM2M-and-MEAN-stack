var myApp = angular.module('myApp',['angularChart']);
myApp.controller('AppCtrl',['$scope','$http','$interval',
function($scope, $http, $interval){
console.log("Hello World from controller");
$scope.notify = 0;
$scope.payment = 0;
$scope.reqnum = 10;
$scope.resnum = 20;
var refresh = function(){
  $http.get('/iotlist').then(function(response){
    console.log("I got the data I request")
    $scope.iotlist=response.data;
    $scope.client = {};
    $scope.resourcelist = {};

  });
};



   // optional (direct access to c3js API http://c3js.org/reference.html#api)
   $scope.instance = null;

refresh();

$scope.callAtInterval = function() {
  $http.get('/resource/check').then(function(response){
    console.log(response.data);
    if(response.data){
      $scope.notify = 1;
      $scope.notification=response.data;
    }else{
      $scope.notify = 0;
    }
    $scope.reqnum+=1;
    $scope.options = {
         data: [
           {
             request: $scope.reqnum,
             response: $scope.resnum
           }
         ],
         dimensions: {
           request: {
              type: 'bar'
           },
           response: {
              type: 'bar'
           }
         }
       };
  })
}

$interval( function(){ $scope.callAtInterval(); }, 1000);


$scope.Create = function(object, instance, value){
  console.log($scope.client);
  $http.post('/iotlist', $scope.client).then(function(response){
    console.log(response);
    refresh();
  });
};

$scope.Delete = function(id){
  console.log(id);
  $http.delete('/iotlist/' + id).then(function(response){
    refresh();
  });
};

$scope.editClient = function(clientId){
  console.log(clientId);
  $http.get('/iotlist/' + clientId).then(function(response){
    $scope.client = response.data;
  })
};

$scope.basic = function(id){
  console.log(id);
    $scope.payment = 1;
    $scope.paymentchosen = "You have chosen Basic payment!!!";
  $http.put('/payment', {"client":id, "payment":"basic"}).then(function(response){
  })
};

$scope.premium = function(id){
  console.log(id);
    $scope.payment = 2;
    $scope.paymentchosen = "You have chosen Premium payment!!!";
  $http.put('/payment', {"client":id, "payment":"premium"}).then(function(response){
  })
};

$scope.Read = function(object,instance,resource){
  console.log(object+"/"+instance+"/"+resource);
  $http.get('/resource/read', {params: {object:object, instance:instance, resource:resource}}).then(function(response){
    $scope.resourcelist = response.data;
  })
};

$scope.Discover = function(object,instance,resource,epname){
  console.log(object+"/"+instance+"/"+resource+"/"+epname);
  if(instance===undefined || instance==="" || resource===undefined || resource===""){
    $http.get('/resource/discover', {params: {object:object, instance:instance, resource:resource, epname:epname}}).then(function(response){
      console.log(response.data);
      $scope.resourcelist = response.data;
    })
  }else{
    $http.get('/resource/discover', {params: {object:object, instance:instance, resource:resource, epname:epname}}).then(function(response){
      console.log(response.data);
      $scope.resourcelist = response.data;
      $scope.attributelist = response.data;
    })
  }
};

$scope.Write = function(object,instance,resource,value,epname){
  console.log(object+"/"+instance+"/"+resource+"/"+value+"/"+epname);
  $http.put('/resource/write', {"object":object, "instance":instance, "resource":resource, "value":value, "epname":epname}).then(function(response){
    $scope.resourcelist = response.data;
  })
}

$scope.Observe = function(object,instance,resource,epname){
  console.log(object+"/"+instance+"/"+resource+"/"+epname);
  $http.put('/resource/observe', {"object":object, "instance":instance, "resource":resource, "epname":epname}).then(function(response){
    $scope.attributelist = response.data;
    $scope.notification = {};
    $scope.notify = 1;
  })
}

$scope.Cancel = function(object,instance,resource,epname){
  console.log(object+"/"+instance+"/"+resource+"/"+epname);
  $http.put('/resource/cancel', {"object":object, "instance":instance, "resource":resource, "epname":epname}).then(function(response){
    $scope.attributelist = response.data;
    $scope.notification = {};
    $scope.notify = 0;
  })
}

$scope.WriteAttr = function(){
  console.log($scope.attribute);
  $http.put('/resource/writeAttr', $scope.attribute).then(function(response){
    console.log(response.data);
    $scope.attributelist = response.data;
  })
}

$scope.Execute = function(object,instance,resourceId){
  console.log(object+"/"+instance+"/"+resourceId);
  $http.get('/resource?object=' + $scope.resource.object + "&instance=" + $scope.resource.instance + "&resourceId=" + $scope.resource.resourceId, $scope.resource).then(function(response){
    refresh();
  })
}

}]);
