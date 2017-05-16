var myApp = angular.module('myApp',[]);
myApp.controller('AppCtrl',['$scope','$http',
function($scope, $http){
  console.log("Hello World from controller");

var refresh = function(){
  $http.get('/client').then(function(response){
    console.log("I got the data I request")
    $scope.clientlist=response.data;
    $scope.client = {};
  });
};

refresh();

$scope.bootstrap = function(){
  console.log($scope);
  $http.get('/bootstrap').then(function(response){
    if(response.data['code']==200){
    $scope.show=true;
    $scope.bscode = response.data['code'];
    $scope.bsstatus = response.data['status'];
    }
  });
};

$scope.create = function(){
  console.log($scope.client);
  $http.post('/client', $scope.client).then(function(response){
    console.log(response);
    refresh();
  });
};

$scope.delete = function(id){
  console.log(id);
  $http.delete('/client/' + id).then(function(response){
    refresh();
  });
};

$scope.edit = function(id){
  console.log(id);
  $http.get('/client/' + id).then(function(response){
    $scope.client = response.data;
  })
};

$scope.update = function(){
  console.log($scope.client._id);
  $http.put('/client/' + $scope.client._id, $scope.client).then(function(response){
    refresh();
  })
}

}]);
