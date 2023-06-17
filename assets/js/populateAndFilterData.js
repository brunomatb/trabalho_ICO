document.addEventListener('DOMContentLoaded', function () {
    setHorarioMain();
    setGenerateExcel();
    setHorarioUnidadeExecucao();
    setHorarioTurno();

});

/*
 função para filtrar,ciar e retornar um abjeto JSON para ser populado os dados no calendario, 
 este objeto tem formato da biblioteca, esta função não chama nenhuma outra função issencial para popular dados
*/
function setFilterCurso(dataHorarios, typeFilter, filter) {
    var obj = new Object();
    var arrayObj = []
    let id = 0;
    let startTimeTable = "23:00:00";
    for (let value of dataHorarios.values()) {
        id++;
        if (typeFilter === 'Unidade de execução' || typeFilter === 'Turno') {
            for (let x of filter) {
                if (value[typeFilter].includes(x)) {
                    obj = new Object();
                    obj.groupId = id;
                    obj.title = value['Unidade de execução'] + ", Sala: " + value['Sala da aula'];
                    obj.description = value['Unidade de execução'] + ", Sala: " + value['Sala da aula'] + "";
                    obj.start = getDateTime(value['Dia'], value['Início'], 1);
                    //avaliaçao ternário//
                    startTimeTable < value['Início'] ? startTimeTable : startTimeTable = value['Início'];
                    obj.end = getDateTime(value['Dia'], value['Fim'], 1);
                    arrayObj.push(obj);
                }
            }
        } else {

            if (value[typeFilter].includes(filter)) {
                obj = new Object();
                obj.groupId = id;
                obj.title = value['Unidade de execução'] + ", Sala: " + value['Sala da aula'];
                obj.description = value['Unidade de execução'] + ", Sala: " + value['Sala da aula'] + "";
                obj.start = getDateTime(value['Dia'], value['Início'], 1);
                //avaliaçao ternário//
                startTimeTable < value['Início'] ? startTimeTable : startTimeTable = value['Início'];
                obj.end = getDateTime(value['Dia'], value['Fim'], 1);
                arrayObj.push(obj);
            }
        }
    }
    return [arrayObj, startTimeTable];
}


// função para horario o turno, chama função setFilterCurso() para voltar a filtrar os dados e refaz o getCalander()
function setHorarioMain() {
    const select = document.querySelector("#select_curso");
    if (select) {
        select.addEventListener('change', () => {
            if (select.id === 'select_curso') {
                appendUnidadeOnSelect(timeTables, select.value);
                var filterData = setFilterCurso(timeTables, 'Curso', select.value);
                getCalander(filterData[0], filterData[1], "");
            }
        });

    }
}
// função para preencher o turno, chama função setFilterCurso() para voltar a filtrar os dados e refaz o getCalander()
function setHorarioUnidadeExecucao() {
    const select = document.querySelector("#select_Unidade");
    if (select) {
        select.addEventListener('change', () => {
            var selected = [];
            for (var option of select.options) {
                if (option.selected) {
                    selected.push(option.value);
                }
            }
            appendTurnoOnSelect(timeTables, selected)
            let filterData = setFilterCurso(timeTables, 'Unidade de execução', selected);
            getCalander(filterData[0], filterData[1], "");
        });
    }
}

// função para preencher o turno, chama função setFilterCurso() para voltar a filtrar os dados e refaz o getCalander()
function setHorarioTurno() {
    const select = document.querySelector("#select_Turno");
    if (select) {
        select.addEventListener('change', () => {
            debugger
            var selected = [];
            for (var option of select.options) {
                if (option.selected) {
                    selected.push(option.value);
                }
            }
            let filterData = setFilterCurso(timeTables, 'Turno', selected);
            getCalander(filterData[0], filterData[1], "");
        });

    }
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

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            //console.log("Hello from inside the testAsync function");
            const singleFilter = document.querySelector("#singleFilter");
            const multipleFilters = document.querySelector("#multipleFilters");
            const filterByDay = document.querySelector("#filter_ByDay")
            //const text = select.options[select.selectedIndex].text;
            let sortSchedules = setSortSchedules(timeTablesTemp, filterByDay);
            let Schedules = generateSchedules(sortSchedules, timeTablesSalas, singleFilter, multipleFilters);
            timeTables = Schedules;
            alertModal();
            analysis.push(setOvercrowedRooms());
            let selectDay = document.querySelector("#filter_ByDay");
            let filterData = setFilterCurso(timeTables, 'Curso', "MAE");
            if (selectDay.value !== "") {
                day = getDateCalender(selectDay.value);
                //console.log(day);
                getCalander(filterData[0], filterData[1], day);
            } else {
                getCalander(filterData[0], filterData[1], "");
            }
        }, 1500);
        resolve();
    }, { once: true });

}
async function openModal() {
    const modal = document.querySelector('#modalWaitTimeTables');
    const modalValidateFile = new bootstrap.Modal(modal);
    modalValidateFile.show();
    document.querySelector('.header-modalWaitTimeTables').textContent = 'A gerar soluções, por favor aguarde...';
    document.querySelector('.generate-time-tables-spinner-footer').style.display = 'none';
    document.querySelector('.generate-time-tables-spinner').style.display = 'block';
    return true;
}
async function alertModal() {
    document.querySelector('.header-modalWaitTimeTables').textContent = 'Soluções geradas';
    document.querySelector('.generate-time-tables-spinner').style.setProperty('display', 'none', 'important');
    document.querySelector('.modal-message-time-tables').innerHTML = "Horario Gerado com sucesso.</b>";
    document.querySelector('.generate-time-tables-spinner-footer').style.display = 'block';
}
async function gerarHorario_2() {

    await openModal();
    setGenerateScheduless();
}

function setGenerateExcel() {
    const select = document.querySelector("#btn_gerarCSV");
    if (select) {
        select.addEventListener('click', () => {
            let csv = json2csv.parse(solutionDownload);
            downloadCsv(csv, "horario_" + getTodayDate() + ".csv");

        });
    }
}

// função para preencher select curso
function appendCursoOnSelect(dataHorarios, dataSalas) {
    let select = document.querySelector("#select_curso");
    select.innerHTML = "";
    select.innerHTML = '<option>Selecione curso</option>'
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
    var uExecucao = [];
    if (dataHorarios === "") {
        return false;
    }

    let arrayFiltro = filtro.split(",");
    for (c of arrayFiltro) {
        // regex para procurar a ultima palavra da string //
        // let regexTestCurso = new RegExp('\\b' + c.trim() + '$|\\s' + c.trim() + ',|^' + c.trim() + '\\s|^' + c.trim() + ',|^' + c.trim());
        for (let value of dataHorarios.values()) {
            let cursoOnHorarios = value['Curso'].split(",");
            for (let v of cursoOnHorarios) {

                if (c.trim() === v.trim()) {
                    if (uExecucao.indexOf(value['Unidade de execução']) === -1 && value['Unidade de execução'] !== "") {
                        //console.log(value['Curso']);
                        uExecucao.push(value['Unidade de execução']);
                    }
                }

            }
        }
        regexTestCurso = '';
    }
    uExecucao.sort();
    for (let x of uExecucao) {
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
    for (let x of filtro) {
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
