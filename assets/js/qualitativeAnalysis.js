document.addEventListener('DOMContentLoaded', function () {
    setOvercrowedRooms();
});

function setOvercrowedRooms() {
   
    let select = document.querySelector('#testeDados');
    if (select) {
      
        select.addEventListener('click', () => {
            debugger
            let overcrowedRooms = 0
            for (let x of timeTables) {
                let capacity = x['Lotação']
                nrStudents = x['Inscritos no turno']

                if (nrStudents > capacity) {
                    overcrowedRooms = overcrowedRooms + 1
                }
            }
            return overcrowedRooms;
        }

        )
    };


}