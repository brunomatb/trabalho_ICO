function setOvercrowedRooms() {

    
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

function randomColor() {
    const r = Math.floor(Math.random() * 200); // Valor máximo reduzido para suavizar as cores
    const g = Math.floor(Math.random() * 200);
    const b = Math.floor(Math.random() * 200);
    const alpha = 0.2; // Valor de transparência definido como 0.2
  
    const rgba = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    const rgb = `rgb(${r}, ${g}, ${b})`;
  
    return {
      rgba: rgba,
      rgb: rgb
    };
  }
  

function dataChart(fitness) {
    var chartArray = [];

    if (fitness.length > 0) {
        idx = 0;
        
        for (let x of fitness) {
                var obj = new Object();
                rgba = randomColor()['rgba'];
                rgb = randomColor()['rgb'];
                let label = "Solução "+(idx+1).toString();
                obj.label = label,
                obj.data = x,
                obj.fill = true,
                obj.backgroundColor = rgba,
                obj.borderColor = rgb,
                obj.pointBackgroundColor = rgba,
                obj.pointHoverBorderColor = rgba,
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
    if (fitnessSolutions.length > 0) {

        const data = {
            labels: fitnessKeys,
            datasets: dataChart(fitnessSolutions)
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

