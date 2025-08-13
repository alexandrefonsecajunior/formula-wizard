export const extractVariables = (formula: string): string[] => {
  const variableRegex = /\{([^}]+)\}/g;
  const variables = new Set<string>();
  let match;
  
  while ((match = variableRegex.exec(formula)) !== null) {
    variables.add(match[1].trim());
  }
  
  return Array.from(variables);
};

export const evaluateFormula = (formula: string, variables: Record<string, number>): number => {
  if (!formula.trim()) {
    throw new Error('Fórmula vazia');
  }

  // Replace variables with their values
  let processedFormula = formula;
  
  // First, replace all variables
  for (const [variable, value] of Object.entries(variables)) {
    if (isNaN(value)) {
      throw new Error(`Valor inválido para variável "${variable}"`);
    }
    
    const regex = new RegExp(`\\{${variable}\\}`, 'g');
    processedFormula = processedFormula.replace(regex, value.toString());
  }
  
  // Check if there are any remaining variables
  const remainingVariables = extractVariables(processedFormula);
  if (remainingVariables.length > 0) {
    throw new Error(`Variáveis sem valor: ${remainingVariables.join(', ')}`);
  }
  
  // Sanitize the formula for security
  const sanitizedFormula = processedFormula.replace(/[^0-9+\-*/().\s]/g, '');
  
  if (sanitizedFormula !== processedFormula) {
    throw new Error('Fórmula contém caracteres inválidos');
  }
  
  // Check for valid mathematical expression
  if (!/^[\d+\-*/().\s]+$/.test(sanitizedFormula)) {
    throw new Error('Expressão matemática inválida');
  }
  
  try {
    // Use Function constructor for safe evaluation
    const result = new Function('return ' + sanitizedFormula)();
    
    if (typeof result !== 'number') {
      throw new Error('Resultado não é um número válido');
    }
    
    if (!isFinite(result)) {
      throw new Error('Resultado é infinito ou não é um número');
    }
    
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Erro de cálculo: ${error.message}`);
    }
    throw new Error('Erro desconhecido no cálculo');
  }
};