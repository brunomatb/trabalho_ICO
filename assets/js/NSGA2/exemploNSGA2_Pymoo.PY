import numpy as np
from pymoo.optimize import minimize
from pymoo.core.problem import Problem
from pymoo.algorithms.moo.nsga2 import NSGA2
from enum import Enum
from pymoo.core.sampling import Sampling
from pymoo.operators.crossover import sbx
from pymoo.operators.mutation import pm
from tqdm import tqdm
from pymoo.visualization.scatter import Scatter
from pymoo.optimize import minimize

import random
class TipoSala(Enum):
    LAB_INFORMATICA = 1
    LAB_JORNALISMO = 2
    SALA_MESTRADO = 3
    
class Sala:
    def __init__(self, nome_sala, capacidade_alunos, tipo_sala:TipoSala):
        self.nome_sala = nome_sala
        self.capacidade_alunos = capacidade_alunos
        self.tipo_sala = tipo_sala


class Horario:
    def __init__(self, turma, inicio_aula, fim_aula, quantidade_alunos, tipo_sala: TipoSala):
        self.turma = turma
        self.inicio_aula = inicio_aula
        self.fim_aula = fim_aula
        self.quantidade_alunos = quantidade_alunos
        self.tipo_sala = tipo_sala
        
class IntegerSampling(Sampling):
    def _do(self, problem, n_samples, **kwargs):
        return np.random.randint(problem.xl, problem.xu + 1, size=(n_samples, problem.n_var))
        
class AtribuirTurmaSalaProblem(Problem):
    def __init__(self, salas, horarios):
        self.salas = salas
        self.horarios = horarios
        super().__init__(n_var=len(horarios),
                         n_obj=3,
                         n_constr=1,
                         xl=0,
                         xu=len(salas) - 1,
                         elementwise_evaluation=True)

    def _evaluate(self, X, out, *args, **kwargs):
        n_solutions = X.shape[0]
        # Função objetivo 1: Minimizar a diferença entre a capacidade da sala e o número de alunos
        diferenca_capacidade = np.zeros(n_solutions)
         # Função objetivo 2: Maximizar o número de salas não utilizadas
        salas_vagas = np.zeros(n_solutions)
        # Função objetivo 3: Minimizar o número de conflitos de horário entre salas
        restricao_sobreposicao_salas = np.zeros(n_solutions)

        for k, x in enumerate(X):
            salas_usadas = set()
            sala_horario_dict = {}
            for i, sala_idx in enumerate(x):
                sala = self.salas[int(sala_idx)]
                horario = self.horarios[i]

                if horario.tipo_sala != sala.tipo_sala:
                    R = max(0, horario.quantidade_alunos)
                    diferenca_capacidade[k] += max(0, horario.quantidade_alunos)

                diferenca_capacidade[k] += max(0, horario.quantidade_alunos - sala.capacidade_alunos)
                salas_usadas.add(sala_idx)

                if sala_idx not in sala_horario_dict:
                    sala_horario_dict[sala_idx] = [i]
                else:
                    for horario_idx in sala_horario_dict[sala_idx]:
                        outro_horario = self.horarios[horario_idx]
                        if (horario.inicio_aula <= outro_horario.inicio_aula < horario.fim_aula or
                            horario.inicio_aula < outro_horario.fim_aula <= horario.fim_aula):
                            restricao_sobreposicao_salas[k] += 1
                            break

                sala_horario_dict[sala_idx].append(i)

            salas_vagas[k] = len(self.salas) - len(salas_usadas)

            # Adiciona uma penalidade caso a Sala não seja utilizada
            for id, s in enumerate(salas):
                if id not in salas_usadas:
                   restricao_sobreposicao_salas[k] += 1

        #out["F"] = np.array([diferenca_capacidade, diferenca_capacidade, diferenca_capacidade]).transpose()
        out["F"] = np.column_stack([diferenca_capacidade, -salas_vagas, restricao_sobreposicao_salas])
        #outra forma de representar transpose
        #out["F"] = np.column_stack([diferenca_capacidade, diferenca_capacidade, diferenca_capacidade])
        out["G"] = np.array([restricao_sobreposicao_salas]).transpose()
        #outra forma de representar transpose
        #out["G"] = restricao_sobreposicao_salas.reshape(-1, 1)


salas = [
    Sala("Sala 1", 30, TipoSala.LAB_INFORMATICA),
    Sala("Sala 2", 20, TipoSala.LAB_JORNALISMO),
    Sala("Sala 3", 40, TipoSala.SALA_MESTRADO),
    Sala("Sala 4", 25, TipoSala.LAB_INFORMATICA),
    Sala("Sala 5", 30, TipoSala.LAB_JORNALISMO),
]

# Criar turmas (horários)
horarios = [
    Horario("Turma A", "08:00", "10:00", 25, TipoSala.LAB_INFORMATICA),
    Horario("Turma B", "10:00", "12:00", 18, TipoSala.LAB_JORNALISMO),
    Horario("Turma C", "14:00", "16:00", 35, TipoSala.SALA_MESTRADO),
    Horario("Turma D", "08:00", "10:00", 22, TipoSala.SALA_MESTRADO),
    Horario("Turma E", "16:00", "18:00", 5, TipoSala.SALA_MESTRADO),
    Horario("Turma F", "16:00", "18:00", 18, TipoSala.LAB_JORNALISMO),
]

problem = AtribuirTurmaSalaProblem(salas, horarios)

algorithm = NSGA2(pop_size=100,
                  sampling=IntegerSampling(),
                  #prob: probabilidade de 90% de que o operador de crossover seja aplicado a este cromossomo em uma determinada iteração.
                  crossover=sbx.SimulatedBinaryCrossover(prob=0.9, eta=15),
                  #eta intensidade da mutação
                  mutation=pm.PolynomialMutation(eta=20),
                  eliminate_duplicates=True)

res = minimize(problem,
               algorithm,
               ("n_gen", 25),
               #iagual a False não apresenta resultados
               verbose=True,
               seed=1)

print("Melhor solucao encontrada:", res.X)
print("Funcoes objetivo na melhor solucao:", res.F)
print(f"solucoes: {len(res.X)}")

for x in res.X:
    
    assigned_rooms = [salas[int(sala_idx)] for sala_idx in x]

    print("Atribuicao detalhada de turmas a salas:")
    for horario, sala in zip(horarios, assigned_rooms):
        print(f"{horario.turma}: {sala.nome_sala},  ({horario.inicio_aula}-{horario.fim_aula})")


plot = Scatter()
plot.add(problem.pareto_front(), plot_type="line", color="black", alpha=0.7)
plot.add(res.F, facecolor="none", edgecolor="red")
plot.show()