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
    for (let value of data.values()) {
       
        if (classFilter) {
            var filter = classFilter;
        } else {
            var filter = 'MEI-PL-A1';
        }
        if (value['Turma'].includes(filter)) {
            obj.title = value['Unidade de execução'];
            let dataObj = value['Dia'].replace(/(\d*)\/(\d*)\/(\d*).*/, '$3-$2-$1');
            obj.start = dataObj + "T" + value['Início'];
            obj.end = dataObj + "T" + value['Fim'];
            jsonData += JSON.stringify(obj) + ",";
        }
    }
    let prepareJson = jsonData.slice(0, -1);
    let final = "[" + prepareJson + "]";
    const filterObjs = JSON.parse(final);
    getCalander(filterObjs);
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
