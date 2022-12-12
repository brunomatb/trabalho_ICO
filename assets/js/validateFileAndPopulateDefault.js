var timeTables = "";
//funçaõ para validar se a extenção do ficheiro é .json, caso .json valido lê ficheiro e chama a função filterData, listOfClass.
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
}


