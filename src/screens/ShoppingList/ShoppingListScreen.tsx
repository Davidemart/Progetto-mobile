import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useShoppingListStore } from '../../store/useShoppingListStore';
import { useMealPlanStore } from '../../store/useMealPlanStore';
import { useRecipeStore } from '../../store/useRecipeStore';
import { usePantryStore } from '../../store/usePantryStore';
import { theme } from '../../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { ShoppingListItem, Unit } from '../../types';
import { v4 as uuidv4 } from 'uuid';

const UNITS: Unit[] = ['g', 'kg', 'ml', 'l', 'pz', 'cucchiaio', 'cucchiaino', 'q.b.'];

export const ShoppingListScreen = () => {
  const tabBarHeight = useBottomTabBarHeight();
  const { shoppingList, addShoppingItem, updateShoppingItem, toggleBought, deleteShoppingItem, setShoppingList } = useShoppingListStore();
  const { plannedMeals } = useMealPlanStore();
  const { recipes } = useRecipeStore();
  const { pantryItems } = usePantryStore();

  const [newItemName, setNewItemName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editQty, setEditQty] = useState('');
  const [editUnit, setEditUnit] = useState<Unit>('pz');

  const startEdit = (item: ShoppingListItem) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditQty(String(item.quantity));
    setEditUnit(item.unit);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditQty('');
  };

  const saveEdit = (item: ShoppingListItem) => {
    if (!editName.trim()) {
      Alert.alert('Errore', 'Il nome non può essere vuoto');
      return;
    }
    updateShoppingItem(item.id, {
      name: editName.trim(),
      quantity: parseFloat(editQty) || 0,
      unit: editUnit,
      isBought: item.isBought,
      fromMealPlan: item.fromMealPlan,
    });
    cancelEdit();
  };

  const handleManualAdd = () => {
    if (!newItemName) return;
    addShoppingItem({
      name: newItemName,
      quantity: 1,
      unit: 'pz',
      isBought: false,
    });
    setNewItemName('');
  };

  //Generazione Automatica Lista della Spesa
  const generateShoppingList = () => {
    Alert.alert(
      'Genera Lista della Spesa',
      'Vuoi generare la lista della spesa basata sui pasti pianificati? Gli ingredienti già presenti in dispensa non verranno aggiunti.',
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Genera',
          onPress: () => {
            const requiredIngredients: Record<string, { quantity: number, unit: string }> = {};

            plannedMeals.forEach(meal => {
              const recipe = recipes.find(r => r.id === meal.recipeId);
              if (recipe) {
                recipe.ingredients.forEach(ing => {
                  const key = `${ing.name.toLowerCase()}_${ing.unit}`;
                  if (requiredIngredients[key]) {
                    requiredIngredients[key].quantity += ing.quantity;
                  } else {
                    requiredIngredients[key] = { quantity: ing.quantity, unit: ing.unit };
                  }
                });
              }
            });

            pantryItems.forEach(item => {
              const key = `${item.name.toLowerCase()}_${item.unit}`;
              if (requiredIngredients[key]) {
                requiredIngredients[key].quantity -= item.quantity;
                if (requiredIngredients[key].quantity <= 0) {
                  delete requiredIngredients[key];
                }
              }
            });

            const manualItems = shoppingList.filter(item => !item.fromMealPlan && !item.isBought);

            const generatedItems: ShoppingListItem[] = Object.keys(requiredIngredients).map(key => ({
              id: uuidv4(),
              name: key.split('_')[0],
              quantity: requiredIngredients[key].quantity,
              unit: requiredIngredients[key].unit as Unit,
              isBought: false,
              fromMealPlan: true,
            }));

            generatedItems.forEach(item => {
              item.name = item.name.charAt(0).toUpperCase() + item.name.slice(1);
            });

            setShoppingList([...manualItems, ...generatedItems]);
          },
        },
      ],
    );
  };

  const transferToPantry = () => {
    const boughtItems = shoppingList.filter(item => item.isBought);
    if (boughtItems.length === 0) {
      Alert.alert('Nessun articolo', 'Non hai spuntato nessun articolo come acquistato.');
      return;
    }

    boughtItems.forEach(item => {
      const existingItem = pantryItems.find(p => p.name.toLowerCase() === item.name.toLowerCase() && p.unit === item.unit);

      if (existingItem) {
        usePantryStore.getState().updatePantryItem(existingItem.id, {
          ...existingItem,
          quantity: existingItem.quantity + item.quantity,
        });
      } else {
        usePantryStore.getState().addPantryItem({
          name: item.name,
          category: 'Generico',
          quantity: item.quantity,
          unit: item.unit,
        });
      }
    });

    setShoppingList(shoppingList.filter(item => !item.isBought));
    Alert.alert('Trasferimento completato', 'Gli articoli acquistati sono stati aggiunti alla dispensa.');
  };

  const renderItem = ({ item }: { item: ShoppingListItem }) => {
    const isEditing = editingId === item.id;

    if (isEditing) {
      return (
        <View style={[styles.listItem, styles.editingItem]}>
          <View style={styles.editForm}>
            <TextInput
              style={styles.editInput}
              value={editName}
              onChangeText={setEditName}
              placeholder="Nome"
              autoFocus
            />
            <View style={styles.editRow}>
              <TextInput
                style={[styles.editInput, { flex: 1, marginRight: 8 }]}
                value={editQty}
                onChangeText={setEditQty}
                keyboardType="numeric"
                placeholder="Qtà"
              />
              <View style={styles.unitChipRow}>
                {UNITS.map(u => (
                  <TouchableOpacity
                    key={u}
                    style={[styles.unitChip, editUnit === u && styles.unitChipSelected]}
                    onPress={() => setEditUnit(u)}
                  >
                    <Text style={[styles.unitChipText, editUnit === u && styles.unitChipTextSelected]}>{u}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.editActions}>
              <TouchableOpacity onPress={cancelEdit} style={styles.editCancelBtn}>
                <Text style={styles.editCancelText}>Annulla</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => saveEdit(item)} style={styles.editSaveBtn}>
                <Text style={styles.editSaveText}>Salva</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.listItem}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => toggleBought(item.id)}
        >
          <Ionicons
            name={item.isBought ? 'checkmark-circle' : 'ellipse-outline'}
            size={28}
            color={item.isBought ? theme.colors.success : theme.colors.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.itemInfo} onPress={() => startEdit(item)}>
          <Text style={[styles.itemName, item.isBought && styles.itemBoughtText]}>
            {item.name}
          </Text>
          <View style={styles.itemMetaRow}>
            <Text style={styles.itemQuantity}>{item.quantity} {item.unit}</Text>
            {item.fromMealPlan && (
              <View style={styles.autoBadge}>
                <Ionicons name="flash" size={12} color={theme.colors.secondary} />
                <Text style={styles.autoText}>Auto</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => startEdit(item)} style={styles.iconBtn} hitSlop={8}>
          <Ionicons name="pencil" size={18} color={theme.colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteShoppingItem(item.id)} style={styles.iconBtn} hitSlop={8}>
          <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
        </TouchableOpacity>
      </View>
    );
  };

  const canAdd = newItemName.trim().length > 0;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? tabBarHeight : 0}
    >
      <View style={styles.headerArea}>
        <TouchableOpacity style={styles.generateBtn} onPress={generateShoppingList}>
          <Ionicons name="color-wand" size={20} color={theme.colors.surface} />
          <Text style={styles.generateBtnText}>Genera da Meal Plan</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.generateBtn, { backgroundColor: theme.colors.primary, marginTop: 10 }]} onPress={transferToPantry}>
          <Ionicons name="log-in-outline" size={20} color={theme.colors.surface} />
          <Text style={styles.generateBtnText}>Sposta acquistati in Dispensa</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={shoppingList}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Text style={styles.emptyText}>Lista della spesa vuota.</Text>
        }
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Aggiungi prodotto..."
          placeholderTextColor={theme.colors.textSecondary}
          value={newItemName}
          onChangeText={setNewItemName}
          onSubmitEditing={handleManualAdd}
          returnKeyType="done"
        />
        <TouchableOpacity
          style={[styles.addButton, !canAdd && styles.addButtonDisabled]}
          onPress={handleManualAdd}
          disabled={!canAdd}
        >
          <Ionicons name="add" size={24} color={theme.colors.surface} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerArea: {
    padding: theme.spacing.m,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.card,
  },
  generateBtn: {
    flexDirection: 'row',
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    justifyContent: 'center',
    alignItems: 'center',
  },
  generateBtnText: {
    color: theme.colors.surface,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: theme.spacing.s,
  },
  list: {
    padding: theme.spacing.m,
    paddingBottom: 20,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    marginBottom: theme.spacing.s,
    ...theme.shadows.card,
  },
  editingItem: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  editForm: {
    flex: 1,
  },
  editInput: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.m,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    fontSize: 16,
    marginBottom: theme.spacing.s,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  unitChipRow: {
    flex: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  unitChip: {
    paddingHorizontal: theme.spacing.s,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.round,
    marginRight: 4,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  unitChipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  unitChipText: {
    fontSize: 12,
    color: theme.colors.text,
  },
  unitChipTextSelected: {
    color: theme.colors.surface,
    fontWeight: 'bold',
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.s,
  },
  editCancelBtn: {
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    marginRight: theme.spacing.s,
  },
  editCancelText: {
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  editSaveBtn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.l,
    paddingVertical: theme.spacing.s,
    borderRadius: theme.borderRadius.m,
  },
  editSaveText: {
    color: theme.colors.surface,
    fontWeight: 'bold',
  },
  checkbox: {
    marginRight: theme.spacing.m,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    ...theme.typography.body,
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemBoughtText: {
    textDecorationLine: 'line-through',
    color: theme.colors.textSecondary,
  },
  itemMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  itemQuantity: {
    ...theme.typography.bodySmall,
    color: theme.colors.primaryDark,
  },
  autoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: theme.spacing.s,
  },
  autoText: {
    fontSize: 10,
    color: theme.colors.secondary,
    marginLeft: 2,
    fontWeight: 'bold',
  },
  iconBtn: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xl,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: theme.spacing.m,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.m,
    paddingHorizontal: theme.spacing.m,
    marginRight: theme.spacing.m,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: theme.colors.border,
  }
});
