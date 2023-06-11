
function random_population(nv, n, lb, ub) {
  /*nv: O número de variáveis de decisão (ou objetivos, dependendo do contexto).
    n: O número de soluções aleatórias a serem geradas.
    lb: Valor com o limite inferior para as variáveis de decisão.
    ub: Valor com o limite superior para as variáveis de decisão.
    */
  const pop = []
  for (let i = 0; i < n; i++) {
    let chromosome = []
    for (let x = 0; x < nv; x++) {
      chromosome[x] = Math.floor(Math.random() * ((ub - 1) - lb + 1)) + lb;
    }
    pop.push(chromosome);
  }
  return pop;
}

function uniformCrossover(pop, crossover_rate) {
  /* offspring: matriz que armazena as soluções resultantes do crossover
     r1, r2: valores aleatórios no intervalo de 0 ao tamanho da população, pop
  */
  const offspring = [];
  for (let i = 0; i < crossover_rate; i += 2) {
    const r1 = Math.floor(Math.random() * pop.length);
    const r2 = Math.floor(Math.random() * pop.length);
    const offspring1 = [];
    const offspring2 = [];
    /* por cada iteração são gerados dois descendentes */
    let p = pop[r1].length
    for (let j = 0; j < pop[r1].length; j++) {
      if (Math.random() < 0.5) {
        offspring1.push(pop[r1][j]);
        offspring2.push(pop[r2][j]);
      } else {
        offspring1.push(pop[r2][j]);
        offspring2.push(pop[r1][j]);
      }
    }
    offspring.push(offspring1);
    offspring.push(offspring2);
  }
  return offspring;
}

function uniformMutation(pop, mutation_rate, lb, ub) {
  const offspring = [];
  for (let i = 0; i < mutation_rate; i++) {
    const randomIndex = Math.floor(Math.random() * pop.length); // Seleciona um indivíduo aleatório da população
    const individual = pop[randomIndex].slice(); // Copia o indivíduo selecionado
    let t = pop[randomIndex].slice()
    for (let j = 0; j < individual.length; j++) {
      if (Math.random() < mutation_rate) { // Verifica se o gene sofrerá mutação
        individual[j] = Math.floor(Math.random() * (ub - lb + 1)) + lb; // Altera o valor do gene para um novo valor inteiro aleatório dentro do intervalo [lb, ub]
      }
    }
    offspring.push(individual); // Adiciona o indivíduo mutado à matriz offspring
  }
  return offspring;
}
/*
    Função local_search realiza uma busca local em uma população de cromossomos, 
    fazendo pequenas modificações aleatórias nas suas posições. 
    O objetivo é explorar soluções próximas às existentes em busca de melhorias incrementais.
*/
function local_search(pop, rate_local_search, step_size, lb, ub) {
  const offspring = [];
  lb = Array(pop[0].length).fill(lb);
  ub = Array(pop[0].length).fill(ub);
  for (let i = 0; i < rate_local_search; i++) {
    let r1 = Math.floor(Math.random() * pop.length); // gera um numero entre 0 e o tamanho da população
    let chromosome = pop[r1] // é criado um cromossoma com a posição da matriz do valor gerado em r1
    let r2 = Math.floor(Math.random() * pop[0].length); // gera um numero entre 0 e o tamanho do cromossoma
    chromosome[r2] = Math.random() * (2 * step_size) - step_size; // gera um numero entre -step_size e step_size
    if (chromosome[r2] < lb[r2]) { // se a posição do cromossoma do valor gerado de r2 for menor que o valor da posição do cromossoma de lb
      chromosome[r2] = lb[r2]; // a posição do cromossoma do valor gerado de r2 passa a ser a posição do cromossoma de lb de r2
    }
    if (chromosome[r2] > lb[r2]) {// se a posição do cromossoma do valor gerado de r2 for maior que o valor da posição do cromossoma de lb
      chromosome[r2] = ub[r2]; // a posição do cromossoma do valor gerado de r2 passa a ser a posição do cromossoma de ub de r2
    }
    offspring.push(chromosome)
  }
  return offspring;
}


