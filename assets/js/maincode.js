document.addEventListener('DOMContentLoaded', function () {
    getCalander();
    loadSelectItems();
    loadSelectItems2();
});

function getCalander(json, startTimeTable, initialDay) {
    var initialLocaleCode = 'en';
    debugger
    initialDay !==""?initialDay : initialDay = getTodayDate();
    startTimeTable === undefined ? startTimeTable = '08:00:00' : startTimeTable;
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
        editable: true,
        eventDrop: function (e) {
            alert(e)
        },
        initialView: 'timeGridWeek',
        weekends: true,
        dayMaxEvents: true, // allow "more" link when too many events
        slotMinTime: startTimeTable,
        initialDate : initialDay,
        eventDidMount: function (info) {
            var tooltip = new Tooltip(info.el, {
                title: info.event.extendedProps.description,
                placement: 'top',
                trigger: 'hover',
                container: 'body'
            });
        },
        events: json,
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


function loadSelectItems(){
    
    var multipleCancelButton = new Choices('#multipleFilters', {
        removeItemButton: true,
        maxItemCount:5,
        searchResultLimit:5,
        renderChoiceLimit:5
      }); 
}
function loadSelectItems2(){
    
    var multipleCancelButton = new Choices('#singleFilter', {
        removeItemButton: true,
        maxItemCount:5,
        searchResultLimit:5,
        renderChoiceLimit:5
      }); 
}
