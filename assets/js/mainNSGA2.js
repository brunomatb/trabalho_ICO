document.addEventListener('DOMContentLoaded', function () {
    visualizationIndividualParetoSolution();

});
function visualizationIndividualParetoSolution(){
    const select = document.querySelector("#select_Solucao");
    if (select) {
        select.addEventListener('change', () => {
            if (select.id === 'select_Solucao') {
                solutionDownload = paretoSolutionsTimeTables[select.value];
                filterData = setFilterCurso(solutionDownload, 'Curso', 'ME');
                getCalander(filterData[0], filterData[1], "");
            }
        });

    }
}



function convertSolutionsToTimeTables(selected_pop, timeTables, timeTablesSalas) {
    let solutions = []
    let solution = []
    let horario = ""
    let count = 0;

    horarios = orderJsonBasedOnKey(timeTables)
    salas = orderJsonBasedOnKey(timeTablesSalas)
    console.log(salas);
    for (let pop of selected_pop) {
        solution = []
        count = 0;
        for (let i of pop) {
            horario = horarios[count];
            sala = salas[i];
            horario['Sala da aula'] = sala['Nome_sala'];
            horario['Lotação'] = sala['Capacidade_Normal']
            solution.push(JSON.parse(JSON.stringify(horario)));
            count++;
        }
        solutions.push(solution);
    }
    return solutions;
}


function appendParetoSolutions(paretoSolutionsTimeTables) {
    let select = document.querySelector("#select_Solucao");
    select.innerHTML = "";
    select.innerHTML = '<option>Escolher solução gerada</option>'
    if (paretoSolutionsTimeTables === "") {
        return false;
    }
    select.va
    let count = 0;
    for (let x of paretoSolutionsTimeTables) {
        let newOption = document.createElement('option');
        newOption.value = count;
        let appendText = "solução " + count
        newOption.textContent = appendText;
        select.appendChild(newOption);
        count++;
    }

}

function orderJsonBasedOnKey(json){

    json = json.sort((a, b) => {
        if (parseInt(a['id']) < parseInt(b['id'])) {
          return -1;
        }
      });
      return json;
}
//função para receber um JSON e criar um indice.
function generateIndices(jsonObject) {
    for (let chave in jsonObject) {
        jsonObject[chave]['id'] = chave;
    }
    return jsonObject;
}
//Cria um cromossoma do import das salas e horario.
function injectData(horariosJson, salasJson) {
    let pop = [];
    let pop2 = [];

    for (let i = 0; i < horariosJson.length; i++) {
        let boolSalaAtribuida = false;
        const salaHorario = horariosJson[i]['Sala da aula'];
        for (let j = 0; j < salasJson.length; j++) {
            const sala = salasJson[j]['Nome_sala'];
            if (salaHorario === sala) {
                boolSalaAtribuida = true;
                pop.push(j);
            }else{
                pop2.push(j);
            }
        }
       
    }
    return [[pop],[pop2]];
}



