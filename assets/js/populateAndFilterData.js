document.addEventListener('DOMContentLoaded', function () {
    setTurma();
});

function setTurma() {
    const select = document.querySelector("#select_turma");
    if (select) {
        select.addEventListener('change', () => {
            const value = select.value;
            const text = select.options[select.selectedIndex].text;
            filterData(timeTables, value);
        });
    }
}

function filterData(data, classFilter) {
    var jsonData = "";
    var obj = new Object();
    debugger;
    let id = 0;
    let startTimeTable = "23:00:00";
    for (let value of data.values()) {
        id++;
        if (classFilter) {
            var filter = classFilter;
        } else {
            var filter = 'MEI-PL-A1';
        }
        if (value['Turma'].includes(filter)) {
            obj.groupId = id;
            obj.title = value['Unidade de execução'];
            let dataObj = value['Dia'].replace(/(\d*)\/(\d*)\/(\d*).*/, '$3-$2-$1');
            obj.start = dataObj + "T" + value['Início'];
            startTimeTable < value['Início'] ? startTimeTable : startTimeTable = value['Início'];
            obj.end = dataObj + "T" + value['Fim'];
            jsonData += JSON.stringify(obj) + ",";
        }
    }
    let prepareJson = jsonData.slice(0, -1);
    let final = "[" + prepareJson + "]";
    const filterObjs = JSON.parse(final);
    filterByDay(data);
    getCalander(filterObjs, startTimeTable);
}

function listOfClass(data) {
    debugger;
    let select = document.querySelector("#select_turma");
    select.style.display = "block";
    var turma = [];
    for (let value of data.values()) {
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


function filterByDay(data) {
    debugger;
    let id = 0;
    let dateByDay = [];
    for (let value of data.values()) {
        id++;
        if (value['Dia'].includes('19/09/2022')) {
            dateByDay.push(value);
        }
    }
    console.log(dateByDay);
}
