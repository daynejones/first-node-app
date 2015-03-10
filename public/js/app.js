var picturesApp = angular.module('picturesApp', [
  'ngRoute',
  'picturesAppControllers'
]);

picturesApp.config(['$routeProvider',
function($routeProvider) {
  $routeProvider.
    when('/pictures', {
      templateUrl: 'partials/picture-list.html',
      controller: 'PictureListController'
    }).
    when('/', {
      templateUrl: 'partials/picture-list.html',
      controller: 'PictureListController'
    }).
    when('/phones', {
      templateUrl: 'partials/picture-list.html',
      controller: 'PictureListController'
    }).
    when('/pictures/:pictureId', {
      templateUrl: 'partials/picture.html',
      controller: 'PictureController'
    }).
    /*
    when('/upload', {
      templateUrl: 'partials/upload.html',
      controller: 'UploadController'
    }).
    */
    otherwise({
      redirectTo: '/'
    });
}]);