/*
    crowding_calculation calcula a distância de aglomeração para um conjunto de soluções fitness_values, 
    com o objetivo de avaliar a diversidade e o espaçamento entre as soluções. 
*/
function crowding_calculation(fitness_values) {
  const pop_size = fitness_values.length;
  const fitness_value_number = fitness_values[0].length;
  const minValues = fitness_values.reduce((min, row) => row.map((num, i) => Math.min(num, min[i]))); // Calcula os valores mínimos para cada coluna
  const ptpValues = fitness_values.reduce((ptp, row) => row.map((num, i) => Math.max(num, ptp[i]))); // Calcula os valores máximos para cada coluna
  const amplitudeValues = ptpValues.map((max, i) => max - minValues[i]); // Calcula a amplitude de cada coluna (diferença entre o valor máximo e mínimo)
  const normalize_fitness_values = fitness_values.map((row) => row.map((value, i) => (value - minValues[i]) / amplitudeValues[i])); // Normaliza os valores de aptidão dividindo pelo valor de amplitude correspondente
  const matrix_for_crowding = Array.from({ length: pop_size }, () => Array.from({ length: fitness_value_number }, () => 0)); // Cria uma matriz vazia para armazenar as distâncias de aglomeração

  for (let i = 0; i < fitness_value_number; i++) {
    const crowding_results = Array.from({ length: pop_size }, () => 0); // Array para armazenar os resultados de aglomeração
    crowding_results[0] = 1; // Define o resultado de aglomeração para o primeiro indivíduo como 1
    crowding_results[pop_size - 1] = 1; // Define o resultado de aglomeração para o último indivíduo como 1

    const sorting_normalized_values = normalize_fitness_values.map((row) => row[i]).sort((a, b) => a - b); // Obtém os valores de aptidão normalizados para a coluna atual e os ordena em ordem crescente
    const sorting_normalized_values_index = normalize_fitness_values.map((_, index) => index).sort((a, b) => sorting_normalized_values[a] - sorting_normalized_values[b]); // Obtém os índices dos valores normalizados ordenados
    for (let j = 1; j < pop_size - 1; j++) {
      crowding_results[j] = sorting_normalized_values[j + 1] - sorting_normalized_values[j - 1]; // Calcula a distância de aglomeração para cada indivíduo
    }
    const re_sorting = sorting_normalized_values_index.map((_, index) => sorting_normalized_values_index.indexOf(index)); // Obtém a ordem original dos índices normalizados
    for (let j = 0; j < pop_size; j++) {
      matrix_for_crowding[j][i] = crowding_results[re_sorting[j]]; // Armazena os resultados de aglomeração na matriz
    }
  }

  const crowding_distance = matrix_for_crowding.map(row => row.reduce((sum, value) => sum + value, 0)); // Calcula a distância de aglomeração para cada solução
  return crowding_distance;
}
/*
    remove_using_crowding seleciona soluções com base nas distâncias de crowding e,
    remove da população original, retornando os índices das soluções selecionadas.
*/

function remove_using_crowding(fitness_values, number_solutions_needed) {
  const pop_size = fitness_values.length;
  const crowding_distance = crowding_calculation(fitness_values); // Calcula as distâncias de crowding
  const selected_pop_index = [];
  const selected_fitness_values = [];
  for (let i = 0; i < number_solutions_needed; i++) {
    const pop_index = [];
    for (let j = 0; j < pop_size; j++) {
      pop_index.push(j);
    }
    let solution_1 = Math.floor(Math.random() * pop_index.length); // Seleciona aleatoriamente uma solução do array de índices
    let solution_2 = Math.floor(Math.random() * pop_index.length); // Seleciona aleatoriamente outra solução do array de índices
    if (crowding_distance[solution_1] < crowding_distance[solution_2]) {
      [solution_1, solution_2] = [solution_2, solution_1]; // Troca as soluções caso a distância de crowding da solution_1 seja menor que a da solution_2
    }
    selected_pop_index.push(pop_index[solution_1]); // Armazena o índice da solution_1 no array de índices selecionados
    selected_fitness_values.push(fitness_values[solution_1]); // Armazena os valores de aptidão da solution_1 no array de valores selecionados

    pop_index.splice(solution_1, 1); // Remove a solution_1 do array de índices
    fitness_values.splice(solution_1, 1); // Remove os valores de aptidão da solution_1
    crowding_distance.splice(solution_1, 1); // Remove a distância de crowding da solution_1
  }

  return selected_pop_index;
}

/*
   A função pareto_front_finding determina a fronteira de Pareto em um conjunto de soluções. 
   Identifica as soluções não dominadas, ou seja, aquelas que não são superadas em todos os critérios por outras soluções. 
   A função retorna os índices dessas soluções, representando a fronteira de Pareto, que consiste nas soluções ótimas em relação a múltiplos critérios.
*/

function pareto_front_finding(fitness_values, pop_index) {
  let pop_size = fitness_values.length;
  let pareto_front = Array(pop_size).fill(true);

  for (let i = 0; i < pop_size; i++) {
    for (let j = 0; j < pop_size; j++) {
      if (fitness_values[j].every((value, index) => value <= fitness_values[i][index]) &&
        fitness_values[j].some((value, index) => value < fitness_values[i][index])) {
        pareto_front[i] = false;
        break;
      }
    }
  }

  return pop_index.filter((_, i) => pareto_front[i]);
}

function selection(pop, fitness_values, pop_size) {
  let pop_index_0 = Array.from({ length: pop.length }, (_, i) => i);
  let pop_index = Array.from({ length: pop.length }, (_, i) => i);
  let pareto_front_index = [];

  let max_iterations = pop.length; // Número máximo de iterações permitidas
  let iterations = 0;

  while (pareto_front_index.length < pop_size && iterations < max_iterations) {
    let new_pareto_front = pareto_front_finding(fitness_values.slice(pop_index_0), pop_index_0);
    let total_pareto_size = pareto_front_index.length + new_pareto_front.length;

    if (total_pareto_size > pop_size) {
      let number_solutions_needed = pop_size - pareto_front_index.length;
      let selected_solutions = remove_using_crowding(fitness_values.slice(new_pareto_front), number_solutions_needed);
      new_pareto_front = new_pareto_front.filter((_, i) => selected_solutions.includes(i));
    }

    pareto_front_index.push(...new_pareto_front);
    let remaining_index = pop_index.filter((_, index) => !pareto_front_index.includes(index));
    pop_index_0 = remaining_index;

    iterations++;
  }

  pareto_front_index = pareto_front_index.filter((index) => typeof index === 'number');
  let selected_pop = pareto_front_index.map((index) => pop[index]);

  return selected_pop;
}

