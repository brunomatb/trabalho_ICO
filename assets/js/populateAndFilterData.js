document.addEventListener('DOMContentLoaded', function () {
    setHorarioMain();
    setGenerateScheduless();
    setGenerateExcel();
    setHorarioUnidadeExecucao();
    setHorarioTurno();
});

//////////////setHorario////////////
function setHorarioMain() {
    const select = document.querySelector("#select_curso");
    if (select) {
        select.addEventListener('change', () => {
            if (select.id === 'select_curso') {
                appendUnidadeOnSelect(timeTables, select.value);
                var filterData = setFilterCurso(timeTables, 'Curso', select.value);

            }
            let selectDay = document.querySelector("#filter_ByDay");
            if (selectDay.value !== "") {
                day = getDateCalender(selectDay.value);
                getCalander(filterData[0], filterData[1], day);
            } else {
                getCalander(filterData[0], filterData[1], "");
            }

        });

    }
}
function setHorarioUnidadeExecucao() {
    const select = document.querySelector("#select_Unidade");
    if (select) {
        select.addEventListener('change', () => {

            var selected = [];
            for (var option of select.options)
            {
                if (option.selected) {
                    selected.push(option.value);
                }
            }
            appendTurnoOnSelect(timeTables, selected)
            let filterData = setFilterCurso(timeTables, 'Unidade de execução', selected);
            let selectDay = document.querySelector("#filter_ByDay");
            if (selectDay.value !== "") {
                day = getDateCalender(selectDay.value);
                getCalander(filterData[0], filterData[1], day);
            } else {
                getCalander(filterData[0], filterData[1], "");
            }

        });

    }
}
function setHorarioTurno() {
    const select = document.querySelector("#select_Turno");
    if (select) {
        select.addEventListener('change', () => {

            var selected = [];
            for (var option of select.options)
            {
                if (option.selected) {
                    selected.push(option.value);
                }
            }
            let filterData = setFilterCurso(timeTables, 'Turno', selected);
            let selectDay = document.querySelector("#filter_ByDay");
            if (selectDay.value !== "") {
                day = getDateCalender(selectDay.value);
                getCalander(filterData[0], filterData[1], day);
            } else {
                getCalander(filterData[0], filterData[1], "");
            }

        });

    }
}

function setFilterCurso(dataHorarios, typeFilter, filter) {
    var jsonData = "";
    var obj = new Object();
    debugger;
    let id = 0;
    let startTimeTable = "23:00:00";
    for (let value of dataHorarios.values()) {
        id++;
        if(typeFilter === 'Unidade de execução' || typeFilter === 'Turno'){
            for(let x of filter){
                if (value[typeFilter].includes(x)) {
                    obj.groupId = id;
                    obj.title = value['Unidade de execução'] + ", Sala: " + value['Sala da aula'];
                    obj.description = value['Unidade de execução'] + ", Sala: " + value['Sala da aula'] + "";
                    obj.start = getDateTime(value['Dia'], value['Início'], 1);
                    //avaliaçao ternário//
                    startTimeTable < value['Início'] ? startTimeTable : startTimeTable = value['Início'];
                    obj.end = getDateTime(value['Dia'], value['Fim'], 1);
                    jsonData += JSON.stringify(obj) + ",";
                }
            }
  
        }else{
            if (value[typeFilter].includes(filter) ){
                obj.groupId = id;
                obj.title = value['Unidade de execução'] + ", Sala: " + value['Sala da aula'];
                obj.description = value['Unidade de execução'] + ", Sala: " + value['Sala da aula'] + "";
                obj.start = getDateTime(value['Dia'], value['Início'], 1);
                //avaliaçao ternário//
                startTimeTable < value['Início'] ? startTimeTable : startTimeTable = value['Início'];
                obj.end = getDateTime(value['Dia'], value['Fim'], 1);
                jsonData += JSON.stringify(obj) + ",";
            }
        }

    }
    const prepareJson = jsonData.slice(0, -1);
    const final = "[" + prepareJson + "]";
    const filterObjs = JSON.parse(final);
    //console.log(filterObjs);

    return [filterObjs, startTimeTable];
}

///ordena por data os horarios ///
function setSortSchedules(dataHorarios, filterByDay) {
    filterDayArray = [];
    if (filterByDay.value !== "") {
        for (let x of dataHorarios) {
            let dia = getDates(filterByDay.value);
            if (x['Dia'] === dia) {

                filterDayArray.push(x);
            }
        }
        dataHorarios = filterDayArray;
    }
    sortData = dataHorarios.sort((a, b) => {
        return getDateTime(a['Dia'], a['Início'], 0) - getDateTime(b['Dia'], b['Início'], 0);
    });
    sortData = sortData.sort((a, b) => a.Turma - b.Turma);
    return sortData;
}

