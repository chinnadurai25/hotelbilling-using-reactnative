import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const BarChart = ({ data, theme, height = 150 }) => {
  const maxVal = Math.max(...data.map(d => d.value));

  return (
    <View style={[styles.chartContainer, { height: height + 40 }]}>
      <View style={styles.barsArea}>
        {data.map((item, index) => {
          const barHeight = (item.value / maxVal) * height;
          return (
            <View key={index} style={styles.barWrapper}>
              <View style={[styles.bar, { height: barHeight, backgroundColor: theme.primary }]} />
              <Text style={[styles.barLabel, { color: theme.subText }]}>{item.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const Analytics = ({ theme }) => {
  const dailyData = [
    { label: 'Mon', value: 450 }, { label: 'Tue', value: 620 }, 
    { label: 'Wed', value: 380 }, { label: 'Thu', value: 850 }, 
    { label: 'Fri', value: 1200 }, { label: 'Sat', value: 1540 },
    { label: 'Sun', value: 1300 }
  ];

  const distribution = [
    { label: 'Breakfast', value: '25%', color: theme.primary },
    { label: 'Lunch', value: '45%', color: theme.secondary },
    { label: 'Dinner', value: '30%', color: theme.success },
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Revenue Analytics</Text>
      
      <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
        <Text style={[styles.cardSubtitle, { color: theme.subText }]}>Weekly Revenue Trend</Text>
        <Text style={[styles.mainValue, { color: theme.text }]}>$5,248.00</Text>
        <View style={styles.trendRow}>
          <Ionicons name="trending-up" size={16} color={theme.success} />
          <Text style={[styles.trendText, { color: theme.success }]}>+12.5% from last week</Text>
        </View>
        <BarChart data={dailyData} theme={theme} />
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 25 }]}>Orders Distribution</Text>
      <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
        <View style={styles.distRow}>
          {distribution.map((item, idx) => (
            <View key={idx} style={styles.distItem}>
              <View style={[styles.distCircle, { backgroundColor: item.color }]} />
              <Text style={[styles.distLabel, { color: theme.text }]}>{item.label}</Text>
              <Text style={[styles.distVal, { color: theme.subText }]}>{item.value}</Text>
            </View>
          ))}
        </View>
        {/* Simple Progress Bar style chart */}
        <View style={styles.distBarContainer}>
          <View style={[styles.distBarPart, { flex: 0.25, backgroundColor: theme.primary, borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }]} />
          <View style={[styles.distBarPart, { flex: 0.45, backgroundColor: theme.secondary }]} />
          <View style={[styles.distBarPart, { flex: 0.30, backgroundColor: theme.success, borderTopRightRadius: 5, borderBottomRightRadius: 5 }]} />
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 25 }]}>Profit & Loss Report</Text>
      <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
        <View style={styles.plRow}>
            <View style={styles.plItem}>
                <Text style={[styles.plLabel, { color: theme.subText }]}>Monthly Earnings</Text>
                <Text style={[styles.plValue, { color: theme.text }]}>$45,820</Text>
            </View>
            <View style={styles.plDivider} />
            <View style={styles.plItem}>
                <Text style={[styles.plLabel, { color: theme.subText }]}>Monthly Expenses</Text>
                <Text style={[styles.plValue, { color: theme.text }]}>$32,150</Text>
            </View>
        </View>
        <View style={[styles.netProfitCard, { backgroundColor: theme.success + '15' }]}>
            <Text style={{ color: theme.success, fontWeight: 'bold' }}>Net Profit</Text>
            <Text style={{ color: theme.success, fontSize: 24, fontWeight: 'bold' }}>+$13,670</Text>
        </View>
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
  card: {
    padding: 20,
    borderRadius: 20,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    marginBottom: 5,
  },
  mainValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  trendText: {
    marginLeft: 5,
    fontSize: 13,
    fontWeight: '600',
  },
  chartContainer: {
    marginTop: 10,
    justifyContent: 'flex-end',
  },
  barsArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flex: 1,
  },
  barWrapper: {
    alignItems: 'center',
    width: (width - 100) / 7,
  },
  bar: {
    width: 6,
    borderRadius: 3,
  },
  barLabel: {
    fontSize: 10,
    marginTop: 8,
  },
  distRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  distItem: {
    alignItems: 'center',
  },
  distCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  distLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  distVal: {
    fontSize: 11,
  },
  distBarContainer: {
    height: 10,
    flexDirection: 'row',
    borderRadius: 5,
    overflow: 'hidden',
  },
  distBarPart: {
    height: '100%',
  },
  plRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  plItem: {
    flex: 1,
  },
  plLabel: {
    fontSize: 12,
    marginBottom: 5,
  },
  plValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  plDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#E0E5F2',
    marginHorizontal: 15,
  },
  netProfitCard: {
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default Analytics;