function evaluation(population, horarios, salas, configAlgoritmo) {
    /*parametro configAlgoritmo constituido por um array de boleanos valores: 
    [inject_population_csv, minimizar_mesma_sala, continuidade_sala, caracteristicas_sala_pedida, minimizar_lotacao_sala] */

    const fitness = [];
    let sameRoomFitness, lotation, roomOverlap, continuidadeSala, tempSchedule;
    let tempScheduleObj = new Object();
    for (let solution of population) {

        /*
        quartro funções objetivo
        minimizar mesmas sala
        Minimizar a lotação da sala
        Minimizar colizao de horarios com a mesma sala
        Minimizar caso não seja atribuida a mesma sala para a mesma disciplina no periudo do horario seguinte 
        */
        sameRoomFitness = 0;
        lotation = 0;
        roomOverlap = 0;
        continuidadeSala = 0
        tempScheduleObj = new Object();
        for (let k = 0; k < solution.length; k++) {

            const v = solution[k];
            const schedule = horarios[k];
            const sala = salas[v];
            const scheduleDay = schedule['Dia'];
            const horaInicioScheduleDay = convertHour(schedule['Início']);
            const HoraFimScheduleDay = convertHour(schedule['Fim']);
            const roomSchedule = sala['Nome_sala'];
            const unidadeExecução = schedule['Unidade de execução'];
            if (configAlgoritmo[3]) {
                sameRoomFitness += minimizarSalaPedida(schedule, sala);
            }
            if (configAlgoritmo[4]) {
                lotation += minimizarLotacao(schedule, sala);
            }
            if (configAlgoritmo[1] || configAlgoritmo[2]) {
                if (Object.keys(tempScheduleObj).length > 0) {
                    let t = tempScheduleObj[scheduleDay];
                    if (tempScheduleObj[scheduleDay]) {
                        for (let i = 0; i < tempScheduleObj[scheduleDay].length; i++) {
                            const horario = tempScheduleObj[scheduleDay][i][1];
                            const sala = tempScheduleObj[scheduleDay][i][0];
                            const dayTempSchedule = horarios[horario]['Dia'];
                            const dayRoomSchedule = salas[sala]['Nome_sala'];
                            const horaInicioDayTempSchedule = convertHour(horarios[horario]['Início']);
                            const HoraFimDayTempSchedul = convertHour(horarios[horario]['Fim']);
                            const dayUnidadeExecução = horarios[horario]['Unidade de execução'];
                            if (configAlgoritmo[2]) {
                                continuidadeSala += minimizarMesmaSalaHorarioSeguinte(scheduleDay, dayTempSchedule, unidadeExecução, dayUnidadeExecução, roomSchedule, dayRoomSchedule, HoraFimScheduleDay, horaInicioDayTempSchedule);
                            }
                            if (configAlgoritmo[1]) {
                                roomOverlap += minimizarColisaoSala(scheduleDay, dayTempSchedule, roomSchedule, dayRoomSchedule, horaInicioScheduleDay, horaInicioDayTempSchedule, HoraFimScheduleDay, HoraFimDayTempSchedul);
                            }

                        }
                    }
                }

                if (Object.keys(tempScheduleObj).length > 0) {
                    if (tempScheduleObj[scheduleDay]) {
                        tempScheduleObj[scheduleDay].push([v, k]);
                    } else {
                        tempScheduleObj[scheduleDay] = [];
                        tempScheduleObj[scheduleDay].push([v, k]);
                    }

                } else {
                    tempScheduleObj[scheduleDay] = [];
                    tempScheduleObj[scheduleDay].push([v, k]);
                }
            }
        }
        objetives = []
        for (i in configAlgoritmo){
            if(configAlgoritmo[i] === true){
                    switch (i){
                        case '1':
                            objetives.push(roomOverlap);
                            break;
                        case '2':
                            objetives.push(continuidadeSala);
                            break; 
                        case '3':
                            objetives.push(sameRoomFitness);
                            break;  
                        case '4':
                            objetives.push(lotation);
                            break;
                    }
                    
            }
        }
        fitness.push(objetives)
    }
    return fitness;
}

function minimizarColisaoSala(scheduleDay, dayTempSchedule, roomSchedule, dayRoomSchedule, horaInicioScheduleDay, horaInicioDayTempSchedule, HoraFimScheduleDay, HoraFimDayTempSchedul) {
    // Minimizar colizao de horarios com a mesma sala
    if (scheduleDay === dayTempSchedule && roomSchedule === dayRoomSchedule) {
        if ((horaInicioScheduleDay <= horaInicioDayTempSchedule &&
            horaInicioDayTempSchedule < HoraFimScheduleDay) ||
            (horaInicioScheduleDay < HoraFimDayTempSchedul &&
                HoraFimDayTempSchedul <= HoraFimScheduleDay)) {
            return 1;
        }
    }
    return 0;
}

