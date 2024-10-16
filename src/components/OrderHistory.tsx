import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

interface OrderHistoryProps {
  orders: { item: { name: string; price: number }; quantity: number }[];
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ orders }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>See all Orders</Text>
      
      {orders.length === 0 ? (
        <Text>No orders placed yet.</Text>
      ) : (
        <ScrollView style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.headerCell}>Item Name</Text>
            <Text style={styles.headerCell}>Quantity</Text>
            <Text style={styles.headerCell}>Per Quantity Price</Text>
            <Text style={styles.headerCell}>Total Cost</Text>
          </View>
          {orders.map((order, index) => (
            <View style={styles.row} key={index}>
              <Text style={styles.cell}>{order.item.name}</Text>
              <Text style={styles.cell}>{order.quantity}</Text>
              <Text style={styles.cell}>₹{order.item.price}</Text>
              <Text style={styles.cell}>₹{order.item.price * order.quantity}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default OrderHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  table: {
    width: '100%',
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerCell: {
    fontWeight: 'bold',
    width: '25%',
  },
  cell: {
    width: '25%',
  },
});
