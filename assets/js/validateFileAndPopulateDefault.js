var timeTables = "";
var timeTablesSalas = "";
var timeTablesTemp = "";
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
                if (json[0].hasOwnProperty('Curso')) {
                    setFilterData(json, "");

                    timeTables = json;
                    timeTablesTemp = json;
                    getListOfClass(timeTables, timeTablesSalas);
                    divHorarios = document.querySelector('.div-import-horarios')
                    divHorarios.style.display = 'none'
                    const modalValidateFile = new bootstrap.Modal(modal);
                    document.querySelector('.modal-message').textContent = "Ficheiro de horario lido com sucesso"
                    modalValidateFile.show();
                }
                if (json[0].hasOwnProperty('Edifício')) {
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

function getListOfClass(dataHorarios, dataSalas) {
    debugger;
    let select = document.querySelector("#select_turma");
    let filterByDay = document.querySelector(".filterByDay");
    filterByDay.style.display = "block";
    select.style.display = "block";
    var turma = [];
    for (let value of dataHorarios.values()) {
        if (turma.indexOf(value['Turma']) === -1 && value['Turma'] !== "") {
            turma.push(value['Turma']);
        }
    }
    turma.sort();
    for (let x of turma) {
        let newOption = document.createElement('option');
        newOption.value = x;
        newOption.textContent = x;
        select.appendChild(newOption);
    }
}


