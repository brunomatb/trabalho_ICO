function evaluation(population, horarios, salas) {
  const fitness = [];
  let sameRoomFitness, lotation, roomOverlap, continuidadeSala, tempSchedule;
  for (let solution of population) {

    /*
    três funções objetivo
    minimizar mesmas sala
    Minimizar a lotação da sala
    Miimizar colizao de horarios com a mesma sala
    Minimizar caso não seja atribuida a mesma sala para a mesma disciplina no periudo do horario seguinte 
    */
    sameRoomFitness = 0;
    lotation = 0;
    roomOverlap = 0;
    continuidadeSala = 0
    tempSchedule = [];
    
    for (let k = 0; k < solution.length; k++) {
      const v = solution[k];
      const schedule = horarios[k];
      const sala = salas[v];
      const scheduleDay = schedule['Dia'];
      const horaInicioScheduleDay = convertHour(schedule['Início']);
      const HoraFimScheduleDay = convertHour(schedule['Fim']);
      const roomSchedule = sala['Nome_sala'];
      const unidadeExecução = schedule['Unidade de execução'];
      sameRoomFitness += minimizarMesmaSala(schedule, sala);
      lotation += minimizarLotacao(schedule, sala);


      if (tempSchedule.length > 0) {
        for (let i = 0; i < tempSchedule.length; i++) {
          const horario = tempSchedule[i][1];
          const sala = tempSchedule[i][0];
          const dayTempSchedule = horarios[horario]['Dia'];
          const dayRoomSchedule = salas[sala]['Nome_sala'];
          const horaInicioDayTempSchedule = convertHour(horarios[horario]['Início']);
          const HoraFimDayTempSchedul = convertHour(horarios[horario]['Fim']);
          const dayUnidadeExecução = horarios[horario]['Unidade de execução'];

          continuidadeSala += minimizarMesmaSalaHorarioSeguinte(scheduleDay, dayTempSchedule, unidadeExecução, dayUnidadeExecução, roomSchedule, dayRoomSchedule, HoraFimScheduleDay, horaInicioDayTempSchedule);
          roomOverlap += minimizarColisaoSala(scheduleDay, dayTempSchedule, roomSchedule, dayRoomSchedule, horaInicioScheduleDay, horaInicioDayTempSchedule, HoraFimScheduleDay, HoraFimDayTempSchedul);

        }
      }

      tempSchedule.push([v, k]);
    }

    fitness.push([sameRoomFitness, lotation, roomOverlap, continuidadeSala]);
  }

  return fitness;
}

function minimizarColisaoSala(scheduleDay, dayTempSchedule, roomSchedule, dayRoomSchedule, horaInicioScheduleDay, horaInicioDayTempSchedule, HoraFimScheduleDay, HoraFimDayTempSchedul){
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

function minimizarMesmaSalaHorarioSeguinte(scheduleDay, dayTempSchedule, unidadeExecução, dayUnidadeExecução, roomSchedule, dayRoomSchedule, HoraFimScheduleDay, horaInicioDayTempSchedule){
  if(scheduleDay === dayTempSchedule && unidadeExecução === dayUnidadeExecução && roomSchedule !==dayRoomSchedule && HoraFimScheduleDay === horaInicioDayTempSchedule){
    return 1
  }
  return 0;
}

function minimizarLotacao(schedule, room) {
  const numSubscriberSchedule = parseInt(schedule["Inscritos no turno"]);
  const numSubscriberRoom = parseInt(room["Capacidade_Normal"]);
  
  return numSubscriberRoom < numSubscriberSchedule ? 1 : 0;
}

function minimizarMesmaSala(schedule, room) {
  const requestedRoom = schedule["Características da sala pedida para a aula"];

  if (room[requestedRoom.replaceAll(" ", "_")] === 'X') {
    return 1;
  }

  return 0;
}
