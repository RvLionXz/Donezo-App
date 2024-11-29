import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, Modal, Animated, PanResponder } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import * as Speech from 'expo-speech';
import styles from './style';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [notes, setNotes] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(300))[0];
  const menuAnim = useState(new Animated.Value(0))[0];
  const [category, setCategory] = useState('personal');
  const [priority, setPriority] = useState('normal');
  const [reminderDate, setReminderDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    loadNotes();
    registerForPushNotificationsAsync();
  }, []);

  const loadNotes = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem('notes');
      if (savedNotes !== null) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch (error) {
      console.error('Failed to load notes', error);
    }
  };

  const saveNotes = async (notes) => {
    try {
      await AsyncStorage.setItem('notes', JSON.stringify(notes));
    } catch (error) {
      console.error('Failed to save notes', error);
    }
  };

  const toggleMenu = () => {
    if (menuVisible) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  const closeMenu = () => {
    Animated.timing(menuAnim, {
      toValue: 300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setMenuVisible(false));
  };

  const openMenu = () => {
    setMenuVisible(true);
    Animated.timing(menuAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const addNote = async () => {
    if (newNote.trim()) {
      const now = new Date();
      const note = {
        id: Date.now().toString(),
        text: newNote,
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category,
        priority,
        reminderDate: reminderDate.toISOString(),
        completed: false,
      };
      const updatedNotes = [...notes, note];
      setNotes(updatedNotes);
      await saveNotes(updatedNotes);
      setNewNote('');
      closeModal();
      scheduleNotification(note);
    } else {
      Alert.alert('Error', 'Note cannot be empty!');
    }
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const openModal = () => {
    setModalVisible(true);
    slideAnim.setValue(300);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const deleteNote = (id) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  };

  const toggleCompleted = (id) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, completed: !note.completed } : note
    );
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  };

  const filteredNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(searchText.toLowerCase())
  );

  const menuPanResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > 10 && gestureState.dx > 0;
    },
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dx > 0) {
        menuAnim.setValue(gestureState.dx);
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx > 150) {
        closeMenu();
      } else {
        Animated.spring(menuAnim, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const modalPanResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dy) > 10 && gestureState.dy > 0;
    },
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dy > 0) {
        slideAnim.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dy > 150) {
        closeModal();
      } else {
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const scheduleNotification = async (note) => {
    const trigger = new Date(note.reminderDate);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Reminder',
        body: note.text,
      },
      trigger,
    });
  };

  const registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
  };

  const startListening = async () => {
    setIsListening(true);
    try {
      await Speech.start('en-US');
    } catch (error) {
      console.error('Error starting speech recognition:', error);
    }
  };

  const stopListening = async () => {
    setIsListening(false);
    try {
      const result = await Speech.stop();
      if (result && result.value) {
        setNewNote(result.value[0]);
      }
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Donezo</Text>
          <Text style={styles.subtitle}>Simplify Your Productivity</Text>
        </View>
        <TouchableOpacity onPress={toggleMenu}>
          <Ionicons name="help-circle-outline" size={30} color="white" />
        </TouchableOpacity>
      </View>

      {menuVisible && (
        <Animated.View
          style={[styles.menuOverlay, { transform: [{ translateX: menuAnim }] }]}
          {...menuPanResponder.panHandlers}
        >
          <View style={styles.menuView}>
            <Text style={styles.menuTitle}>About</Text>
            <Text style={styles.menuText}>This app is designed to help you manage your daily tasks and notes efficiently.</Text>
            <TouchableOpacity onPress={closeMenu} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search Note"
          placeholderTextColor="#aaa"
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
        />
        <FontAwesome name="search" size={20} color="#aaa" />
      </View>

      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.noteCard, item.completed && styles.completedNote]}>
            <TouchableOpacity onPress={() => toggleCompleted(item.id)} style={styles.checkbox}>
              <Ionicons
                name={item.completed ? "checkbox" : "square-outline"}
                size={24}
                color="white"
              />
            </TouchableOpacity>
            <View style={styles.noteContent}>
              <Text style={[styles.noteText, item.completed && styles.completedText]}>{item.text}</Text>
              <Text style={styles.noteDate}>{item.date}</Text>
              <Text style={styles.noteTime}>{item.time}</Text>
              <Text style={styles.noteCategory}>Category: {item.category}</Text>
              <Text style={styles.notePriority}>Priority: {item.priority}</Text>
            </View>
            <TouchableOpacity onPress={() => deleteNote(item.id)}>
              <Ionicons name="trash-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={openModal}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay} {...modalPanResponder.panHandlers}>
          <Animated.View style={[styles.modalView, { transform: [{ translateY: slideAnim }] }]}>
            <TextInput
              style={styles.input}
              placeholder="Write a note..."
              placeholderTextColor="#aaa"
              value={newNote}
              onChangeText={setNewNote}
            />
            <Picker
              selectedValue={category}
              style={styles.picker}
              onValueChange={(itemValue) => setCategory(itemValue)}
            >
              <Picker.Item label="Personal" value="personal" />
              <Picker.Item label="Work" value="work" />
              <Picker.Item label="School" value="school" />
            </Picker>
            <Picker
              selectedValue={priority}
              style={styles.picker}
              onValueChange={(itemValue) => setPriority(itemValue)}
            >
              <Picker.Item label="Low" value="low" />
              <Picker.Item label="Normal" value="normal" />
              <Picker.Item label="High" value="high" />
            </Picker>
            <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.dateButtonText}>Set Reminder: {reminderDate.toLocaleString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={reminderDate}
                mode="datetime"
                is24Hour={true}
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setReminderDate(selectedDate);
                  }
                }}
              />
            )}
            <TouchableOpacity style={styles.voiceButton} onPress={isListening ? stopListening : startListening}>
              <Ionicons name={isListening ? "mic" : "mic-outline"} size={24} color="white" />
              <Text style={styles.voiceButtonText}>{isListening ? "Stop Listening" : "Start Voice Input"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.addButton} onPress={addNote}>
              <Text style={styles.addButtonText}>Add Note</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

