import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font, Icon, SecureStore } from 'expo';
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { ApolloProvider } from 'react-apollo';

import AppNavigator from './navigation/AppNavigator';
import SigninScreen from './screens/SigninScreen';

const KEY_ACCESS_TOKEN = 'KEY_ACCESS_TOKEN';

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
    authToken: null,
  };

  async componentDidMount() {
    const authToken = await SecureStore.getItemAsync(KEY_ACCESS_TOKEN);
    if (authToken) {
      this.setState({ authToken });
    }
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else if (!this.state.authToken) {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <SigninScreen setAuthToken={this.setAuthToken} />
        </View>
      );
    } else {
      const client = new ApolloClient({
        link: createHttpLink({
          uri: 'https://api.producthunt.com/v2/api/graphql',
          headers: { Authorization: `Bearer ${this.state.authToken}` },
        }),
        cache: new InMemoryCache(),
      });

      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <ApolloProvider client={client}>
            <AppNavigator />
          </ApolloProvider>
        </View>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([require('./assets/images/clap.jpg')]),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };

  setAuthToken = authToken => {
    SecureStore.setItemAsync(KEY_ACCESS_TOKEN, authToken);
    this.setState({ authToken });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
