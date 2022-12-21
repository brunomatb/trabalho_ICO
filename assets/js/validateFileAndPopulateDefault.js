var timeTables = "";
var timeTablesSalas = "";
//funçaõ para validar se a extenção do ficheiro é .json, caso .json valido lê ficheiro e chama a função setFilterData, getListOfClass.
function getFileAndConvertJson(input) {
    const file = input.parentNode.parentNode.childNodes[1].childNodes[1].files[0];
    const modal = document.querySelector('#validateFile');
    if (!file) {
        const modalValidateFile = new bootstrap.Modal(modal);
        document.querySelector('.modal-message').textContent = "Importar um ficheiro válido extenção .json."
        modalValidateFile.show();
        return false;
    }
    debugger
    const fileName = file.name.split(".")[0];
    const ext = file.name.split(".")[1];
    if (ext !== 'json') {
        const modalValidateFile = new bootstrap.Modal(modal);
        modalValidateFile.show();
        return false;
    }

    var reader = new FileReader();
    reader.onload = (function (f) {
        return function (e) {
            try {
                json = JSON.parse(e.target.result);
                console.log(json);
                debugger
                if(json[0].hasOwnProperty('Curso')){
                    setFilterData(json, "");
                    
                    timeTables = json;
                    getListOfClass(timeTables, timeTablesSalas);
                    divHorarios = document.querySelector('.div-import-horarios')
                    divHorarios.style.display = 'none'
                    const modalValidateFile = new bootstrap.Modal(modal);
                    document.querySelector('.modal-message').textContent = "Ficheiro de horario lido com sucesso"
                    modalValidateFile.show();
                }
                if(json[0].hasOwnProperty('Edifício')){
                    debugger
                    timeTablesSalas = json;
                    getListOfClass(timeTables, timeTablesSalas);
                    divHorarios = document.querySelector('.div-import-salas')
                    divHorarios.style.display = 'none'
                    const modalValidateFile = new bootstrap.Modal(modal);
                    document.querySelector('.modal-message').textContent = "Ficheiro de salas lido com sucesso"
                    modalValidateFile.show();
                }
                

            } catch (ex) {
                console.log('error when trying to parse json = ' + ex);
            }
        };
    })(file);
    jsonfile = reader.readAsText(file, fileName);
}