function minimizarMesmaSalaHorarioSeguinte(scheduleDay, dayTempSchedule, unidadeExecução, dayUnidadeExecução, roomSchedule, dayRoomSchedule, HoraFimScheduleDay, horaInicioDayTempSchedule) {
    if (scheduleDay === dayTempSchedule && unidadeExecução === dayUnidadeExecução && roomSchedule !== dayRoomSchedule && HoraFimScheduleDay === horaInicioDayTempSchedule) {
        return 1
    }
    return 0;
}

function minimizarLotacao(schedule, room) {
    const numSubscriberSchedule = parseInt(schedule["Inscritos no turno"]);
    const numSubscriberRoom = parseInt(room["Capacidade_Normal"]);

    return numSubscriberRoom < numSubscriberSchedule ? 1 : 0;
}

function minimizarSalaPedida(schedule, room) {
    const requestedRoom = schedule["Características da sala pedida para a aula"];

    if (room[requestedRoom.replaceAll(" ", "_")] === 'X') {
        return 1;
    }

    return 0;
}

/* 
    parametro configAlgoritmo constituido por um array de boleanos valores: [inject_population_csv, minimizar_mesma_sala, continuidade_sala, caracteristicas_sala_pedida,minimizar_lotacao_sala]
    parametro configAnvancadasAlgoritmo constituido por um array de [population_size, number_of_iterations, rate_crossover, rate_mutation, rate_local_search, step_size]

*/
function NSGA2(horarios, salas, configAlgoritmo, configAnvancadasAlgoritmo) {

    // configurações do algoritmo
    lowerBound = 0;
    upperBound = salas.length - 1;
    let pop_size = 100;
    let rate_crossover = 20;
    let rate_mutation = 20;
    let rate_local_search = 10;
    let step_size = 0.1;
    let iterations = 25;

    parseInt(configAnvancadasAlgoritmo[0]) !== 0 && configAnvancadasAlgoritmo[0] !== "" ? pop_size = parseInt(configAnvancadasAlgoritmo[0]) : pop_size
    parseInt(configAnvancadasAlgoritmo[1]) !== 0 && configAnvancadasAlgoritmo[1] !== "" ? iterations = parseInt(configAnvancadasAlgoritmo[1]) : iterations
    parseInt(configAnvancadasAlgoritmo[2]) !== 0 && configAnvancadasAlgoritmo[2] !== "" ? rate_crossover = parseInt(configAnvancadasAlgoritmo[2]) : rate_crossover
    parseInt(configAnvancadasAlgoritmo[3]) !== 0 && configAnvancadasAlgoritmo[3] !== "" ? rate_mutation = parseInt(configAnvancadasAlgoritmo[3]) : rate_mutation
    parseInt(configAnvancadasAlgoritmo[4]) !== 0 && configAnvancadasAlgoritmo[4] !== "" ? rate_local_search = parseInt(configAnvancadasAlgoritmo[4]) : rate_local_search
    parseInt(configAnvancadasAlgoritmo[5]) !== 0 && configAnvancadasAlgoritmo[5] !== "" ? step_size = parseInt(configAnvancadasAlgoritmo[5]) : step_size

    // Geração de índices para as variáveis de decisão
    horarios = generateIndices(horarios);
    salas = generateIndices(salas);
    horarios = orderJsonBasedOnKey(horarios);
    salas = orderJsonBasedOnKey(salas);
    if (configAlgoritmo[0]) {
        population = injectData(horarios, salas)[0];
        lastPopulation = injectData(horarios, salas)[1];
    } else {
        const numberOfVariables = horarios.length
        population = random_population(numberOfVariables, pop_size, lowerBound, upperBound);
    }
    //const rate_crossover = Math.floor((crossoverPercentage / 100) * (population.length / 2));
    for (let i = 0; i < iterations; i++) {
        let offspring_from_crossover = uniformCrossover(population, rate_crossover);
        let offspring_from_mutation = uniformMutation(population, rate_mutation, lowerBound, upperBound);
        let offspring_from_local_search = local_search(population, rate_local_search, step_size, lowerBound, upperBound);
        // Adição dos descendentes à população atual
        population = population.concat(offspring_from_crossover);
        population = population.concat(offspring_from_mutation);
        population = population.concat(offspring_from_local_search);

        // Avaliação da aptidão da população
        let fitness_values = evaluation(population, horarios, salas, configAlgoritmo);
        // Seleção dos indivíduos para a próxima geraçãoa
        population = selection(population, fitness_values, pop_size);

    }
    // Avaliação da aptidão da população final
    let fitness_values = evaluation(population, horarios, salas, configAlgoritmo);
    // Encontrar o índice dos indivíduos no conjunto de Pareto
    let index = Array.from({ length: population.length }, (_, i) => i);
    let pareto_front_index = pareto_front_finding(fitness_values, index);
    // Selecionar os indivíduos do conjunto de Pareto
    let selected_pop = [];
    for (let i = 0; i < pareto_front_index.length; i++) {
        selected_pop.push(population[pareto_front_index[i]]);
    }
    console.log("Soluções optimas:");
    console.log(selected_pop);
    /*
        results = new Object();
        let count = 0
        for(let pop of selected_pop){
        results[('horario_'+count).toString()] = pop;
        count++
        }
    */
    let selected_fitness_values = [];
    for (let i = 0; i < pareto_front_index.length; i++) {
        selected_fitness_values.push(fitness_values[pareto_front_index[i]]);

    }
    console.log("Valores de Fitness:");
    console.log(selected_fitness_values);
    
    return [selected_pop, selected_fitness_values];
}



