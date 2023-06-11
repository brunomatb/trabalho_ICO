//variaveis globais //
var timeTables = "";
var timeTablesSalas = "";
var timeTablesTemp = "";
var analysis = [];
var paretoSolutionsTimeTables = '';
var fitnessSolutions = ''
var solutionDownload = '';
var fitnessKeys = [];
//funçaõ para validar se a extenção do ficheiro é .csv, caso .csv valido lê ficheiro e chama a função setFilterCurso, getListOfClass.
function getFileAndConvertJson(input) {
    const file = input.parentNode.parentNode.childNodes[1].childNodes[1].files[0];
    const modal = document.querySelector('#validateFile');
    if (!file) {
        const modalValidateFile = new bootstrap.Modal(modal);
        document.querySelector('.modal-message').textContent = "Importar um ficheiro válido extenção .csv."
        modalValidateFile.show();
        return false;
    }
    const ext = file.type
    if (ext !== "text/csv") {
        const modalValidateFile = new bootstrap.Modal(modal);
        document.querySelector('.modal-message').textContent = "Importar um ficheiro válido extenção .csv."
        modalValidateFile.show();
        return false;
    }
    Papa.parse(file, {
        header: true,
        encoding: 'utf-8',
        complete: function (results, file) {
            json = results.data
            json.pop();
            if(!json[0].hasOwnProperty('Curso') && !json[0].hasOwnProperty('Edifício')){
                const modalValidateFile = new bootstrap.Modal(modal);
                document.querySelector('.modal-message').textContent = "Importar um ficheiro válido .csv."
                modalValidateFile.show();
                return false;
            }
            if (json[0].hasOwnProperty('Curso') && json[0].hasOwnProperty('Características da sala pedida para a aula')) {
                if (input.value !== 'horarios') {
                    const modalValidateFile = new bootstrap.Modal(modal);
                    document.querySelector('.modal-message').innerHTML = '<h5><span style="color:orange"><i class="fa-solid fa-triangle-exclamation fa-xl"></i></span> Ficheiro não importado</h5><br>Importar ficheiro <b>.csv</b> de caracterização das salas.';
                    modalValidateFile.show();
                    return false;
                }
                setFilterCurso(json, 'Curso', 'MAE');
                timeTables = json;
                timeTablesTemp = json;
                appendCursoOnSelect(timeTables, timeTablesSalas);
                divHorarios = document.querySelector('.div-import-horarios');
                const modalValidateFile = new bootstrap.Modal(modal);
                document.querySelector('.modal-message').innerHTML = '<h5><span style="color:green"><i class="fa-solid fa-circle-check"></i></span> Ficheiro de <b>horários</b> lido com sucesso</h5>';
                modalValidateFile.show();
            }
            if (json[0].hasOwnProperty('Edifício')) {
                if (input.value !== 'salas') {
                    const modalValidateFile = new bootstrap.Modal(modal);
                    document.querySelector('.modal-message').innerHTML = '<h5><span style="color:orange"><i class="fa-solid fa-triangle-exclamation fa-xl"></i></span> Ficheiro não importado</h5><br> Importar ficheiro <b>.csv</b> de horários.';
                    modalValidateFile.show();
                    return false;
                }
                
                timeTablesSalas = json;
                appendCursoOnSelect(timeTables, timeTablesSalas);
                divHorarios = document.querySelector('.div-import-salas');
                const modalValidateFile = new bootstrap.Modal(modal);
                document.querySelector('.modal-message').innerHTML = '<h5><span style="color:green"><i class="fa-solid fa-circle-check"></i></span> Ficheiro de caracterização das salas lido com sucesso.</h5>';
                modalValidateFile.show();

            }
            if (timeTables !== "" && timeTablesSalas !== "") {
                document.querySelector('.div-menu-config').style.display = 'grid';
                document.querySelector('.div-menu-config-algoritmo').style.display = 'grid';
                analysis.push(setOvercrowedRooms());
            }
        }
    });
}




