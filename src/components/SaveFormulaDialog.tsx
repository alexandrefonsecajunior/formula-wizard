import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';
import { useFormulas } from '@/hooks/useFormulas';
import { useToast } from '@/hooks/use-toast';

interface SaveFormulaDialogProps {
  formula: string;
  variableValues: Record<string, number>;
}

export const SaveFormulaDialog = ({ formula, variableValues }: SaveFormulaDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const { saveFormula } = useFormulas();
  const { toast } = useToast();

  const handleSave = async () => {
    if (!name.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, digite um nome para a fórmula.",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      await saveFormula(name, formula, variableValues, description);
      toast({
        title: "Fórmula salva!",
        description: "Sua fórmula foi salva com sucesso."
      });
      setOpen(false);
      setName('');
      setDescription('');
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a fórmula. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Save className="h-4 w-4" />
          Salvar Fórmula
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Salvar Fórmula</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="formula-name">Nome da Fórmula *</Label>
            <Input
              id="formula-name"
              placeholder="Ex: Cálculo de IMC"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="formula-description">Descrição (opcional)</Label>
            <Textarea
              id="formula-description"
              placeholder="Breve descrição sobre a fórmula..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};