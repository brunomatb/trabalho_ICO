document.addEventListener('DOMContentLoaded', function () {
    getCalander();
    getSchedules();
});

function getSchedules() {
    let formData = new FormData();
    formData.append('accao', 'getSchedule');
    var pedido = fetch('utils/data/ADS_H 2022_23.json', )
            .then((response) => {
                console.log(response);
                return response.json();
            }).then((data) => {
        var event = [];
        var events = [];
        var jsonData = "";
        var dataStr = "";
        var obj = new Object();
        for (let value of data.values()) {
            if (value['Turma'].includes('MEI-PL-A1')) {
                obj.title = value['Unidade de execução'];
                let dataObj = value['Dia'];
                dataStr = dataObj.replace(/(\d*)-(\d*)-(\d*).*/, '$3/$2/$1');
                obj.start = dataStr + "T" + value['Início'];
                obj.end = dataStr + "T" + value['Fim'];
                jsonData += JSON.stringify(obj) + ",";
            }
        }
        let novo = jsonData.slice(0, -1);

        let final = "[" + novo + "]";
        let finalObj = JSON.parse(final);
        console.log(finalObj);
    });
    return pedido;
}

function getCalander(json) {
    var initialLocaleCode = 'en';

    var localeSelectorEl = document.getElementById('locale-selector');
    var calendarEl = document.getElementById('calendar');

    debugger;
    var teste = '[{"groupId": 2,"title": "Gestão de Marcas","start": "2022-12-08T11:00:00","end": "2022-12-08T12:00:00"}]';
    debugger;
    let novo = JSON.parse(teste);
    var calendar = new FullCalendar.Calendar(calendarEl, {

        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
        },
        locale: 'pt',
        buttonIcons: false, // show the prev/next text
        weekNumbers: true,
        navLinks: true, // can click day/week names to navigate views
        editable: false,
        initialView: 'timeGridWeek',
        weekends: false,
        dayMaxEvents: true, // allow "more" link when too many events
        slotMinTime: '08:00:00',

        events: json,
        eventDidMount: function (info) {
            var tooltip = new Tooltip(info.el, {
                title: info.event.extendedProps.description,
                placement: 'top',
                trigger: 'hover',
                container: 'body'
            });
        }
    });
    calendar.render();

    // build the locale selector's options
    calendar.getAvailableLocaleCodes().forEach(function (localeCode) {
        var optionEl = document.createElement('option');
        optionEl.value = localeCode;
        optionEl.selected = localeCode == 'pt';
        optionEl.innerText = localeCode;
        localeSelectorEl.appendChild(optionEl);
    });

    // when the selected option changes, dynamically change the calendar option
    localeSelectorEl.addEventListener('change', function () {
        if (this.value) {
            calendar.setOption('locale', this.value);
        }
    });

}