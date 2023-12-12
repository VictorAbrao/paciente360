angular.module('app', ['lbServices', 'ngRoute', 'ngResource', 'ui.utils.masks'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginController'
      })
      .when('/pessoa', {
        templateUrl: 'views/pessoa.html',
        controller: 'PessoaController'
      })
      .when('/profissao', {
        templateUrl: 'views/profissao.html',
        controller: 'ProfissaoController'
      })
      .otherwise({
        redirectTo: '/login'
      });
  }])
  .controller('MainController', ['$scope', '$location', function($scope, $location) {
    $scope.navTo = function(path) {
      $location.path(path);
    };
  }]);
