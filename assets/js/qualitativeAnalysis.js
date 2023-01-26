function setOvercrowedRooms() {

    debugger
    let overcrowedRooms = 0;
    let studentsWithoutSeat = 0;
    let unusedSeats = 0;
    let unusedRoomCharacteristics = 0;
    for (let x of timeTables) {
        let capacity = x['Lotação'];
        let nrStudents = x['Inscritos no turno'];
        let roomCharacteristics = x['Características reais da sala'].split(',');
        let requestedCharacteristics = x['Características da sala pedida para a aula'].split(',');
        counter = 0;
        for (let c of requestedCharacteristics) {
            for (let r in roomCharacteristics) {
                if (c === r) {
                    counter++;
                }
            }
        }
        if (roomCharacteristics.length > counter) {
            counter = roomCharacteristics.length - counter;
            unusedRoomCharacteristics = unusedRoomCharacteristics + counter;
        }

        if (nrStudents > capacity) {
            overcrowedRooms = overcrowedRooms + 1
        }
        if (nrStudents > capacity) {
            let sub = nrStudents - capacity
            studentsWithoutSeat = studentsWithoutSeat + sub
        }
        if (nrStudents < capacity) {
            let sub2 = capacity - nrStudents
            unusedSeats = unusedSeats + sub2
        }
    }
    return [overcrowedRooms, Math.abs(studentsWithoutSeat), unusedSeats, unusedRoomCharacteristics];

}


function dataChart() {
    var chartArray = [];
    const rgba = ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(55, 230, 142, 0.2)', 'rgba(230, 198, 55, 0.2)'];
    const backGround = ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(55, 230, 142)','rgb(230, 198, 55)']
    if (analysis.length > 0) {
        idx = 0;
        debugger
        for (let x of analysis) {
                var obj = new Object();
                let label = "Horário"+(idx+1).toString();
                obj.label = label,
                obj.data = x,
                obj.fill = true,
                obj.backgroundColor = rgba[idx],
                obj.borderColor = backGround[idx],
                obj.pointBackgroundColor = backGround[idx],
                obj.pointHoverBorderColor = backGround[idx],
                obj.pointBorderColor = '#fff',
                obj.pointHoverBackgroundColor = '#fff'
            idx++;
            chartArray.push(obj);
        }
        console.log(chartArray);
        return  chartArray;
    }
}
function getChart() {
    if (analysis.length > 0) {

        const data = {
            labels: [
                'OvercrowedRooms',
                'StudentsWithoutSeat',
                'UnusedSeats',
                'UnusedRoomCharacteristics',
            ],
            datasets: dataChart()
        };
        let chartStatus = Chart.getChart("myChart"); // <canvas> id
        if (chartStatus != undefined) {
            chartStatus.destroy();
        }
        const ctx = document.getElementById('myChart');

        new Chart(ctx, {

            type: 'radar',
            data: data,
            options: {
                elements: {
                    line: {
                        borderWidth: 3
                    }
                }
            },
        });
    }
}

