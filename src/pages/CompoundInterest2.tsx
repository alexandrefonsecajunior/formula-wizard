import { useState, useEffect, useMemo } from 'react';
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calculator, ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { extractVariables, evaluateFormula } from '@/utils/formulaParser';
import FormulaEditor from '@/components/FormulaEditor';
import ResultDisplay from '@/components/ResultDisplay';

interface Formula {
  id: string;
  name: string;
  formula: string;
  result: number | null;
  error: string | null;
  isCalculating: boolean;
}

const CompoundInterest2 = () => {
  const { user, loading } = useAuth();

  if (!loading && !user) {
    return <Navigate to="/auth" replace />;
  }

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

  const [formulas, setFormulas] = useState<Formula[]>([
    {
      id: '1',
      name: 'Total Investido',
      formula: '{capital} * {tempo}',
      result: null,
      error: null,
      isCalculating: false
    },
    {
      id: '2',
      name: 'Rendimento Total',
      formula: '{capital} * (1 + {taxa})^{tempo} - {capital}',
      result: null,
      error: null,
      isCalculating: false
    },
    {
      id: '3',
      name: 'Resultado Final',
      formula: '{capital} * (1 + {taxa})^{tempo}',
      result: null,
      error: null,
      isCalculating: false
    }
  ]);

  const [variableValues, setVariableValues] = useState<Record<string, number>>({
    capital: 1000,
    taxa: 0.1,
    tempo: 12
  });

  // Extract all unique variables from all formulas
  const allVariables = useMemo(() => {
    const variables = new Set<string>();
    formulas.forEach(formula => {
      extractVariables(formula.formula).forEach(variable => {
        variables.add(variable);
      });
    });
    return Array.from(variables);
  }, [formulas]);

  const handleVariableChange = (variable: string, value: number) => {
    setVariableValues(prev => ({
      ...prev,
      [variable]: value
    }));
  };

  const handleFormulaChange = (id: string, newFormula: string) => {
    setFormulas(prev => prev.map(formula => 
      formula.id === id ? { ...formula, formula: newFormula } : formula
    ));
  };

  const handleFormulaNameChange = (id: string, newName: string) => {
    setFormulas(prev => prev.map(formula => 
      formula.id === id ? { ...formula, name: newName } : formula
    ));
  };

  const addFormula = () => {
    const newFormula: Formula = {
      id: Date.now().toString(),
      name: `Nova Fórmula ${formulas.length + 1}`,
      formula: '',
      result: null,
      error: null,
      isCalculating: false
    };
    setFormulas(prev => [...prev, newFormula]);
  };

  const removeFormula = (id: string) => {
    if (formulas.length > 1) {
      setFormulas(prev => prev.filter(formula => formula.id !== id));
    }
  };

  // Calculate all formulas when variables or formulas change
  useEffect(() => {
    const calculateFormulas = async () => {
      const updatedFormulas = await Promise.all(
        formulas.map(async (formula) => {
          if (!formula.formula.trim()) {
            return {
              ...formula,
              result: null,
              error: null,
              isCalculating: false
            };
          }

          try {
            // Set calculating state
            setFormulas(prev => prev.map(f => 
              f.id === formula.id ? { ...f, isCalculating: true } : f
            ));

            // Simulate a small delay for better UX
            await new Promise(resolve => setTimeout(resolve, 300));

            const result = evaluateFormula(formula.formula, variableValues);
            return {
              ...formula,
              result,
              error: null,
              isCalculating: false
            };
          } catch (err) {
            return {
              ...formula,
              result: null,
              error: err instanceof Error ? err.message : 'Erro desconhecido',
              isCalculating: false
            };
          }
        })
      );

      setFormulas(updatedFormulas);
    };

    const timeoutId = setTimeout(calculateFormulas, 300);
    return () => clearTimeout(timeoutId);
  }, [variableValues, formulas.map(f => f.formula).join(',')]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
        {/* Header */}
        <header className="text-center mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-accent rounded-xl shadow-glow border border-primary/20">
                <Calculator className="h-8 w-8 text-primary-glow" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Multi-Calculadora
              </h1>
            </div>
            <div></div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Crie múltiplas fórmulas interconectadas e calcule resultados simultâneos
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Formulas Column - Takes 2/3 of space */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-foreground">Fórmulas</h2>
              <Button onClick={addFormula} className="gap-2 bg-gradient-primary hover:opacity-90">
                <Plus className="h-4 w-4" />
                Adicionar Fórmula
              </Button>
            </div>

            <Accordion type="multiple" defaultValue={formulas.map(f => f.id)} className="space-y-4">
              {formulas.map((formula) => (
                <AccordionItem key={formula.id} value={formula.id} className="border-0">
                  <Card className="bg-gradient-card border-primary/20 shadow-elegant">
                    <CardHeader className="pb-3">
                      <AccordionTrigger className="hover:no-underline p-0">
                        <CardTitle className="flex items-center justify-between w-full pr-4">
                          <Input
                            value={formula.name}
                            onChange={(e) => handleFormulaNameChange(formula.id, e.target.value)}
                            className="bg-transparent border-0 text-xl font-semibold p-0 h-auto focus-visible:ring-0"
                            onClick={(e) => e.stopPropagation()}
                          />
                          {formulas.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFormula(formula.id);
                              }}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </CardTitle>
                      </AccordionTrigger>
                    </CardHeader>
                    <AccordionContent>
                      <CardContent className="pt-0 space-y-4">
                        <div>
                          <Label className="text-sm font-medium mb-2 block">Fórmula</Label>
                          <FormulaEditor
                            value={formula.formula}
                            onChange={(value) => handleFormulaChange(formula.id, value)}
                          />
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-primary/10">
                          <Label className="text-sm font-medium text-muted-foreground">Resultado:</Label>
                          <div className="flex items-center gap-2">
                            {formula.isCalculating ? (
                              <div className="animate-pulse text-sm text-muted-foreground">Calculando...</div>
                            ) : formula.error ? (
                              <div className="text-sm text-destructive">Erro</div>
                            ) : formula.result !== null ? (
                              <div className="text-sm font-mono text-primary-glow">
                                {formula.result.toLocaleString('pt-BR', { 
                                  minimumFractionDigits: 2, 
                                  maximumFractionDigits: 2 
                                })}
                              </div>
                            ) : (
                              <div className="text-sm text-muted-foreground">--</div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </AccordionContent>
                  </Card>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Variables Column */}
          <div className="space-y-6">
            <Card className="bg-gradient-card border-primary/20 shadow-elegant">
              <CardHeader>
                <CardTitle className="text-xl">Variáveis Compartilhadas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {allVariables.map((variable) => (
                  <div key={variable} className="space-y-2">
                    <Label className="text-sm font-medium capitalize">
                      {variable}
                    </Label>
                    <Input
                      type="number"
                      step="any"
                      value={variableValues[variable] || 0}
                      onChange={(e) => handleVariableChange(variable, parseFloat(e.target.value) || 0)}
                      className="bg-background/50 border-primary/20 focus:border-primary/50"
                    />
                  </div>
                ))}
                {allVariables.length === 0 && (
                  <p className="text-muted-foreground text-sm">
                    Adicione fórmulas para ver as variáveis disponíveis
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Summary */}
            <Card className="bg-gradient-accent border-primary/20 shadow-glow">
              <CardHeader>
                <CardTitle className="text-xl text-accent-foreground">Resumo dos Resultados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {formulas.map((formula) => (
                  <div key={formula.id} className="flex justify-between items-center p-3 bg-background/20 rounded-lg">
                    <span className="font-medium text-accent-foreground">{formula.name}</span>
                    <span className="font-mono text-primary-glow">
                      {formula.result !== null ? 
                        formula.result.toLocaleString('pt-BR', { 
                          minimumFractionDigits: 2, 
                          maximumFractionDigits: 2 
                        }) : 
                        '--'
                      }
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompoundInterest2;