function generateSchedules(sortData, dataSalas, singleFilter, multipleFilters) {
    debugger
    let filterData = [];
    for (let v of sortData.values()) {
        if (dataSalas.length > 0 && sortData.length > 0) {
            if (v['Características da sala pedida para a aula'] !== "") {
                let classroom = findInTimeTablesSalas(singleFilter, multipleFilters, dataSalas, filterData, v['Turma'], v['Sala da aula'], v['Dia'], v['Início'], v['Fim'], "", v['Inscritos no turno'], "", v['Características da sala pedida para a aula'].replaceAll(" ", "_"), v['Turno com inscrições superiores à capacidade das salas'], v['Turnos com capacidade superior à capacidade das características das salas'], v['Lotação']);
                if (classroom !== false && classroom !== undefined) {
                    v['Sala da aula'] = classroom['Nome_sala'];
                    v['Lotação'] = classroom['Capacidade_Normal'];
                    let caract = "";
                    for (let c in classroom) {
                        if (classroom[c] === 'X') {
                            caract += c + ","
                        }
                    }
                    v['Características reais da sala'] = caract;
                    filterData.push(v);
                } else {

                    filterData.push(v)
                }
            }
        }
    }
    return filterData;
}

function findInTimeTablesSalas(singleFilter, multipleFilters, dataSalas, filterData, turma, salaAula, dataAula, horaInicio, horaFim, edificio, inscritosTurno, Capacidade_Exame, caracteristica, TISCapacidadeSalas, TCCSCCaracteristicasSalas, lotacao) {

    let index = 0;
    salas = [];
    for (let v of dataSalas.values()) {
        if ((edificio === "" && v['Capacidade_Normal'] >= inscritosTurno && v['Capacidade_Normal'] <= singleFilter.value) || (edificio === "" && TISCapacidadeSalas === 'VERDADEIRO')) {
            if (v[caracteristica] === 'X') {
                if (filterData.length > 0) {
                    for (let i of filterData.values()) {
                        if (dataAula === i['Dia'] && salaAula === i['Sala da aula']) {
                            debugger
                            if (i['Turma'] === turma) {
                                salas.push(i);
                            } else {
                                if ((getHours(dataAula, horaInicio) >= getHours(i['Dia'], i['Fim'])))
                                    salas.push(v);
                                if ((getHours(dataAula, horaFim) >= getHours(i['Dia'], i['Início']))) {
                                    salas.push(v);
                                }
                            }

                        }
                    }
                } else {
                    salas.push(v);
                }
            }
        }

    }
    index = Math.floor(Math.random() * salas.length)
    return salas[index];
}



//////////////gerar horario main////////////
function setGenerateScheduless() {
    const select = document.querySelector("#btn_gerarHorario");
    if (select) {
        select.addEventListener('click', () => {
            const singleFilter = document.querySelector("#singleFilter");

            const multipleFilters = document.querySelector("#multipleFilters");
            const filterByDay = document.querySelector("#filter_ByDay")
            //const text = select.options[select.selectedIndex].text;
            let sortSchedules = setSortSchedules(timeTablesTemp, filterByDay);
            let Schedules = generateSchedules(sortSchedules, timeTablesSalas, singleFilter, multipleFilters);
            timeTables = Schedules;
            let selectDay = document.querySelector("#filter_ByDay");
            let filterData = setFilterCurso(timeTables, timeTablesSalas, "");
            if (selectDay.value !== "") {
                day = getDateCalender(selectDay.value);
                console.log(day);
                getCalander(filterData[0], filterData[1], day);
            } else {
                getCalander(filterData[0], filterData[1], "");
            }
            const modal = document.querySelector('#validateFile');
            const modalValidateFile = new bootstrap.Modal(modal);
            document.querySelector('#ModalLabel').innerHTML = "<h4><b>Horario gerado!.</b><h4/>";
            document.querySelector('.modal-message').innerHTML = "Horario Gerado com sucesso para o dia: <b>" + day + ".</b>";
            modalValidateFile.show();

        });
    }
}

function setGenerateExcel() {
    const select = document.querySelector("#btn_gerarCSV");
    if (select) {
        select.addEventListener('click', () => {
            let csv = json2csv.parse(timeTables);
            downloadCsv(csv, "horario_"+getTodayDate()+".csv");

        });
    }
}


// função para preencher select curso
function appendCursoOnSelect(dataHorarios, dataSalas) {
    let select = document.querySelector("#select_curso");
    var turma = [];
    if (dataHorarios === "") {
        return false;
    }
    for (let value of dataHorarios.values()) {
        if (turma.indexOf(value['Curso']) === -1 && value['Curso'] !== "") {
            turma.push(value['Curso']);
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

//função para preencher select unidade execução//
function appendUnidadeOnSelect(dataHorarios, filtro) {
    let select = document.querySelector("#select_Unidade");
    select.innerHTML = "";
    select.innerHTML = '<option selected>Selecione Unid. Execução</option>'
    var turma = [];
    if (dataHorarios === "") {
        return false;
    }
    for (let value of dataHorarios.values()) {
        if (turma.indexOf(value['Unidade de execução']) === -1 && value['Unidade de execução'] !== "" && value['Curso'] === filtro) {
            turma.push(value['Unidade de execução']);
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


//função para preencher select turno//
function appendTurnoOnSelect(dataHorarios, filtro) {
    let select = document.querySelector("#select_Turno");
    select.innerHTML = "";
    select.innerHTML = '<option selected>Selecione Turno</option>'
    var turma = [];
    if (dataHorarios === "") {
        return false;
    }
    for( let x of filtro){
        for (let value of dataHorarios.values()) {
            if (turma.indexOf(value['Turno']) === -1 && value['Turno'] !== "" && value['Unidade de execução'] === x) {
                turma.push(value['Turno']);
            }
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
