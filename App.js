import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Switch,
  Alert,
  Modal,
  Text,
  TouchableHighlight,
} from 'react-native';


export default function App() {

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const [modalVisible, setModalVisible] = useState(false);


  function showDialogPrompt(topic) {
    let optionIndex = 0;
    let promptHeaderText = topicEnum.properties[topic].promptHeader;
    let promptActionText = topicEnum.properties[topic].promptAction;
    let promptOptionText;
    let optionsLength;
    let playlists;
    let activePlaylist

    confBoxOverlay.style.display = "block";
    dialogPromptHeader.innerText = promptHeaderText;
    switch (topic) {
      case topicEnum.PLAYLIST:
        connectButton.checked ? getProviderPlaylists() : getLocalPlaylists()
          .then($playlists => {
            playlists = $playlists
            optionsLength = playlists.items.length;
            dialogPromptAction.innerText = `${promptActionText} ${playlists.items[optionIndex].name}`;
          });
        break;

      default:
        promptOptionText = topicEnum.properties[topic].options[optionIndex];
        optionsLength = topicEnum.properties[topic].options.length;
        dialogPromptAction.innerText = `${promptActionText} ${promptOptionText}`;
    }

    dialogYesButton.onclick = function () {
      confBoxOverlay.style.display = "none";
      switch (topic) {
        case topicEnum.PLAYLIST: {
          activePlaylist = playlists.items[optionIndex]
          connectButton.checked ? getProviderPlaylist(activePlaylist.providerId, activePlaylist.playlistId) : getLocalPlaylist(activePlaylist.path)
            .then(playlistData => {
              console.log('Playlist Data... ', playlistData);
              tracks = playlistData.items
              displayPlaylist(tracks)
            });
          break;
        }
        case topicEnum.GENRE: {
          break;
        }
        case topicEnum.PROVIDER: {
          break;
        }
      }
    }

    dialogNoButton.onclick = function () {
      optionIndex++;
      // If we get to the end of the list reset the index to 0 to loop around again
      if (optionIndex === optionsLength) {
        optionIndex = 0;
      }
      switch (topic) {
        case topicEnum.PLAYLIST: {
          promptOptionText = playlists.items[optionIndex].name;
          break;
        }
        case topicEnum.GENRE:
        case topicEnum.PROVIDER: {
          promptOptionText = topicEnum.properties[topic].options[optionIndex];
          break;
        }
      }
      dialogPromptAction.innerText = `${promptActionText} ${promptOptionText}`;
      return false;
    };

    dragElement(confBox);
  }

  return (
    <View style={styles.container}>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />

      <View style={styles.centeredView} id="xxx">
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Hello World!</Text>

              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.textStyle}>Hide Modal</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>

        <TouchableHighlight
          style={styles.openButton}
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <Text style={styles.textStyle}>Show Modal</Text>
        </TouchableHighlight>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16
  },

  switch: {

  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});
