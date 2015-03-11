var picturesApp = angular.module('picturesApp', [
  'ngRoute',
  'picturesAppControllers'
]);

picturesApp.config(['$routeProvider',
function($routeProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'partials/login.html',
      controller: 'LoginController'
    }).
    when('/pictures', {
      templateUrl: 'partials/picture-list.html',
      controller: 'PictureListController'
    }).
    /*
    when('/', {
      templateUrl: 'partials/picture-list.html',
      controller: 'PictureListController'
    }).
    */
    when('/phones', {
      templateUrl: 'partials/picture-list.html',
      controller: 'PictureListController'
    }).
    when('/pictures/:pictureId', {
      templateUrl: 'partials/picture.html',
      controller: 'PictureController'
    }).
    otherwise({
      redirectTo: '/'
    });
}]);