function gerarHorarioAlgoritmo() {
    const inject_population_csv = document.querySelector('#inject_population_csv').checked;
    const minimizar_mesma_sala = document.querySelector('#minimizar_colisao_sala').checked;
    const continuidade_sala = document.querySelector('#continuidade_sala').checked;
    const caracteristicas_sala_pedida = document.querySelector('#caracteristicas_sala_pedida').checked;
    const minimizar_lotacao_sala = document.querySelector('#minimizar_lotacao_sala').checked;
    const config = [minimizar_mesma_sala, continuidade_sala, caracteristicas_sala_pedida, minimizar_lotacao_sala];
    fitnessKeys = [];
    for(let i in config){
        if(config[i] === true){
            switch (i){
                case '0':
                    fitnessKeys.push('Minimizar colisão sala');
                    break;
                case '1':
                    fitnessKeys.push('Minimizar continuidade sala');
                    break; 
                case '2':
                    fitnessKeys.push('Minimizar caractetistica sala pedida');
                    break;  
                case '3':
                    fitnessKeys.push('Minimizar lotação');
                    break;
            }
            
        }
    }
    // inputs das configurações avançadas //
    const population_size = document.querySelector('#population_size').value;
    const number_of_iterations = document.querySelector('#number_of_iterations').value;
    const rate_crossover = document.querySelector('#rate_crossover').value;
    const rate_mutation = document.querySelector('#rate_mutation').value;
    const rate_local_search = document.querySelector('#rate_local_search').value;
    const step_size = document.querySelector('#step_size').value;


    const configAlgoritmo = [inject_population_csv, minimizar_mesma_sala, continuidade_sala, caracteristicas_sala_pedida, minimizar_lotacao_sala]
    const configAnvancadasAlgoritmo = [population_size, number_of_iterations, rate_crossover, rate_mutation, rate_local_search, step_size]
    console.log("Inicio: "+ getHourNow());
    results =  NSGA2(timeTables, timeTablesSalas, configAlgoritmo, configAnvancadasAlgoritmo);
    console.log('solutions pareto');
    console.log(console.log(results[0]));
    console.log("Fim: "+getHourNow());
    paretoSolutionsTimeTables = convertSolutionsToTimeTables(results[0], timeTables, timeTablesSalas)
    fitnessSolutions = results[1];
    appendParetoSolutions(paretoSolutionsTimeTables);
    return [horarios, fitnessSolutions];

}
