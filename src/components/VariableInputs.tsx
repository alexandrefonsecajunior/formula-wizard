import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface VariableInputsProps {
  variables: string[];
  values: Record<string, number>;
  onChange: (variable: string, value: number) => void;
}

const VariableInputs: React.FC<VariableInputsProps> = ({ variables, values, onChange }) => {
  if (variables.length === 0) {
    return (
      <Card className="p-6 bg-gradient-card border-border/50">
        <div className="text-center text-muted-foreground">
          <div className="text-2xl mb-2">📝</div>
          <p>Nenhuma variável detectada</p>
          <p className="text-sm mt-1">
            Use o formato {'{'}variavel{'}'} na fórmula para criar campos automaticamente
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-card border-border/50 shadow-elegant">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-gradient-primary rounded-full"></div>
          <h3 className="text-lg font-semibold text-foreground">
            Variáveis da Fórmula
          </h3>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {variables.map((variable) => (
            <div key={variable} className="space-y-2">
              <Label 
                htmlFor={`var-${variable}`}
                className="text-sm font-medium text-formula-variable capitalize"
              >
                {variable}
              </Label>
              <Input
                id={`var-${variable}`}
                type="number"
                step="any"
                value={values[variable] || ''}
                onChange={(e) => onChange(variable, parseFloat(e.target.value) || 0)}
                placeholder={`Digite ${variable}...`}
                className="bg-background/80 border-border/50 focus:border-primary transition-smooth"
              />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default VariableInputs;