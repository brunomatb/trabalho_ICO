function getDateTime(date, time, timestamp) {
    if (timestamp === 1) {
        return new Date(date.replace(/(\d*)\/(\d*)\/(\d*).*/, '$3-$2-$1') + "T" + time);
    } else {
        return new Date(date.replace(/(\d*)\/(\d*)\/(\d*).*/, '$3-$2-$1') + " " + time).getTime();
    }

}

function convertHour(hour) {
    var horario = hour.split(":");
    var data = new Date(); 
    data.setHours(parseInt(horario[0]));
    data.setMinutes(parseInt(horario[1]));
    data.setSeconds(parseInt(horario[2]));
    return data.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  }
  
function getHourNow(){
    var data = new Date(); 
    return data
}
function getDates(date) {
    year = new Date(date).getFullYear();
    month = new Date(date).getMonth() + 1;
    if (String(month).length === 1) {
        month = "0" + month;
    }

    day = new Date(date).getDate();
    if (String(day).length === 1) {
        day = "0" + day;
    }
    return day + "/" + month + "/" + year;
}
function getHours(date, time) {
    return new Date(date.replace(/(\d*)\/(\d*)\/(\d*).*/, '$3-$2-$1') + "T" + time).getHours();
}

function getTodayDate() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    return today;
}

function getDateCalender(date) {
    year = new Date(date).getFullYear();
    month = new Date(date).getMonth() + 1;
    if (String(month).length === 1) {
        month = "0" + month;
    }
    day = new Date(date).getDate();
    if (String(day).length === 1) {
        day = "0" + day;
    }
    return year + "-" + month + "-" + day;
}



function createExcel(json, fileName) {
    var xlsSheet = [];
    var xlsHeader = ["Curso", "Unidade de execução", "Turno", "Turma", "Inscritos no turno", "Turnos com capacidade superior à capacidade das características das salas", "Turno com inscrições superiores à capacidade das salas", "Dia da Semana", "Início", "Fim", "Dia", "Características da sala pedida para a aula", "Sala da aula", "Lotação", "Características reais da sala"];
    xlsSheet.unshift(xlsHeader);
    var filename = fileName + ".xlsx";
    var wb = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(json);
    XLSX.utils.book_append_sheet(wb, worksheet);
    XLSX.writeFile(wb, filename);
}

function downloadCsv(csvData, filename) {
    const element = document.createElement("a");
    element.setAttribute("href", `data:text/csv;charset=utf-8,${csvData}`);
    element.setAttribute("download", filename);
    element.style.display = "none";

    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
