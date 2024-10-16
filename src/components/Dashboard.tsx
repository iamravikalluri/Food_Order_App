import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Modal, TextInput, Button, Alert, Image, ImageSourcePropType } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; // Import Feather icons

type FoodItem = {
  name: string;
  price: number;
  image?: ImageSourcePropType; 
};

// Initialize foodItems array
const initialFoodItems: FoodItem[] = [
  { name: 'Sundal', price: 30, image: require('./assets/chana.png') },
  { name: 'Paniyaram/Ponganalu and Chutney', price: 40 },
  { name: 'Salem Tatta', price: 50 },
  { name: 'Pav Bhaji', price: 60, image: require('./assets/Pav.png') },
  { name: 'Pani Puri', price: 70 },
  { name: 'Maggie (Plain)', price: 80 },
  { name: 'Maggie (Paneer)', price: 90 },
  { name: 'Maggie (Cheese)', price: 100 },
  { name: 'Maggie (Vegetable)', price: 110 },
  { name: 'Poli/Holige', price: 120 },
  { name: 'Gulab Jamun', price: 130 },
  { name: 'Buttermilk', price: 140 },
  { name: 'Ice Cream - Vanilla', price: 150 },
  { name: 'Ice Cream - Strawberry', price: 160 },
  { name: 'Ice Cream - Butterscotch', price: 170 },
  { name: 'Sharbat', price: 180 },
];

const defaultImage = require('./assets/imgnotfound.jpg'); // Adjust path as needed

interface DashboardProps {
  setOrders: React.Dispatch<React.SetStateAction<{ item: FoodItem; quantity: number }[]>>;
}

const Dashboard: React.FC<DashboardProps> = ({ setOrders }) => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>(initialFoodItems); // Use state for food items
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>(''); // State for search query
  const [editModalVisible, setEditModalVisible] = useState(false); // State for edit modal
  const [editedItem, setEditedItem] = useState<FoodItem | null>(null); // State for edited item

  const openOrderPopup = (item: FoodItem) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const placeOrder = () => {
    if (selectedItem) {
      setOrders((prevOrders) => [...prevOrders, { item: selectedItem, quantity }]);
      Alert.alert('Order placed!', `You ordered ${quantity} of ${selectedItem.name}`);
      setModalVisible(false);
      setQuantity(1);
    }
  };

  const openEditModal = (item: FoodItem) => {
    setEditedItem(item);
    setEditModalVisible(true);
  };

  const saveEditedItem = () => {
    if (editedItem) {
      // Update the foodItems array by mapping over the existing items
      const updatedFoodItems = foodItems.map(item => 
        item.name === editedItem.name ? { ...item, ...editedItem } : item
      );
      
      setFoodItems(updatedFoodItems); // Update the state with new items
      console.log("Updated Food Items: ", updatedFoodItems); // Log updated items for debugging
      Alert.alert('Item updated!', `You updated ${editedItem.name}`);
      setEditModalVisible(false); // Close edit modal
      setEditedItem(null); // Reset edited item state
    }
  };

  const renderFoodTile = ({ item }: { item: FoodItem }) => (
    <TouchableOpacity style={styles.tile} onPress={() => openOrderPopup(item)}>
      <Image 
        source={item.image ? item.image : defaultImage} // Use default image if item image is not available
        style={styles.foodImage} 
      />
      <Text style={styles.tileText}>
        {item.name.length > 10 ? `${item.name.slice(0, 10)}...` : item.name}
      </Text>
      <Text style={styles.tileText}>Price: ₹{item.price}</Text>
      {/* Edit Icon */}
      <TouchableOpacity style={styles.editIcon} onPress={() => openEditModal(item)}>
        <Icon name="edit" size={20} color="black" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // Filter food items based on the search query
  const filteredFoodItems = foodItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <TextInput 
        style={styles.searchInput} 
        placeholder="Search food items..." 
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      
      <FlatList
        data={filteredFoodItems}
        renderItem={renderFoodTile}
        keyExtractor={(item) => item.name}
        numColumns={2}
      />

      {selectedItem && (
        <Modal visible={modalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Order {selectedItem.name}</Text>
              <Text style={styles.modalText}>Price: ₹{selectedItem.price}</Text>
              <TextInput
                style={styles.input}
                keyboardType="number-pad"
                value={quantity.toString()}
                onChangeText={(text) => setQuantity(Number(text))}
              />
              <View style={styles.buttonContainer}>
                <Button title="Cancel" onPress={() => setModalVisible(false)} />
                <Button title="Confirm Order" onPress={placeOrder} />
              </View>
            </View>
          </View>
        </Modal>
      )}

      {editedItem && (
        <Modal visible={editModalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Edit {editedItem.name}</Text>
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={editedItem.name}
                onChangeText={(text) => setEditedItem({ ...editedItem, name: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Price"
                keyboardType="number-pad"
                value={editedItem.price.toString()}
                onChangeText={(text) => setEditedItem({ ...editedItem, price: Number(text) })}
              />
              <View style={styles.buttonContainer}>
                <Button title="Cancel" onPress={() => setEditModalVisible(false)} />
                <Button title="Save" onPress={saveEditedItem} />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};
export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  tile: {
    flex: 1,
    margin: 10,
    padding: 20,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    position: 'relative', // Allow positioning of the edit icon
  },
  tileText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    width: 200,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginVertical: 10,
    textAlign: 'center',
  },
  foodImage: {
    width: 50, // Adjust as needed
    height: 50, // Adjust as needed
    marginBottom: 8, // Space between image and text
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20, // Optional: Add some space above the buttons
  },
  editIcon: {
    position: 'absolute', // Position it absolutely to the top right
    top: 10,
    right: 10,
  },
});
