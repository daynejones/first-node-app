var picturesAppControllers = angular.module('picturesAppControllers', []);

picturesAppControllers.controller('PictureListController', function ($scope, $http) {
  $http.get('/api/pictures').success(function(data) {
    $scope.pictures = data;
  });
});

picturesAppControllers.controller('PictureController', ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {
    $http.get('/api/pictures/' + $routeParams.pictureId).success(function(data) {
      $scope.picture = data;
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
