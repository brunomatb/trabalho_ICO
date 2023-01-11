document.addEventListener('DOMContentLoaded', function () {
    setHorarioMain();
    setGenerateScheduless();
    setGenerateExcel();
});



function setFilterData(dataHorarios, dataSalas, classFilter) {
    var jsonData = "";
    var obj = new Object();
    debugger;
    let id = 0;
    let startTimeTable = "23:00:00";
    for (let value of dataHorarios.values()) {
        id++;
        if (classFilter) {
            var filter = classFilter;
        } else {
            var filter = 'MEI-PL-A1';
        }
        if (value['Turma'].includes(filter)) {
            obj.groupId = id;
            obj.title = value['Unidade de execução'] + "Sala: " + value['Sala da aula'];
            obj.description = value['Unidade de execução'] + "Sala: " + value['Sala da aula'] + "(</br>)";
            obj.start = getDateTime(value['Dia'], value['Início'], 1);
            startTimeTable < value['Início'] ? startTimeTable : startTimeTable = value['Início'];
            obj.end = getDateTime(value['Dia'], value['Fim'], 1);
            jsonData += JSON.stringify(obj) + ",";
        }
    }
    const prepareJson = jsonData.slice(0, -1);
    const final = "[" + prepareJson + "]";
    const filterObjs = JSON.parse(final);
    //console.log(filterObjs);
    return [filterObjs, startTimeTable];
}

///ordena por data os horarios ///
function setSortSchedules(dataHorarios) {
    sortData = dataHorarios.sort((a, b) => {
        return getDateTime(a['Dia'], a['Início'], 0) - getDateTime(b['Dia'], b['Início'], 0);
    });
    return sortData;
}

function generateSchedules(sortData, dataSalas) {
    return new Promise((resolve)=>{
        let filterData = [];
        for (let v of sortData.values()) {
            if (dataSalas.length > 0 && sortData.length > 0) {
                if (v['Características da sala pedida para a aula'] !== "") {
                    let classroom = findInTimeTablesSalas(dataSalas, filterData, v['Sala da aula'], v['Dia'], v['Início'], v['Fim'], "", v['Inscritos no turno'], "", v['Características da sala pedida para a aula'].replaceAll(" ", "_"), v['Turno com inscrições superiores à capacidade das salas'], v['Turnos com capacidade superior à capacidade das características das salas'], v['Lotação']);
                    if (classroom !== false && classroom !== undefined) {
                        v['Sala da aula'] = classroom['Nome_sala'];
                        filterData.push(v);
                    } else {
    
                        filterData.push(v)
                    }
                }
            }
        }
        resolve();
    });
    
    
}

function findInTimeTablesSalas(dataSalas, filterData, salaAula, dataAula, horaInicio, horaFim, edificio, inscritosTurno, Capacidade_Exame, caracteristica, TISCapacidadeSalas, TCCSCCaracteristicasSalas, lotacao) {

    let index = 0;
    salas = [];
    for (let v of dataSalas.values()) {
        if (edificio === "" && v['Capacidade_Normal'] >= inscritosTurno || (edificio === "" && TISCapacidadeSalas === 'VERDADEIRO' && lotacao >= v['Capacidade_Normal'])) {
            if (v[caracteristica] === 'X') {
                if (filterData.length > 0) {
                    for (let i of filterData.values()) {
                        if (dataAula === i['Dia'] && salaAula === i['Sala da aula']) {
                            if ((getHours(dataAula, horaInicio) >= getHours(i['Dia'], i['Fim'])))
                                salas.push(v);
                            if ((getHours(dataAula, horaFim) >= getHours(i['Dia'], i['Início']))) {
                                salas.push(v);
                            }
                        }
                    }
                } else {
                    salas.push(v);
                }
            }
        }

        //        if (caracteristica === 'Não_necessita_de_sala' || caracteristica === 'Lab_ISTA') {
        //            return false;
        //        }
        //        if (edificio === "" && v['Capacidade_Normal'] >= inscritosTurno || (edificio === "" && TISCapacidadeSalas === 'VERDADEIRO' && lotacao >= v['Capacidade_Normal'])) {
        //            for (let c in v) {
        //
        //                if (caracteristica.toLowerCase().includes(c.toLowerCase()) && v[c] === 'X') {
        //                    salas.push(v);
        //                }
        //            }
        //        }
        //        if (caracteristica === 'Laboratório_de_Arquitectura_de_Computadores_I') {
        //            for (let c in v) {
        //                if (caracteristica.toLowerCase().includes(c.toLowerCase()) && v[c] === 'X') {
        //                    salas.push(v);
        //                }
        //            }
        //        }
        //        if (caracteristica === 'Laboratório_de_Arquitectura_de_Computadores_II') {
        //            for (let c in v) {
        //                if (caracteristica.toLowerCase().includes(c.toLowerCase()) && v[c] === 'X') {
        //                    salas.push(v);
        //                }
        //            }
        //        }
        //        if (caracteristica === 'Laboratório_de_Telecomunicações') {
        //            for (let c in v) {
        //                if (caracteristica.toLowerCase().includes(c.toLowerCase()) && v[c] === 'X') {
        //                    salas.push(v);
        //                }
        //            }
        //        }
        //
        //
        //        if (edificio === "" && TISCapacidadeSalas === 'VERDADEIRO' && TCCSCCaracteristicasSalas === 'VERDADEIRO' && lotacao < v['Capacidade_Normal']) {
        //            return false;
        //        }
        //        let idx = 0;

    }
    index = Math.floor(Math.random() * salas.length)
    return salas[index];
}

//////////////setHorario////////////
function setHorarioMain() {
    const select = document.querySelector("#select_turma");
    if (select) {
        select.addEventListener('change', () => {
            const value = select.value;
            //const text = select.options[select.selectedIndex].text;
            let filterData = setFilterData(timeTables, timeTablesSalas, value);
            console.log(filterData)
            getCalander(filterData[0], filterData[1]);
        });
    }
}

//////////////gerar horario main////////////
function setGenerateScheduless() {
    const select = document.querySelector("#btn_gerarHorario");
    if (select) {
        select.addEventListener('click', () => {
            //const text = select.options[select.selectedIndex].text;
            let sortSchedules = asetSortSchedules(timeTables);
            let Schedules = generateSchedules(sortSchedules, timeTablesSalas);
            timeTables = schedules;
            console.log(Schedules)

        });
    }
}

function setGenerateExcel() {
    const select = document.querySelector("#btn_gerarExcel");
    if (select) {
        select.addEventListener('click', () => {
            createExcel(timeTables, "teste.xlsx");

        });
    }
}