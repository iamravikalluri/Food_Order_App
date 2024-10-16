import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from './src/components/Dashboard'; // Adjust the path as needed
import OrderHistory from './src/components/OrderHistory'; // Adjust the path as needed

const Tab = createBottomTabNavigator();

const App = () => {
  type FoodItem = {
    name: string;
    price: number;
  };

  const [orders, setOrders] = useState<{ item: FoodItem; quantity: number }[]>([]);

  // Function to load orders from AsyncStorage when the app starts
  const loadOrders = async () => {
    try {
      const savedOrders = await AsyncStorage.getItem('orders');
      if (savedOrders !== null) {
        setOrders(JSON.parse(savedOrders));
      }
    } catch (error) {
      console.error('Failed to load orders from storage', error);
    }
  };

  // Function to save orders to AsyncStorage whenever orders change
  const saveOrders = async (newOrders: { item: FoodItem; quantity: number }[]) => {
    try {
      await AsyncStorage.setItem('orders', JSON.stringify(newOrders));
    } catch (error) {
      console.error('Failed to save orders', error);
    }
  };

  // Load orders when the component mounts
  useEffect(() => {
    loadOrders();
  }, []);

  // Save orders whenever they change
  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Dashboard">
          {(props) => <Dashboard {...props} setOrders={setOrders} />} 
        </Tab.Screen>
        <Tab.Screen name="Order History">
          {(props) => <OrderHistory {...props} orders={orders} />} 
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});
