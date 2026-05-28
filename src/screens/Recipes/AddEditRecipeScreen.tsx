import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useRecipeStore } from '../../store/useRecipeStore';
import { theme } from '../../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { Ingredient, RecipeCategory, Difficulty, Unit } from '../../types';
import { v4 as uuidv4 } from 'uuid';

const CATEGORIES: RecipeCategory[] = ['Colazione', 'Primo', 'Secondo', 'Contorno', 'Dolce', 'Spuntino', 'Bevanda'];
const DIFFICULTIES: Difficulty[] = ['Facile', 'Media', 'Difficile'];
const UNITS: Unit[] = ['g', 'kg', 'ml', 'l', 'pz', 'cucchiaio', 'cucchiaino', 'q.b.'];

export const AddEditRecipeScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const editingId: string | undefined = route.params?.id;
  const { recipes, addRecipe, updateRecipe } = useRecipeStore();
  const existing = editingId ? recipes.find(r => r.id === editingId) : undefined;

  const [name, setName] = useState(existing?.name ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [category, setCategory] = useState<RecipeCategory>(existing?.category ?? 'Primo');
  const [prepTime, setPrepTime] = useState(existing ? String(existing.prepTime) : '');
  const [difficulty, setDifficulty] = useState<Difficulty>(existing?.difficulty ?? 'Facile');
  const [portions, setPortions] = useState(existing ? String(existing.portions) : '');
  const [ingredients, setIngredients] = useState<Ingredient[]>(existing?.ingredients ?? []);
  const [notes, setNotes] = useState(existing?.notes ?? '');
  const [imageUrl, setImageUrl] = useState(existing?.imageUrl ?? '');

  const [ingName, setIngName] = useState('');
  const [ingQty, setIngQty] = useState('');
  const [ingUnit, setIngUnit] = useState<Unit>('g');

  useLayoutEffect(() => {
    navigation.setOptions({ title: editingId ? 'Modifica Ricetta' : 'Nuova Ricetta' });
  }, [navigation, editingId]);

  const handleAddIngredient = () => {
    if (!ingName || !ingQty) return;
    const newIng: Ingredient = {
      id: uuidv4(),
      name: ingName,
      quantity: parseFloat(ingQty) || 0,
      unit: ingUnit,
    };
    setIngredients([...ingredients, newIng]);
    setIngName('');
    setIngQty('');
  };

  const handleRemoveIngredient = (id: string) => {
    setIngredients(ingredients.filter(i => i.id !== id));
  };

  const handleSave = () => {
    if (!name || !prepTime || !portions) {
      Alert.alert('Errore', 'Compila i campi obbligatori (Nome, Tempo, Porzioni)');
      return;
    }

    const payload = {
      name,
      description,
      category,
      prepTime: parseInt(prepTime) || 0,
      difficulty,
      portions: parseInt(portions) || 1,
      ingredients,
      notes,
      imageUrl: imageUrl || undefined,
    };

    if (editingId) {
      updateRecipe(editingId, payload);
    } else {
      addRecipe(payload);
    }

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Nome Ricetta *</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Es. Pasta al Pomodoro" />

      <Text style={styles.label}>Descrizione</Text>
      <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} multiline placeholder="Breve descrizione..." />

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

      <Text style={styles.label}>Difficoltà</Text>
      <View style={styles.chipRow}>
        {DIFFICULTIES.map(d => (
          <TouchableOpacity
            key={d}
            style={[styles.chip, difficulty === d && styles.chipSelected]}
            onPress={() => setDifficulty(d)}
          >
            <Text style={[styles.chipText, difficulty === d && styles.chipTextSelected]}>{d}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.row}>
        <View style={styles.halfCol}>
          <Text style={styles.label}>Tempo (min) *</Text>
          <TextInput style={styles.input} value={prepTime} onChangeText={setPrepTime} keyboardType="numeric" placeholder="15" />
        </View>
        <View style={styles.halfCol}>
          <Text style={styles.label}>Porzioni *</Text>
          <TextInput style={styles.input} value={portions} onChangeText={setPortions} keyboardType="numeric" placeholder="2" />
        </View>
      </View>

      <Text style={styles.label}>URL Immagine</Text>
      <TextInput style={styles.input} value={imageUrl} onChangeText={setImageUrl} placeholder="https://..." autoCapitalize="none" />

      <View style={styles.sectionDivider} />

      <Text style={theme.typography.h2}>Ingredienti</Text>
      {ingredients.map(ing => (
        <View key={ing.id} style={styles.ingredientItem}>
          <Text style={styles.ingText}>{ing.name} - {ing.quantity} {ing.unit}</Text>
          <TouchableOpacity onPress={() => handleRemoveIngredient(ing.id)}>
            <Ionicons name="close-circle" size={24} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      ))}

      <View style={styles.addIngredientContainer}>
        <TextInput style={[styles.input, { flex: 2, marginRight: 8 }]} value={ingName} onChangeText={setIngName} placeholder="Ingrediente" />
        <TextInput style={[styles.input, { flex: 1, marginRight: 8 }]} value={ingQty} onChangeText={setIngQty} keyboardType="numeric" placeholder="Qtà" />
        <TouchableOpacity style={styles.addButton} onPress={handleAddIngredient}>
          <Ionicons name="add" size={20} color={theme.colors.surface} />
        </TouchableOpacity>
      </View>
      <View style={styles.chipRow}>
        {UNITS.map(u => (
          <TouchableOpacity
            key={u}
            style={[styles.chipSmall, ingUnit === u && styles.chipSelected]}
            onPress={() => setIngUnit(u)}
          >
            <Text style={[styles.chipText, ingUnit === u && styles.chipTextSelected]}>{u}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.sectionDivider} />

      <Text style={styles.label}>Note</Text>
      <TextInput style={[styles.input, styles.textArea]} value={notes} onChangeText={setNotes} multiline placeholder="Note aggiuntive..." />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>{editingId ? 'Aggiorna Ricetta' : 'Salva Ricetta'}</Text>
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
  sectionDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.l,
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
  ingredientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.s,
    marginBottom: theme.spacing.xs,
  },
  ingText: {
    ...theme.typography.body,
  },
  addIngredientContainer: {
    flexDirection: 'row',
    marginTop: theme.spacing.s,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.m,
    paddingHorizontal: theme.spacing.m,
  },
  saveButton: {
    backgroundColor: theme.colors.accent,
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
