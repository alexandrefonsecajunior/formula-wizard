import React, { useState, useEffect, useMemo } from 'react';
import FormulaEditor from '@/components/FormulaEditor';
import VariableInputs from '@/components/VariableInputs';
import ResultDisplay from '@/components/ResultDisplay';
import { extractVariables, evaluateFormula } from '@/utils/formulaParser';

const Index = () => {
  const [formula, setFormula] = useState('{peso} / ({altura} * {altura})');
  const [variableValues, setVariableValues] = useState<Record<string, number>>({
    peso: 70,
    altura: 1.75
  });
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const variables = useMemo(() => extractVariables(formula), [formula]);

  const handleVariableChange = (variable: string, value: number) => {
    setVariableValues(prev => ({
      ...prev,
      [variable]: value
    }));
  };

  useEffect(() => {
    if (!formula.trim()) {
      setResult(null);
      setError(null);
      return;
    }

    setIsCalculating(true);
    const timeoutId = setTimeout(() => {
      try {
        const calculatedResult = evaluateFormula(formula, variableValues);
        setResult(calculatedResult);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        setResult(null);
      } finally {
        setIsCalculating(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [formula, variableValues]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Calculadora de Fórmulas
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Digite uma fórmula matemática usando variáveis entre chaves {'{'}variavel{'}'} e 
            veja o resultado calculado automaticamente
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Formula Editor */}
            <div>
              <h2 className="text-xl font-semibold mb-3 text-foreground">
                Fórmula Matemática
              </h2>
              <FormulaEditor
                value={formula}
                onChange={setFormula}
              />
            </div>

            {/* Variable Inputs */}
            <div>
              <h2 className="text-xl font-semibold mb-3 text-foreground">
                Valores das Variáveis
              </h2>
              <VariableInputs
                variables={variables}
                values={variableValues}
                onChange={handleVariableChange}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Result Display */}
            <div>
              <h2 className="text-xl font-semibold mb-3 text-foreground">
                Resultado do Cálculo
              </h2>
              <ResultDisplay
                result={result}
                error={error}
                isCalculating={isCalculating}
              />
            </div>

            {/* Examples */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-foreground">Exemplos de Fórmulas</h3>
              <div className="space-y-2 text-sm">
                {[
                  { label: 'IMC', formula: '{peso} / ({altura} * {altura})' },
                  { label: 'Área do Retângulo', formula: '{largura} * {altura}' },
                  { label: 'Juros Compostos', formula: '{capital} * (1 + {taxa})^{tempo}' },
                  { label: 'Velocidade Média', formula: '{distancia} / {tempo}' }
                ].map(({ label, formula: exampleFormula }) => (
                  <button
                    key={label}
                    onClick={() => setFormula(exampleFormula)}
                    className="w-full text-left p-3 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-accent/50 transition-smooth"
                  >
                    <div className="font-medium text-foreground">{label}</div>
                    <div className="text-muted-foreground font-mono text-xs mt-1">{exampleFormula}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
