angular.module("app").factory("ProfissaoService", [
  "$http",
  "$window",
  function ($http, $window) {
    var baseUrl = "/api/profissoes";

    var getAuthHeader = function () {
      var token = $window.localStorage.getItem("token");
      return { Authorization: "Bearer " + token };
    };

    return {
      getProfissoes: function () {
        return $http.get(baseUrl);
      },
      createProfissao: function (pessoa) {
        return $http.post(baseUrl, pessoa);
      },
      updateProfissao: function (pessoa) {
        return $http.put(baseUrl + "/" + pessoa.prof_id, pessoa);
      },
      deleteProfissao: function (id) {
        return $http.delete(baseUrl + "/" + id);
      },
    };
  },
]);
