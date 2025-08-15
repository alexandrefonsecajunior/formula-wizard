import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { BookOpen, Trash2, Calendar } from 'lucide-react';
import { useFormulas, Formula } from '@/hooks/useFormulas';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SavedFormulasProps {
  onLoadFormula: (formula: string, values: Record<string, number>) => void;
}

export const SavedFormulas = ({ onLoadFormula }: SavedFormulasProps) => {
  const { formulas, loading, deleteFormula } = useFormulas();
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteFormula(id);
      toast({
        title: "Fórmula excluída",
        description: "A fórmula foi removida com sucesso."
      });
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir a fórmula.",
        variant: "destructive"
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleLoadFormula = (formula: Formula) => {
    onLoadFormula(formula.formula, formula.values || {});
    toast({
      title: "Fórmula carregada",
      description: `"${formula.name}" foi carregada com sucesso.`
    });
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-foreground">Fórmulas Salvas</h3>
        <div className="grid gap-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (formulas.length === 0) {
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-foreground">Fórmulas Salvas</h3>
        <Card>
          <CardContent className="p-6 text-center">
            <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Nenhuma fórmula salva ainda.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Salve suas fórmulas para reutilizá-las depois.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium text-foreground">Fórmulas Salvas</h3>
      <div className="grid gap-3 max-h-96 overflow-y-auto">
        {formulas.map((formula) => (
          <Card key={formula.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base font-medium">
                  {formula.name}
                </CardTitle>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      disabled={deletingId === formula.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir fórmula?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação não pode ser desfeita. A fórmula "{formula.name}" será permanentemente removida.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(formula.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              {formula.description && (
                <p className="text-sm text-muted-foreground">
                  {formula.description}
                </p>
              )}
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <Badge variant="secondary" className="font-mono text-xs">
                  {formula.formula}
                </Badge>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(formula.updated_at), 'dd/MM/yyyy', { locale: ptBR })}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleLoadFormula(formula)}
                    className="gap-1 h-7 text-xs"
                  >
                    <BookOpen className="h-3 w-3" />
                    Carregar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};