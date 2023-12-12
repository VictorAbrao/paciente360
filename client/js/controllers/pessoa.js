angular.module("app").controller("PessoaController", [
  "$scope",
  "PessoaService",
  "$timeout",
  function ($scope, PessoaService, $timeout) {
    $scope.pessoas = [];
    $scope.newPessoa = { prof_id: null };
    $scope.profissoes = [];
    $scope.selectedPessoa = null;

    function formatDateToInput(dateString) {
      if (!dateString) {
        return null;
      }

      var date = new Date(dateString);
      var year = date.getFullYear();
      var month = ("0" + (date.getMonth() + 1)).slice(-2);
      var day = ("0" + date.getDate()).slice(-2);

      return day + "/" + month + "/" + year;
    }

    function isValidCPF(cpf) {
      if (!cpf || cpf.trim().length === 0) {
        return false;
      }

      cpf = cpf.replace(/[^\d]+/g, "");

      if (
        cpf.length !== 11 ||
        cpf === "00000000000" ||
        cpf === "11111111111" ||
        cpf === "22222222222" ||
        cpf === "33333333333" ||
        cpf === "44444444444" ||
        cpf === "55555555555" ||
        cpf === "66666666666" ||
        cpf === "77777777777" ||
        cpf === "88888888888" ||
        cpf === "99999999999"
      ) {
        return false;
      }

      let soma = 0;
      let resto;

      for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
      }

      resto = (soma * 10) % 11;

      if (resto === 10 || resto === 11) {
        resto = 0;
      }
      if (resto !== parseInt(cpf.substring(9, 10))) {
        return false;
      }

      soma = 0;

      for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
      }

      resto = (soma * 10) % 11;

      if (resto === 10 || resto === 11) {
        resto = 0;
      }
      if (resto !== parseInt(cpf.substring(10, 11))) {
        return false;
      }

      return true;
    }

    PessoaService.getProfissoes().then(function (response) {
      $scope.profissoes = response.data;
    });

    $scope.loadPessoas = function () {
      PessoaService.getPessoas().then(
        function (response) {
          $scope.pessoas = response.data;
        },
        function (error) {
          console.error("Error loading pessoas:", error);
        }
      );
    };

    $scope.showAddPessoaModal = function () {
      $scope.newPessoa = {};
      $("#addPessoaModal").modal("show");
    };

    $scope.addPessoa = function () {
      console.log("Enviando pessoa:", $scope.newPessoa);
      if (
        isValidCPF($scope.newPessoa.pes_cpf) &&
        $scope.newPessoa.pes_cpf != ""
      ) {
        if ($scope.pessoaForm.$valid) {
          PessoaService.createPessoa($scope.newPessoa).then(
            function (response) {
              $scope.pessoas.push(response.data);
              $scope.newPessoa = {};
              $("#addPessoaModal").modal("hide");
              $scope.loadPessoas();
            },
            function (error) {
              console.error("Error adding pessoa:", error);
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
      } else {
        swal({
          title: "CPF inválido",
          text: "Por favor, insira um CPF válido.",
          icon: "error",
          button: "Ok",
        });
      }
    };

    $scope.editPessoa = function (pessoa) {
      $scope.newPessoa = angular.copy(pessoa);
      $scope.newPessoa.pes_data_nascimento = formatDateToInput(
        $scope.newPessoa.pes_data_nascimento
      );

      $timeout(function () {
        $("#addPessoaModal").modal("show");
      });
    };

    $scope.updatePessoa = function () {
      $scope.selectedPessoa = $scope.newPessoa;
      $scope.selectedPessoa.profissao.prof_id = $scope.newPessoa.prof_id; 
      PessoaService.updatePessoa($scope.selectedPessoa).then(
        function (response) {
          for (var i = 0; i < $scope.pessoas.length; i++) {
            if ($scope.pessoas[i].pes_id === $scope.selectedPessoa.pes_id) {
              $scope.pessoas[i] = $scope.selectedPessoa;
              break;
            }
          }
          $scope.selectedPessoa = null;
          $("#addPessoaModal").modal("hide");
          $scope.loadPessoas();
        },
        function (error) {
          console.error("Error updating pessoa:", error);
        }
      );
    };

    $scope.savePessoa = function () {
      console.log("teste", $scope.newPessoa);
      if ($scope.newPessoa.pes_id) {
        $scope.updatePessoa();
      } else {
        $scope.addPessoa();
      }
    };

    $scope.confirmDeletePessoa = function (id) {
      swal({
        title: "Tem certeza?",
        text: "Uma vez excluído, você não poderá recuperar este registro!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          $scope.deletePessoa(id);
        }
      });
    };

    $scope.deletePessoa = function (id) {
      PessoaService.deletePessoa(id).then(
        function (response) {
          $scope.pessoas = $scope.pessoas.filter(function (pessoa) {
            return pessoa.pes_id !== id;
          });
        },
        function (error) {
          console.error("Error deleting pessoa:", error);
        }
      );
    };

    $scope.loadPessoas();
  },
]);
