import React from 'react';
import { Card } from '@/components/ui/card';
import { AlertTriangle, Calculator, CheckCircle } from 'lucide-react';

interface ResultDisplayProps {
  result: number | null;
  error: string | null;
  isCalculating: boolean;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, error, isCalculating }) => {
  const formatResult = (value: number) => {
    if (isNaN(value) || !isFinite(value)) return 'Resultado inválido';
    
    // Format with appropriate decimal places
    if (value % 1 === 0) return value.toString();
    if (Math.abs(value) >= 1000000) return value.toExponential(2);
    if (Math.abs(value) < 0.001 && value !== 0) return value.toExponential(2);
    
    return value.toFixed(Math.min(6, Math.max(2, (value.toString().split('.')[1] || '').length)));
  };

  return (
    <Card className="p-6 bg-gradient-card border-border/50 shadow-elegant">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Resultado</h3>
        </div>

        <div className="min-h-[80px] flex items-center justify-center">
          {isCalculating ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              Calculando...
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 text-destructive text-center">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-medium">Erro na fórmula</p>
                <p className="text-sm text-muted-foreground mt-1">{error}</p>
              </div>
            </div>
          ) : result !== null ? (
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm text-muted-foreground">Calculado com sucesso</span>
              </div>
              <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                {formatResult(result)}
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <div className="text-2xl mb-2">⚡</div>
              <p>Digite uma fórmula e valores para ver o resultado</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ResultDisplay;