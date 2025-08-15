import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Formula {
  id: string;
  name: string;
  formula: string;
  values?: Record<string, number>;
  description?: string;
  created_at: string;
  updated_at: string;
}

export const useFormulas = () => {
  const { user } = useAuth();
  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFormulas = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('formulas')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setFormulas((data || []).map(formula => ({
        ...formula,
        values: formula.values as Record<string, number> | undefined
      })));
    } catch (error) {
      console.error('Erro ao buscar fórmulas:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveFormula = async (
    name: string,
    formula: string,
    values?: Record<string, number>,
    description?: string
  ) => {
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('formulas')
      .insert({
        user_id: user.id,
        name,
        formula,
        values,
        description
      })
      .select()
      .single();

    if (error) throw error;
    
    await fetchFormulas();
    return data;
  };

  const updateFormula = async (
    id: string,
    name: string,
    formula: string,
    values?: Record<string, number>,
    description?: string
  ) => {
    if (!user) throw new Error('Usuário não autenticado');

    const { error } = await supabase
      .from('formulas')
      .update({
        name,
        formula,
        values,
        description
      })
      .eq('id', id);

    if (error) throw error;
    
    await fetchFormulas();
  };

  const deleteFormula = async (id: string) => {
    if (!user) throw new Error('Usuário não autenticado');

    const { error } = await supabase
      .from('formulas')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    await fetchFormulas();
  };

  useEffect(() => {
    if (user) {
      fetchFormulas();
    }
  }, [user]);

  return {
    formulas,
    loading,
    saveFormula,
    updateFormula,
    deleteFormula,
    refetch: fetchFormulas
  };
};