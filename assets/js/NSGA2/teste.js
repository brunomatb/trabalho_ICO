function random_population(nv, n, lb, ub) {
    /*nv: O número de variáveis de decisão (ou objetivos, dependendo do contexto).
      n: O número de soluções aleatórias a serem geradas.
      lb: arry com o limite inferior para as variáveis de decisão.
      */
    const pop = []
    for (let i = 0; i < n; i++) {
        let chromosome = []
        for (let x = 0; x < nv; x++) {
            chromosome[x] = Math.floor(Math.random() * (ub[0] - lb[0] + 1)) + lb[0]; 
        }
        pop.push(chromosome);
    }
    return pop;
}

function uniformCrossover(pop, crossover_rate) {
    /* offspring: matriz que armazena as soluções resultantes do crossover
       r1, r2: valores aleatórios no intervalo de 0 ao tamanho da população, pop
       cutting_point:Ponto de corte (cutting point) para a operação de crossover (cruzamento)
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
                individual[j] = Math.floor(Math.random() * (ub[0] - lb[0] + 1)) + lb[0]; // Altera o valor do gene para um novo valor inteiro aleatório dentro do intervalo [lb, ub]
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
    const offspring = []; // Define um array com o nome offspring
    for( let i = 0 ; i < rate_local_search ; i++){ 
        let r1 = Math.floor(Math.random() * pop.length); // gera um numero entre 0 e o tamanho da população
        let chromosome = pop[r1] // é criado um cromossoma com a posição da matriz do valor gerado em r1
        let r2 = Math.floor(Math.random() * pop[0].length); // gera um numero entre 0 e o tamanho do cromossoma
        chromosome[r2] = Math.random() * (2 * step_size) - step_size; // gera um numero entre -step_size e step_size
        if(chromosome[r2] < lb[r2]){ // se a posição do cromossoma do valor gerado de r2 for menor que o valor da posição do cromossoma de lb
           chromosome[r2]  = lb[r2]; // a posição do cromossoma do valor gerado de r2 passa a ser a posição do cromossoma de lb de r2
        }
        if(chromosome[r2] > lb[r2]){// se a posição do cromossoma do valor gerado de r2 for maior que o valor da posição do cromossoma de lb
            chromosome[r2]  = ub[r2]; // a posição do cromossoma do valor gerado de r2 passa a ser a posição do cromossoma de ub de r2
        }
        offspring.push(chromosome)
    }
    return offspring;
}

/*
   A função pareto_front_finding determina a fronteira de Pareto em um conjunto de soluções. 
   Identifica as soluções não dominadas, ou seja, aquelas que não são superadas em todos os critérios por outras soluções. 
   A função retorna os índices dessas soluções, representando a fronteira de Pareto, que consiste nas soluções ótimas em relação a múltiplos critérios.
*/

function crowding_calculation(fitness_values){
}

function pareto_front_finding(fitness_values, pop_index){
    pareto_front = []

        fitness_values.forEach( (_, i) =>{ 
            fitness_values.forEach( (_,j) => {
                let isDominated = true; // indica se a solução i é dominada por alguma outra solução j
                let isStrictlyDominated = false; // indica se a solução i é estritamente dominada por alguma outra solução j
                for( let k = 0 ; k < fitness_values[i].length ; k++){
                    if(fitness_values[j][k] < fitness_values[i][k]){ // Verifica se todos os valores da solução j domina a solução i em um determinado critério
                        isDominated = false; // Solução i não é dominada por j
                        break; // Não é necessário continuar a comparação, pois já foi encontrada uma solução que domina i
                    }
                    if (fitness_values[j][k] < fitness_values[i][k]) { // Verifica se a solução j estritamente domina a solução i em um determinado critério
                        isStrictlyDominated = true; // Solução i é estritamente dominada por j em pelo menos um critério
                    }
                    if (isDominated && isStrictlyDominated) {
                        pareto_front[i] = false; // i nao esta na fronteira de pareto porque j domina i 
                        break;  // Não é necessário continuar a comparação, pois já foi determinado que i é dominada por j
                    }else{
                        pareto_front[i] = true; // i está na fronteira de Pareto até o momento
                    }
                }
            });
        });
        
    
    const pareto_front_indices = [];
    pop_index.forEach( i => {
        if (pareto_front[i]) {
            pareto_front_indices.push(pop_index[i]);
        }
    });
    return pareto_front_indices
}


/*
    função de seleção (selection) é responsável por selecionar os indivíduos da população que irão sobreviver para a próxima geração do algoritmo NSGA-II. 
    Essa seleção é feita com base nas informações de dominância e de densidade de cada indivíduo.
*/
function selection(pop, fitness_values, pop_size){


}

function evaluation(pop) {

}


rate_local_search = 10
step_size = 0.1
nv = 6
n = 10
lb = new Array(6).fill(0);
ub = new Array(6).fill(4);
obj = 3
crossover_rate = 5
const pop = random_population(nv, n, lb, ub)
const crossovers = uniformCrossover(pop, crossover_rate)
mutation_rate = 4
const mutation = uniformMutation(pop, mutation_rate, lb, ub)
console.log(pop)
const l_search = local_search(pop, rate_local_search, step_size, lb, ub)

let fitness_values = [[-9.80469396,  9.14358074],
                      [-9.80469396,  2.14358074],
                      [-12.1229262 ,  14.56833384],
                      [-1.53002779,   6.88685739],
                      [-1.1949859,   4.2733491],
                      [-11.80066201,  -2.19312128],
                      [-9.737375  , 2.40795124],
                      [-6.99377616,  6.32495479],
                      [-8.34878293,  2.18735053],
                      [-6.25072937,  4.79623136],
                      [-1.55027076,   1.78359739]]
let pop_index = [0,1,2,3,4,5,6,7,8,9]
pareto = pareto_front_finding(fitness_values, pop_index)
console.log(pareto)
