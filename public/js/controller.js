var picturesAppControllers = angular.module('picturesAppControllers', []);

picturesAppControllers.controller('LoginController', function($scope, $routeParams, $route, $timeout, $http, $window, $location){
  function redirectToPictures(){
    $location.path("/pictures");
  }
  if ($window.sessionStorage.user){
    var user = angular.fromJson($window.sessionStorage.user);
    if (user && user.name){
      redirectToPictures();
    } 
  }
  $scope.setName = function(){
    if (typeof($scope.name) != "undefined"){
      var user = {name: $scope.name};
      $window.sessionStorage.user = angular.toJson(user);
      redirectToPictures();
      $timeout(function () {
        // 0 ms delay to reload the page.
        $route.reload();
      }, 0);
    }
  }
});

picturesAppControllers.controller('PictureListController', function ($scope, $http, $timeout, $compile, $window, $location, $rootScope) {
  var refreshUpdates = true;
  $scope.imagesLoaded = [];

  if ($window.sessionStorage.user){
    var user = angular.fromJson($window.sessionStorage.user);
    if (user && user.name){
      $scope.user = user;
    } 
  }

  var getPictures = function(){
    $http.get('/api/pictures').success(function(data) {
      if (refreshUpdates && !angular.equals($scope.pictures, data)){
        $scope.pictures = data;
      }
    });
  }

  getPictures();
  var poll = function(){
    $timeout(function() {
      getPictures();
      poll();
    }, 2500);
  };
  poll();
  $scope.orderProp = '-date';

  $scope.submitComment = function($event){
    var commentBody = $scope.comment;
    $scope.comment = "";
    $event.target.blur();
    var commentName = angular.fromJson($window.sessionStorage.user).name;
    var pictureScope = angular.element($event.target).parent(".comments").scope();
    var pictureId = pictureScope.picture._id;

    // optimistic update...
    pictureScope.picture.comments.push({"body": commentBody, "name": commentName});
    // pause updates
    refreshUpdates = false;

    var data = {"comments": [{"body": commentBody, "name": commentName}]};
    $http.put('/api/pictures/' + pictureId, data).success(function(data) {
      $scope.picture = data.data;
      refreshUpdates = true;
    });
  }

  $scope.uploadImage = function($event){
    $timeout(function(){
      var element = angular.element(document.getElementById('file'));
      element.triggerHandler('click');
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

  $scope.showUpload = function($event){
    var popupTemplate = document.createElement("div");
    popupTemplate.setAttribute("ng-include", "'partials/upload.html'");

    // We give the popup a new scope, inherited from the current one.
    var popupScope = $scope.$new();
    popupScope.someValue = Math.random();
    var popupElement = $compile(popupTemplate)(popupScope);
    $scope.showLightbox(popupElement);

    popupScope.$on("finished", function () {
      $scope.hideLightbox();
      // Avoid leaks and nasty stuff. Destroying the scope when
      // the popup is hidden is absolutely vital.
      popupScope.$destroy();
    });
  }

  $scope.showLightbox = function(content){
    var lightbox = angular.element(document.getElementById("lightbox"));
    lightbox.append(content);
    lightbox[0].style.display = "block";
  }

  $scope.hideLightbox = function(){
    var lightbox = document.getElementById("lightbox");
    lightbox.style.display = "none";
    lightbox.innerHTML = "";
  }

  $scope.logout = function(){
    delete $window.sessionStorage.user;
    $location.path("/");
  }

  $scope.login = function(){
    // functionality is same as logout
    $scope.logout();
  }

  $scope.imageLoaded = function($event){
    var img = $event.target;
    var parentLiScope = angular.element(img).parent("a").parent("li").scope();
    parentLiScope.fading = false;
    // keeping track of all image URLs we've loaded so we don't reload them
    $scope.imagesLoaded.push(img.attributes['ng-src'].value);
  }
})
.directive('imageLoad', ['$parse', function ($parse) {
  return {
    restrict: 'A',
    link: function (scope, elem, attrs) {
      var fn = $parse(attrs.imageLoad);
      var parentLiScope = angular.element(elem[0]).parent("a").parent("li").scope();
      // only do the fading in animation for images we have not already loaded before
      if (scope.imagesLoaded.indexOf(attrs.ngSrc) < 0){
        parentLiScope.fading = true; 
      }
      elem.on('load', function (event) {
        scope.$apply(function() {
          parentLiScope.fading = false; 
          fn(scope, { $event: event });
        });
      });
    }
  };
}]);

picturesAppControllers.controller('PictureController', ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {
    $http.get('/api/pictures/' + $routeParams.pictureId).success(function(data) {
      $scope.picture = data.data;
    });
  }
]);
