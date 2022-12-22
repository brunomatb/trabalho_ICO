document.addEventListener('DOMContentLoaded', function () {
    setTurma();
});

function setTurma() {
    const select = document.querySelector("#select_turma");
    if (select) {
        select.addEventListener('change', () => {
            const value = select.value;
            //const text = select.options[select.selectedIndex].text;
            setFilterData(timeTables, timeTablesSalas, value);
        });
    }
}

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
            obj.start = formatDate(value['Dia'], value['Início'], 1);
            startTimeTable < value['Início'] ? startTimeTable : startTimeTable = value['Início'];
            obj.end = formatDate(value['Dia'], value['Fim'], 1);
            jsonData += JSON.stringify(obj) + ",";
        }
    }
    const prepareJson = jsonData.slice(0, -1);
    const final = "[" + prepareJson + "]";
    const filterObjs = JSON.parse(final);
    console.log(filterObjs);
    setFilterByDay(dataHorarios, dataSalas);
    getCalander(filterObjs, startTimeTable);
}

function getListOfClass(dataHorarios, dataSalas) {
    debugger;
    let select = document.querySelector("#select_turma");
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

function setFilterByDay(dataHorarios, dataSalas) {
    let id = 0;
    let dateByDay = [];
    for (let value of dataHorarios.values()) {
        id++;
        if (value['Dia'].includes('19/09/2022')) {
            dateByDay.push(value);
        }
    }

    sortData = dataHorarios.sort((a, b) => {
        return formatDate(a['Dia'], a['Início'], 0) - formatDate(b['Dia'], b['Início'], 0);
    });

    console.log(sortData);
    debugger
    let filterData = [];
    for (let v of sortData.values()) {
        if (dataSalas.length > 0 && dataHorarios.length > 0) {
            if (v['Características da sala pedida para a aula'] !== "") {
                console.log(v);
                let classroom = findInTimeTablesSalas(dataSalas, "", v['Inscritos no turno'], "", v['Características da sala pedida para a aula'].replaceAll(" ", "_"), v['Turno com inscrições superiores à capacidade das salas'], v['Turnos com capacidade superior à capacidade das características das salas'], v['Lotação']);
                console.log(classroom);
                if(classroom !== false && classroom !== undefined){
                    v['Sala da aula'] = classroom['Nome_sala'];
                    filterData.push(v);
                }else{
                    filterData.push(v)
                }
            }
        }

    }
    console.log(filterData);
}

function findInTimeTablesSalas(dataSalas, edificio, inscritosTurno, Capacidade_Exame, caracteristica, TISCapacidadeSalas, TCCSCCaracteristicasSalas,  lotacao ) {

    let index = 0;
    
    salas = [];
    for (let v of dataSalas.values()) {
        
        if (edificio === v['Edifício'] && v['Capacidade_Normal'] >= inscritosTurno) {
            for (let c in v) {
                if (caracteristica.toLowerCase().includes(c.toLowerCase()) && v[c] === 'X') {
                    salas.push(v);
                }
            }
        }
        
        if(caracteristica === 'Não_necessita_de_sala' || caracteristica === 'Lab_ISTA' ){
            debugger
            return false;
        }
        if (edificio === "" && v['Capacidade_Normal'] >= inscritosTurno || (edificio === "" && TISCapacidadeSalas === 'VERDADEIRO' && lotacao >= v['Capacidade_Normal'])) {
            for (let c in v) {
                
                if (caracteristica.toLowerCase().includes(c.toLowerCase()) && v[c] === 'X') {
                    salas.push(v);
                }
            }
        }
        if(caracteristica === 'Laboratório_de_Arquitectura_de_Computadores_I'){
            for (let c in v) {
                if (caracteristica.toLowerCase().includes(c.toLowerCase()) && v[c] === 'X') {
                    salas.push(v);
                }
            }
        }
        if(caracteristica === 'Laboratório_de_Arquitectura_de_Computadores_II'){
            for (let c in v) {
                if (caracteristica.toLowerCase().includes(c.toLowerCase()) && v[c] === 'X') {
                    salas.push(v);
                }
            }
        }
        if(caracteristica === 'Laboratório_de_Telecomunicações'){
            for (let c in v) {
                if (caracteristica.toLowerCase().includes(c.toLowerCase()) && v[c] === 'X') {
                    salas.push(v);
                }
            }
        }

        
        if (edificio === "" && TISCapacidadeSalas === 'VERDADEIRO' && TCCSCCaracteristicasSalas === 'VERDADEIRO' && lotacao < v['Capacidade_Normal'] ) {
              return false;
        }
        let idx = 0;

    }
    index = Math.floor(Math.random() * salas.length)
    return salas[index];
}

function formatDate(date, time, timestamp) {
    if (timestamp === 1) {
        return new Date(date.replace(/(\d*)\/(\d*)\/(\d*).*/, '$3-$2-$1') + "T" + time).getTime();
    } else {
        return new Date(date.replace(/(\d*)\/(\d*)\/(\d*).*/, '$3-$2-$1') + " " + time).getTime();
    }

}


