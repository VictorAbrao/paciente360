module.exports = function(app) {
    var paciente360 = app.dataSources.paciente360;
    var models = ['User', 'AccessToken', 'ACL', 'RoleMapping', 'Role', 'profissao', 'pessoa'];

    paciente360.autoupdate(models, function(err) {
        if (err) throw err;
        console.log('Modelos migrados com sucesso para o dataSource paciente360');
    });
};
