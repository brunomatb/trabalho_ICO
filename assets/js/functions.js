function getDateTime(date, time, timestamp) {
    if (timestamp === 1) {
        return new Date(date.replace(/(\d*)\/(\d*)\/(\d*).*/, '$3-$2-$1') + "T" + time);
    } else {
        return new Date(date.replace(/(\d*)\/(\d*)\/(\d*).*/, '$3-$2-$1') + " " + time).getTime();
    }

}
function getHours(date, time) {
    return new Date(date.replace(/(\d*)\/(\d*)\/(\d*).*/, '$3-$2-$1') + "T" + time).getHours();
}



function createExcel(json, fileName) {
    var xlsSheet = [];
    var xlsHeader = ["Curso", "Unidade de execução","Turno","Turma","Inscritos no turno","Turnos com capacidade superior à capacidade das características das salas","Turno com inscrições superiores à capacidade das salas","Dia da Semana", "Início","Fim","Dia","Características da sala pedida para a aula","Sala da aula","Lotação","Características reais da sala"];
    xlsSheet.unshift(xlsHeader);
    var filename = fileName + ".xlsx";
    var wb = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(json);

    XLSX.utils.book_append_sheet(wb, worksheet);
    XLSX.writeFile(wb, filename);

}
