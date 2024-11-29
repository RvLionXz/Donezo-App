import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1C3A',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 15,
    color: 'white',
    marginBottom: 10,

  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#3D3B5E',
    borderRadius: 25,
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    color: 'white',
  },
  noteCard: {
    backgroundColor: '#514E8A',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  noteContent: {
    flex: 1,
    marginRight: 10,
  },
  noteText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  noteDate: {
    color: 'lightgrey',
    fontSize: 12,
  },
  noteTime: {
    color: 'lightgrey',
    fontSize: 12,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#3D3B5E',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuOverlay: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '80%',
    backgroundColor: '#2C2A4A',
    zIndex: 999,
  },
  menuView: {
    padding: 20,
    paddingTop: 200,
    width: '100%',
  },
  menuTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  menuText: {
    textAlign: 'center',
    color: 'lightgrey',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#FF5733',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
  },
  modalOverlay: {
    paddingTop: '20',
    flex: 1,
    justifyContent: 'flex-end',
  },
  
  modalView: {
    backgroundColor: '#100c1c',
    padding: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
    minHeight: '50%',
    alignItems: 'center',
  },
  
  input: {
    width: '100%',
    backgroundColor: '#3D3B5E',
    color: 'white',
    padding: 10,
    borderRadius: 15,
    marginBottom: 20,
  },
  
  addButton: {
    backgroundColor: '#514E8A', 
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
  },
  
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  cancelButton: {
    backgroundColor: '#F44336', 
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
  },
  
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  picker: {
    width: '100%',
    backgroundColor: '#3D3B5E',
    color: 'white',
    marginBottom: 20,
  },
  dateButton: {
    backgroundColor: '#3D3B5E',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  dateButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  voiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3D3B5E',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  voiceButtonText: {
    color: 'white',
    marginLeft: 10,
  },
  checkbox: {
    marginRight: 10,
  },
  completedNote: {
    opacity: 0.7,
  },
  completedText: {
    textDecorationLine: 'line-through',
  },
  noteCategory: {
    color: 'lightgrey',
    fontSize: 12,
  },
  notePriority: {
    color: 'lightgrey',
    fontSize: 12,
  },

});

export default styles;

