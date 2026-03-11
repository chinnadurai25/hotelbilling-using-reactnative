import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../utils/api';

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
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const data = await api.getTables();
      setTables(data);
    } catch (e) {
      console.error('Fetch tables error:', e);
    } finally {
      setLoading(false);
    }
  };

  const seedTables = async () => {
    try {
      setLoading(true);
      const initialTables = [
        { number: 'T-01', seats: 4 },
        { number: 'T-02', seats: 2 },
        { number: 'T-03', seats: 4 },
        { number: 'T-04', seats: 6 },
        { number: 'T-05', seats: 2 },
        { number: 'T-06', seats: 8 },
      ];
      for (const t of initialTables) {
        await api.addTable(t);
      }
      fetchTables();
    } catch (e) {
      console.error('Seed tables error:', e);
    }
  };

  const completeOrder = async (id) => {
    try {
      await api.updateTable(id, { status: 'Free', currentOrder: null });
      fetchTables();
      setSelectedTable(null);
    } catch (e) {
      console.error('Complete order error:', e);
    }
  };

  if (loading) return <Text style={{ padding: 20, color: theme.subText }}>Loading tables...</Text>;


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

      {selectedTable && selectedTable.currentOrder && (
        <View style={[styles.infoPanel, { backgroundColor: theme.cardBg, borderColor: theme.danger }]}>
          <Text style={[styles.panelTitle, { color: theme.text }]}>Order Details - {selectedTable.number}</Text>
          <View style={styles.orderRow}>
            <Text style={{ color: theme.subText }}>Order ID:</Text>
            <Text style={{ color: theme.text, fontWeight: 'bold' }}>{selectedTable.currentOrder.orderId}</Text>
          </View>
          <View style={styles.orderRow}>
            <Text style={{ color: theme.subText }}>Total Items:</Text>
            <Text style={{ color: theme.text, fontWeight: 'bold' }}>{selectedTable.currentOrder.items}</Text>
          </View>
          <View style={styles.orderRow}>
            <Text style={{ color: theme.subText }}>Total Amount:</Text>
            <Text style={{ color: theme.primary, fontWeight: 'bold', fontSize: 18 }}>₹{selectedTable.currentOrder.totalAmount}</Text>
          </View>
          <View style={styles.actionRow}>
            <TouchableOpacity 
                style={[styles.actionBtn, { backgroundColor: theme.success }]} 
                onPress={() => completeOrder(selectedTable._id)}
            >
              <Text style={styles.actionText}>Complete Order</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.closeBtn, { backgroundColor: theme.subText }]} onPress={() => setSelectedTable(null)}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.grid}>
        {tables.length === 0 ? (
          <View style={{ width: '100%', alignItems: 'center', padding: 20 }}>
            <Text style={{ color: theme.subText, marginBottom: 15 }}>No tables found.</Text>
            <TouchableOpacity 
                style={[styles.actionBtn, { backgroundColor: theme.primary, width: 200 }]} 
                onPress={seedTables}
            >
                <Text style={styles.actionText}>Seed Initial Tables</Text>
            </TouchableOpacity>
          </View>
        ) : (
          tables.map((table) => (
            <TableCard 
              key={table._id || table.id} 
              table={table} 
              theme={theme} 
              onPress={(t) => setSelectedTable(t)} 
            />
          ))
        )}
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
