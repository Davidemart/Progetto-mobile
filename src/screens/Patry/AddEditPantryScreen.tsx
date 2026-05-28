import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { usePantryStore } from '../../store/usePantryStore';
import { theme } from '../../utils/theme';
import { PantryItem, RecipeCategory, Unit } from '../../types';

const CATEGORIES: (RecipeCategory | 'Generico')[] = ['Generico', 'Colazione', 'Primo', 'Secondo', 'Contorno', 'Dolce', 'Spuntino', 'Bevanda'];
const UNITS: Unit[] = ['g', 'kg', 'ml', 'l', 'pz', 'cucchiaio', 'cucchiaino', 'q.b.'];

export const AddEditPantryScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const editingId: string | undefined = route.params?.id;
  const { pantryItems, addPantryItem, updatePantryItem } = usePantryStore();
  const existing = editingId ? pantryItems.find(p => p.id === editingId) : undefined;

  const [name, setName] = useState(existing?.name ?? '');
  const [category, setCategory] = useState<PantryItem['category']>(existing?.category ?? 'Generico');
  const [quantity, setQuantity] = useState(existing ? String(existing.quantity) : '');
  const [unit, setUnit] = useState<Unit>(existing?.unit ?? 'g');
  const [expirationDate, setExpirationDate] = useState(existing?.expirationDate ?? '');
  const [notes, setNotes] = useState(existing?.notes ?? '');

  useLayoutEffect(() => {
    navigation.setOptions({ title: editingId ? 'Modifica Prodotto' : 'Nuovo Prodotto' });
  }, [navigation, editingId]);

  const handleSave = () => {
    if (!name || !quantity) {
      Alert.alert('Errore', 'Inserisci nome e quantità');
      return;
    }

    const payload = {
      name,
      category,
      quantity: parseFloat(quantity) || 0,
      unit,
      expirationDate: expirationDate || undefined,
      notes,
    };

    if (editingId) {
      updatePantryItem(editingId, payload);
    } else {
      addPantryItem(payload);
    }

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Nome Prodotto *</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Es. Pasta" />

      <Text style={styles.label}>Categoria</Text>
      <View style={styles.chipRow}>
        {CATEGORIES.map(c => (
          <TouchableOpacity
            key={c}
            style={[styles.chip, category === c && styles.chipSelected]}
            onPress={() => setCategory(c)}
          >
            <Text style={[styles.chipText, category === c && styles.chipTextSelected]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.row}>
        <View style={styles.halfCol}>
          <Text style={styles.label}>Quantità *</Text>
          <TextInput style={styles.input} value={quantity} onChangeText={setQuantity} keyboardType="numeric" placeholder="500" />
        </View>
        <View style={styles.halfCol}>
          <Text style={styles.label}>Unità</Text>
          <View style={styles.chipRow}>
            {UNITS.map(u => (
              <TouchableOpacity
                key={u}
                style={[styles.chipSmall, unit === u && styles.chipSelected]}
                onPress={() => setUnit(u)}
              >
                <Text style={[styles.chipText, unit === u && styles.chipTextSelected]}>{u}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <Text style={styles.label}>Data Scadenza (YYYY-MM-DD)</Text>
      <TextInput style={styles.input} value={expirationDate} onChangeText={setExpirationDate} placeholder="2026-12-31" autoCapitalize="none" />

      <Text style={styles.label}>Note</Text>
      <TextInput style={[styles.input, styles.textArea]} value={notes} onChangeText={setNotes} multiline placeholder="Note opzionali..." />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>{editingId ? 'Aggiorna Prodotto' : 'Salva in Dispensa'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.m,
  },
  label: {
    ...theme.typography.label,
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.s,
  },
  input: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderRadius: theme.borderRadius.m,
    fontSize: 16,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.s,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfCol: {
    flex: 0.48,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.s,
  },
  chip: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderRadius: theme.borderRadius.round,
    marginRight: theme.spacing.s,
    marginBottom: theme.spacing.s,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chipSmall: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.s,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.round,
    marginRight: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
  },
  chipTextSelected: {
    color: theme.colors.surface,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.l,
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: 40,
  },
  saveButtonText: {
    color: theme.colors.surface,
    fontSize: 18,
    fontWeight: 'bold',
  }
});