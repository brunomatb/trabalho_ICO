function IntegerSBXCrossover(crossoverProbability, distributionIndex, randomGenerator) {
    if (crossoverProbability < 0) {
      throw new Error("Crossover probability is negative: " + crossoverProbability);
    } else if (distributionIndex < 0) {
      throw new Error("Distribution index is negative: " + distributionIndex);
    }
  
    function getCrossoverProbability() {
      return crossoverProbability;
    }
  
    function getDistributionIndex() {
      return distributionIndex;
    }
  
    function setDistributionIndex(newDistributionIndex) {
      distributionIndex = newDistributionIndex;
    }
  
    function setCrossoverProbability(newCrossoverProbability) {
      crossoverProbability = newCrossoverProbability;
    }
  
    function execute(solutions) {
      if (!solutions) {
        throw new Error("Null parameter");
      } else if (solutions.length !== 2) {
        throw new Error("There must be two parents instead of " + solutions.length);
      }
  
      return doCrossover(crossoverProbability, solutions[0], solutions[1]);
    }
  
    function doCrossover(probability, parent1, parent2) {
      const offspring = [parent1.copy(), parent2.copy()];
  
      let i;
      let rand;
      let y1, y2, yL, yu;
      let c1, c2;
      let alpha, beta, betaq;
      let valueX1, valueX2;
  
      if (randomGenerator.getRandomValue() <= probability) {
        for (i = 0; i < parent1.variables().length; i++) {
          valueX1 = parent1.variables()[i];
          valueX2 = parent2.variables()[i];
          if (randomGenerator.getRandomValue() <= 0.5) {
            if (Math.abs(valueX1 - valueX2) > EPS) {
              if (valueX1 < valueX2) {
                y1 = valueX1;
                y2 = valueX2;
              } else {
                y1 = valueX2;
                y2 = valueX1;
              }
  
              const bounds = parent1.getBounds(i);
              yL = bounds.getLowerBound();
              yu = bounds.getUpperBound();
              rand = randomGenerator.getRandomValue();
              beta = 1.0 + (2.0 * (y1 - yL) / (y2 - y1));
              alpha = 2.0 - Math.pow(beta, -(distributionIndex + 1.0));
  
              if (rand <= 1.0 / alpha) {
                betaq = Math.pow(rand * alpha, 1.0 / (distributionIndex + 1.0));
              } else {
                betaq = Math.pow(1.0 / (2.0 - rand * alpha), 1.0 / (distributionIndex + 1.0));
              }
  
              c1 = 0.5 * ((y1 + y2) - betaq * (y2 - y1));
              beta = 1.0 + (2.0 * (yu - y2) / (y2 - y1));
              alpha = 2.0 - Math.pow(beta, -(distributionIndex + 1.0));
  
              if (rand <= 1.0 / alpha) {
                betaq = Math.pow(rand * alpha, 1.0 / (distributionIndex + 1.0));
              } else {
                betaq = Math.pow(1.0 / (2.0 - rand * alpha), 1.0 / (distributionIndex + 1.0));
              }
  
              c2 = 0.5 * (y1 + y2 + betaq * (y2 - y1));
  
              if (c1 < yL) {
                c1 = yL;
              }
  
              if (c2 < yL) {
                c2 = yL;
              }
  
              if (c1 > yu) {
                c1 = yu;
              }
  
              if (c2 > yu) {
                c2 = yu;
              }
  
              if (randomGenerator.getRandomValue() <= 0.5) {
                offspring[0].variables()[i] = Math.floor(c2);
                offspring[1].variables()[i] = Math.floor(c1);
              } else {
                offspring[0].variables()[i] = Math.floor(c1);
                offspring[1].variables()[i] = Math.floor(c2);
              }
            } else {
              offspring[0].variables()[i] = valueX1;
              offspring[1].variables()[i] = valueX2;
            }
          } else {
            offspring[0].variables()[i] = valueX2;
            offspring[1].variables()[i] = valueX1;
          }
        }
      }
  
      return offspring;
    }
  
    function getNumberOfRequiredParents() {
      return 2;
    }
  
    function getNumberOfGeneratedChildren() {
      return 2;
    }
  
    // EPS defines the minimum difference allowed between real values
    const EPS = 1.0e-14;
  
    if (!randomGenerator) {
      randomGenerator = () => Math.random();
    }
  
    return {
      getCrossoverProbability,
      getDistributionIndex,
      setDistributionIndex,
      setCrossoverProbability,
      execute,
      getNumberOfRequiredParents,
      getNumberOfGeneratedChildren
    };
  }
  
  module.exports = IntegerSBXCrossover;
  