import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Mock Data
const initialTables = [
  { id: 1, number: 'T-01', status: 'Free', seats: 4 },
  { id: 2, number: 'T-02', status: 'Occupied', seats: 2, order: { id: '#102', items: 3, total: 45 } },
  { id: 3, number: 'T-03', status: 'Occupied', seats: 4, order: { id: '#105', items: 5, total: 120 } },
  { id: 4, number: 'T-04', status: 'Free', seats: 6 },
  { id: 5, number: 'T-05', status: 'Free', seats: 2 },
  { id: 6, number: 'T-06', status: 'Occupied', seats: 8, order: { id: '#108', items: 8, total: 210 } },
  { id: 7, number: 'T-07', status: 'Free', seats: 4 },
  { id: 8, number: 'T-08', status: 'Occupied', seats: 4, order: { id: '#111', items: 2, total: 35 } },
];

const TableCard = ({ table, theme, onPress }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
    onPress(table);
  };

  const isFree = table.status === 'Free';
  const statusColor = isFree ? theme.success : theme.danger;

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }], width: '48%', marginBottom: 15 }}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.card, { backgroundColor: theme.cardBg, borderColor: statusColor + '40', borderWidth: 1 }]}
      >
        <View style={styles.cardHeader}>
          <Text style={[styles.tableNum, { color: theme.text }]}>{table.number}</Text>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
        </View>
        
        <View style={styles.cardBody}>
          <Ionicons name="people" size={16} color={theme.subText} />
          <Text style={[styles.seatsText, { color: theme.subText }]}>{table.seats} Seats</Text>
        </View>
        
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>{table.status}</Text>
        </View>

      </TouchableOpacity>
    </Animated.View>
  );
};

const TableManager = ({ theme }) => {
  const [selectedTable, setSelectedTable] = useState(null);

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Table Management</Text>
      
      {selectedTable && !selectedTable.order && (
        <View style={[styles.infoPanel, { backgroundColor: theme.cardBg, borderColor: theme.success }]}>
          <Text style={[styles.panelTitle, { color: theme.text }]}>Table {selectedTable.number}</Text>
          <Text style={{ color: theme.subText }}>This table is currently free and ready for guests.</Text>
          <TouchableOpacity style={[styles.closeBtn, { backgroundColor: theme.primary }]} onPress={() => setSelectedTable(null)}>
            <Text style={styles.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}

      {selectedTable && selectedTable.order && (
        <View style={[styles.infoPanel, { backgroundColor: theme.cardBg, borderColor: theme.danger }]}>
          <Text style={[styles.panelTitle, { color: theme.text }]}>Order Details - {selectedTable.number}</Text>
          <View style={styles.orderRow}>
            <Text style={{ color: theme.subText }}>Order ID:</Text>
            <Text style={{ color: theme.text, fontWeight: 'bold' }}>{selectedTable.order.id}</Text>
          </View>
          <View style={styles.orderRow}>
            <Text style={{ color: theme.subText }}>Total Items:</Text>
            <Text style={{ color: theme.text, fontWeight: 'bold' }}>{selectedTable.order.items}</Text>
          </View>
          <View style={styles.orderRow}>
            <Text style={{ color: theme.subText }}>Total Amount:</Text>
            <Text style={{ color: theme.primary, fontWeight: 'bold', fontSize: 18 }}>${selectedTable.order.total}</Text>
          </View>
          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.success }]} onPress={() => setSelectedTable(null)}>
              <Text style={styles.actionText}>Complete Order</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.closeBtn, { backgroundColor: theme.subText }]} onPress={() => setSelectedTable(null)}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.grid}>
        {initialTables.map((table) => (
          <TableCard 
            key={table.id} 
            table={table} 
            theme={theme} 
            onPress={(t) => setSelectedTable(t)} 
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    padding: 15,
    borderRadius: 16,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tableNum: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  seatsText: {
    marginLeft: 6,
    fontSize: 13,
  },
  statusBadge: {
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoPanel: {
    padding: 15,
    borderRadius: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    elevation: 2,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  actionBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 10,
  },
  actionText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  closeBtn: {
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  closeBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
  }
});

export default TableManager;
