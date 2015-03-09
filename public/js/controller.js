var picturesAppControllers = angular.module('picturesAppControllers', []);

picturesAppControllers.controller('PictureListController', function ($scope, $http, $timeout) {
  var getPictures = function(){
    $http.get('/api/pictures').success(function(data) {
      if (!angular.equals($scope.pictures, data.data)){
        $scope.pictures = data.data;
      }
    });
  }
  getPictures();
  var poll = function(){
    $timeout(function() {
      getPictures();
      poll();
    }, 5000);
  };
  poll();
  $scope.orderProp = '-date';
  $scope.submitComment = function($event){
    var target = $event.target;
    var commentBody = target.value;
    target.value = "";
    var pictureScope = angular.element(target).parent(".comments").scope();
    // optimistic update
    pictureScope.picture.comments.push({"body": commentBody, "name": "anonymous"});
    var pictureId = pictureScope.picture._id;
    $http.get('/api/pictures/' + pictureId).success(function(data) {
      var picture = data.data;
      picture.comments.push({"body": commentBody, "name": "anonymous"});
      var data = picture;
      $http.put('/api/pictures/' + pictureId, data).success(function(data) {
        $scope.picture = data.data;
      });
    });
  }
});

picturesAppControllers.controller('PictureController', ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {
    $http.get('/api/pictures/' + $routeParams.pictureId).success(function(data) {
      $scope.picture = data.data;
    });
  }
]);

picturesAppControllers.controller('UploadController', function($timeout, $scope, $http){
  $scope.uploadImage = function($event){
    //$event.stopPropagation();
    $timeout(function(){
      var element = angular.element(document.getElementById('file'));
      element.triggerHandler('click');
      console.log(element);
    }, 0);
  }
  $scope.uploadFile = function(files) {
      var fd = new FormData();
      //Take the first selected file
      fd.append("file", files[0]);

      $http.post('/api/pictures/', fd, {
          withCredentials: true,
          headers: {'Content-Type': undefined },
          transformRequest: angular.identity
      }).success(function(){
        console.log("successful upload");
      }).error(function(){
        console.log("failure to upload");
      });
  };
});
