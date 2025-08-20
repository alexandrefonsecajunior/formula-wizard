import { useState, useEffect, useMemo } from 'react';
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrendingUp, LogOut, User, ArrowLeft, Calculator } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import FormulaEditor from '@/components/FormulaEditor';
import VariableInputs from '@/components/VariableInputs';
import ResultDisplay from '@/components/ResultDisplay';
import { SaveFormulaDialog } from '@/components/SaveFormulaDialog';
import { SavedFormulas } from '@/components/SavedFormulas';
import { extractVariables, evaluateFormula } from '@/utils/formulaParser';

const CompoundInterestCalculator = () => {
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
          <TrendingUp className="h-12 w-12 animate-pulse text-primary mx-auto" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Fórmula de juros compostos com aporte mensal
  // VF = CI * (1 + i)^n + AM * [((1 + i)^n - 1) / i]
  const [formula, setFormula] = useState('{capital_inicial} * (1 + {taxa_mensal})^{periodo_meses} + {aporte_mensal} * (((1 + {taxa_mensal})^{periodo_meses} - 1) / {taxa_mensal})');
  
  const [variableValues, setVariableValues] = useState<Record<string, number>>({
    capital_inicial: 10000,
    aporte_mensal: 500,
    taxa_mensal: 0.01, // 1% ao mês
    periodo_meses: 12
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

  // Calcular rendimento total e rendimento dos aportes
  const totalInvested = useMemo(() => {
    return variableValues.capital_inicial + (variableValues.aporte_mensal * variableValues.periodo_meses);
  }, [variableValues]);

  const totalReturn = useMemo(() => {
    return result ? result - totalInvested : 0;
  }, [result, totalInvested]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">Voltar</span>
              </Link>
              <div className="p-3 bg-primary/10 rounded-xl">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Juros Compostos
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
            Calcule o crescimento do seu investimento com aportes mensais e juros compostos
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Formula Editor */}
            <div>
              <h2 className="text-xl font-semibold mb-3 text-foreground">
                Fórmula de Juros Compostos
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
                  Parâmetros do Investimento
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

            {/* Investment Summary */}
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-foreground">Resumo do Investimento</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-accent/50 border border-border/50">
                  <div className="text-sm text-muted-foreground">Total Investido</div>
                  <div className="font-semibold text-foreground">
                    R$ {totalInvested.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-accent/50 border border-border/50">
                  <div className="text-sm text-muted-foreground">Rendimento Total</div>
                  <div className="font-semibold text-green-600">
                    R$ {totalReturn.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Result Display */}
            <div>
              <h2 className="text-xl font-semibold mb-3 text-foreground">
                Valor Final do Investimento
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
              <h3 className="text-lg font-medium text-foreground">Fórmulas de Investimento</h3>
              <div className="space-y-2 text-sm">
                {[
                  { 
                    label: 'Juros Compostos com Aporte', 
                    formula: '{capital_inicial} * (1 + {taxa_mensal})^{periodo_meses} + {aporte_mensal} * (((1 + {taxa_mensal})^{periodo_meses} - 1) / {taxa_mensal})'
                  },
                  { 
                    label: 'Juros Compostos Simples', 
                    formula: '{capital} * (1 + {taxa})^{tempo}' 
                  },
                  { 
                    label: 'Valor Presente', 
                    formula: '{valor_futuro} / (1 + {taxa})^{tempo}' 
                  },
                  { 
                    label: 'Taxa Equivalente Mensal', 
                    formula: '(1 + {taxa_anual})^(1/12) - 1' 
                  }
                ].map(({ label, formula: exampleFormula }) => (
                  <button
                    key={label}
                    onClick={() => setFormula(exampleFormula)}
                    className="w-full text-left p-3 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-accent/50 transition-smooth"
                  >
                    <div className="font-medium text-foreground">{label}</div>
                    <div className="text-muted-foreground font-mono text-xs mt-1 truncate">{exampleFormula}</div>
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

export default CompoundInterestCalculator;