import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { usePantryStore } from '../../store/usePantryStore';
import { theme } from '../../utils/theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { PantryItem } from '../../types';

export const PantryListScreen = () => {
  const { pantryItems, deletePantryItem } = usePantryStore();
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyExpiring, setOnlyExpiring] = useState(false);

  const getExpirationInfo = (dateStr?: string) => {
    if (!dateStr) return null;
    const expDate = new Date(dateStr);
    const today = new Date();
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: 'Scaduto', color: theme.colors.error, isAlert: true, days: diffDays };
    if (diffDays <= 7) return { text: `Scade tra ${diffDays} gg`, color: theme.colors.warning, isAlert: true, days: diffDays };
    return { text: `Scade: ${dateStr}`, color: theme.colors.textSecondary, isAlert: false, days: diffDays };
  };

  const filteredItems = pantryItems.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (onlyExpiring) {
      const info = getExpirationInfo(item.expirationDate);
      return info?.isAlert === true;
    }
    return true;
  });

  const renderItem = ({ item }: { item: PantryItem }) => {
    const warning = getExpirationInfo(item.expirationDate);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('AddEditPantry', { id: item.id })}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.itemName}>{item.name}</Text>
          <TouchableOpacity onPress={() => deletePantryItem(item.id)} hitSlop={8}>
            <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
        <Text style={styles.itemCategory}>{item.category}</Text>

        <View style={styles.cardFooter}>
          <Text style={styles.itemQuantity}>{item.quantity} {item.unit}</Text>
          {warning && (
            <Text style={[styles.itemExp, { color: warning.color }]}>{warning.text}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cerca in dispensa..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <TouchableOpacity
        style={[styles.filterToggle, onlyExpiring && styles.filterToggleActive]}
        onPress={() => setOnlyExpiring(!onlyExpiring)}
      >
        <Ionicons
          name="alert-circle"
          size={18}
          color={onlyExpiring ? theme.colors.surface : theme.colors.warning}
        />
        <Text style={[styles.filterText, onlyExpiring && styles.filterTextActive]}>
          Solo prodotti in scadenza
        </Text>
      </TouchableOpacity>

      <FlatList
        data={filteredItems}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {onlyExpiring ? 'Nessun prodotto in scadenza.' : 'Dispensa vuota.'}
          </Text>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddEditPantry')}
      >
        <Ionicons name="add" size={24} color={theme.colors.surface} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    margin: theme.spacing.m,
    marginBottom: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
    borderRadius: theme.borderRadius.l,
    height: 48,
    ...theme.shadows.card,
  },
  searchIcon: {
    marginRight: theme.spacing.s,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
  },
  filterToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.m,
    marginBottom: theme.spacing.s,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderRadius: theme.borderRadius.round,
    borderWidth: 1,
    borderColor: theme.colors.warning,
  },
  filterToggleActive: {
    backgroundColor: theme.colors.warning,
  },
  filterText: {
    marginLeft: 6,
    fontWeight: '600',
    color: theme.colors.warning,
    fontSize: 13,
  },
  filterTextActive: {
    color: theme.colors.surface,
  },
  list: {
    padding: theme.spacing.m,
    paddingTop: 0,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    marginBottom: theme.spacing.m,
    ...theme.shadows.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    ...theme.typography.h3,
    fontSize: 18,
  },
  itemCategory: {
    ...theme.typography.label,
    color: theme.colors.primary,
    marginTop: 4,
    marginBottom: theme.spacing.m,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  itemQuantity: {
    ...theme.typography.h2,
    color: theme.colors.secondary,
  },
  itemExp: {
    ...theme.typography.bodySmall,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xl,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.l,
    right: theme.spacing.l,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.card,
  }
});