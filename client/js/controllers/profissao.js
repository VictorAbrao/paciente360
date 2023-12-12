angular.module("app").controller("ProfissaoController", [
  "$scope",
  "ProfissaoService",
  "$timeout",
  function ($scope, ProfissaoService, $timeout) {
    $scope.profissoes = [];
    $scope.newProfissao = {};
    $scope.selectedProfissao = null;

    
    $scope.loadProfissoes = function () {
      ProfissaoService.getProfissoes().then(
        function (response) {
          $scope.profissoes = response.data;
        },
        function (error) {
          console.error("Error loading profissoes:", error);
        }
      );
    };

    
    $scope.showAddProfissaoModal = function () {
      $scope.newProfissao = {};
      $("#addProfissaoModal").modal("show");
    };

    
    $scope.addProfissao = function () {

        if ($scope.profissaoForm.$valid) {
          ProfissaoService.createProfissao($scope.newProfissao).then(
            function (response) {
              $scope.profissoes.push(response.data);
              $scope.newProfissao = {};
              $("#addProfissaoModal").modal("hide");
              $scope.loadProfissoes();
            },
            function (error) {
              console.error("Error adding profissao:", error);
            }
          );
        } else {
          swal({
            title: "Campos obrigatórios",
            text: "Preencha todos os campos obrigatórios.",
            icon: "warning",
            button: "Ok",
          });
        }
  
    };

    
    $scope.editProfissao = function (profissao) {
      $scope.newProfissao = angular.copy(profissao);

      $timeout(function () {
        $("#addProfissaoModal").modal("show");
      });
    };
    
    $scope.updateProfissao = function () {
      $scope.selectedProfissao = $scope.newProfissao;
      ProfissaoService.updateProfissao($scope.selectedProfissao).then(
        function (response) {
          for (var i = 0; i < $scope.profissoes.length; i++) {
            if ($scope.profissoes[i].prof_id === $scope.selectedProfissao.prof_id) {
              $scope.profissoes[i] = $scope.selectedProfissao;
              break;
            }
          }
          $scope.selectedProfissao = null;
          $("#addProfissaoModal").modal("hide");
        },
        function (error) {
          console.error("Error updating profissao:", error);
        }
      );
    };

    $scope.saveProfissao = function () {
      if ($scope.newProfissao.prof_id) {
        
        $scope.updateProfissao();
      } else {
        
        $scope.addProfissao();
      }
    };

    $scope.confirmDeleteProfissao = function (id) {
      swal({
        title: "Tem certeza?",
        text: "Uma vez excluído, você não poderá recuperar este registro!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          $scope.deleteProfissao(id);
        }
      });
    };

    
    $scope.deleteProfissao = function (id) {
      ProfissaoService.deleteProfissao(id).then(
        function (response) {
          $scope.profissoes = $scope.profissoes.filter(function (profissao) {
            return profissao.prof_id !== id;
          });
        },
        function (error) {
          console.error("Error deleting profissao:", error);
        }
      );
    };

    
    $scope.loadProfissoes();
  },
]);
