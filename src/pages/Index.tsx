import { useState, useEffect, useMemo } from 'react';
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calculator, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import FormulaEditor from '@/components/FormulaEditor';
import VariableInputs from '@/components/VariableInputs';
import ResultDisplay from '@/components/ResultDisplay';
import { SaveFormulaDialog } from '@/components/SaveFormulaDialog';
import { SavedFormulas } from '@/components/SavedFormulas';
import { extractVariables, evaluateFormula } from '@/utils/formulaParser';

const Index = () => {
  const { user, signOut, loading } = useAuth();

  // Redirect to auth if not logged in
  if (!loading && !user) {
    return <Navigate to="/auth" replace />;
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Calculator className="h-12 w-12 animate-pulse text-primary mx-auto" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }
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

  const handleLoadFormula = (loadedFormula: string, loadedValues: Record<string, number>) => {
    setFormula(loadedFormula);
    setVariableValues(loadedValues);
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
        <header className="text-center mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Calculator className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Formula Creator
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{user?.email}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={signOut}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Crie, calcule e compartilhe fórmulas matemáticas personalizadas com variáveis dinâmicas
          </p>
        </header>

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
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold text-foreground">
                  Valores das Variáveis
                </h2>
                <SaveFormulaDialog 
                  formula={formula}
                  variableValues={variableValues}
                />
              </div>
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

            {/* Saved Formulas */}
            <SavedFormulas onLoadFormula={handleLoadFormula} />

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
