angular.module("app").factory("PessoaService", [
  "$http",
  "$window",
  function ($http, $window) {
    var baseUrl = "/api/pessoas";

    var getAuthHeader = function () {
      var token = $window.localStorage.getItem("token");
      return { Authorization: "Bearer " + token };
    };

    return {
      getPessoas: function () {
        var filter = encodeURIComponent(
          JSON.stringify({
            include: {
              relation: "profissao",
              scope: {
                fields: ["prof_nome"],
              },
            },
          })
        );

        return $http.get(baseUrl + "?filter=" + filter);
      },
      createPessoa: function (pessoa) {
        return $http.post(baseUrl, pessoa);
      },
      updatePessoa: function (pessoa) {
        return $http.put(baseUrl + "/" + pessoa.pes_id, pessoa);
      },
      deletePessoa: function (id) {
        return $http.delete(baseUrl + "/" + id);
      },
      getProfissoes: function () {
        return $http.get("/api/profissoes");
      },
    };
  },
]);
