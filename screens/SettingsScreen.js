import React from 'react';
import { Platform, StyleSheet, View, Button } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const KEY_ACCESS_TOKEN = 'KEY_ACCESS_TOKEN';

export default class SettingsScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Button title="Logout" onPress={this._handleLogout} />
      </View>
    );
  }

  _handleLogout = async () => {
    await SecureStore.deleteItemAsync(KEY_ACCESS_TOKEN);
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },
});
