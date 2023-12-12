console.log("login.js");
angular.module("app").controller("LoginController", [
  "$scope",
  "User",
  "$location",
  "$timeout",
  "$window",
  function ($scope, User, $location, $timeout, $window) {
    $scope.isRegistering = false;

    $scope.user = {
      email: "",
      password: "",
    username: "", 
    };
    
    $scope.login = function () {
      User.login(
        $scope.user,
        function (response) {
          console.log("chegou aqui 1 - Sucesso no login");          
          $window.localStorage.setItem("token", response.id);                    

          swal({
            title: "Login bem-sucedido",
            text: "Você será redirecionado para a página de pessoas.",
            icon: "success",
            button: "Ok",
          }).then(() => {
            $timeout(function () {
              console.log("Redirecionando para /pessoa");
            $location.path("/pessoa"); 
            });
          });

          console.log("chegou aqui 2 - Após a configuração do SweetAlert");
        },
        function (error) {
          console.log("Erro no login");
          if (error.status === 401) {
            swal({
              title: "Erro de autenticação",
            text: error.data.error.message, 
              icon: "error",
              button: "Ok",
            });
          } else {
            console.error("Erro de login:", error);
          }
        }
      );
    };

    $scope.register = function () {
      User.create($scope.user)
        .$promise.then(function (response) {          
          console.log("Registro bem-sucedido", response);
          swal({
            title: "Registro bem-sucedido",
            text: "Usuário registrado com sucesso. Você será redirecionado para a página de login.",
            icon: "success",
            button: "Ok",
          }).then(() => {
            $timeout(function () {
              console.log("Redirecionando para /pessoa");
               $window.location.reload();
            });
          });
        })
        .catch(function (error) {          
          console.error("Erro no registro", error);
          swal({
            title: "Erro no registro",
            text: "Não foi possível registrar o usuário. Por favor, tente novamente.",
            icon: "error",
            button: "Ok",
          });
        });
    };

    $scope.toggleRegister = function () {
      $scope.isRegistering = !$scope.isRegistering;
      console.log("Toggle Registro: ", $scope.isRegistering);
    };
  },
]);
