document.addEventListener('DOMContentLoaded', function () {
    getCalander();
});

function getCalander(json) {
    var initialLocaleCode = 'en';

    var localeSelectorEl = document.getElementById('locale-selector');
    var calendarEl = document.getElementById('calendar');
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