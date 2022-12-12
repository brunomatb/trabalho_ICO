document.addEventListener('DOMContentLoaded', function () {
    setTurma();
});

var timeTables = "";
//funçaõ para validar se a extenção do dicheiro é .json.
function validateFile() {
    const file = document.querySelector('#file_json').files[0];
    if (!file) {
        const modal = document.querySelector('#validateFile');
        const modalValidateFile = new bootstrap.Modal(modal);
        modalValidateFile.show();
        return false;
    }
    const fileName = document.querySelector('#file_json').files[0].name.split(".")[0];
    const ext = document.querySelector('#file_json').files[0].name.split(".")[1];
    if (ext !== 'json') {
        const modal = document.querySelector('#validateFile');
        const modalValidateFile = new bootstrap.Modal(modal);
        modalValidateFile.show();
        return false;
    }
    var reader = new FileReader();
    reader.onload = (function (f) {
        return function (e) {
            try {
                json = JSON.parse(e.target.result);
                timeTables = json;
                filterData(json, "");
                listOfClass(json);
            } catch (ex) {
                console.log('error when trying to parse json = ' + ex);
            }
        };
    })(file);
    jsonfile = reader.readAsText(file, fileName);

    console.log(jsonfile);
}

function setData(jsonData, value) {
    if (jsonData !== "") {
        if (value) {
            var classFilter = value;
        } else {
            var classFilter = "";
        }
        debugger;
        let teste = setTurma();
        filterData(jsonData, classFilter);
    }

}

function filterData(data, classFilter) {
    debugger;
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
    let filterObjs = JSON.parse(final);
    getCalander(filterObjs);

    return filterObjs;
}

function listOfClass(data) {
    debugger;
    let select = document.querySelector("#select_turma");
    select.style.display = "block";
    var turma = [];
    for (let value of data.values()) {
        if (turma.indexOf(value['Turma']) === -1) {
            turma.push(value['Turma']);
        }

    }
    
    turma.sort();
    for (let x of turma) {
        let newOption = document.createElement('option');
        
        newOption.value = x.value;
        newOption.textContent = x.value;
        select.appendChild(newOption);
    }


}

function setTurma() {
    var select = document.querySelector("#select_turma");
    if (select) {
        select.addEventListener('change', () => {
            var value = select.value;
            var text = select.options[select.selectedIndex].text;
            setData(timeTables, value);
        });
    }
}