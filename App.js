import React from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  AsyncStorage,
  Text,
} from 'react-native';
import { AppLoading, Asset, Font, Icon, SecureStore } from 'expo';
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';
import { createHttpLink } from 'apollo-link-http';
import { ApolloProvider } from 'react-apollo';

import AppNavigator from './navigation/AppNavigator';
import SigninScreen from './screens/SigninScreen';

const KEY_ACCESS_TOKEN = 'KEY_ACCESS_TOKEN';

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
    authToken: null,
    client: null,
  };

  async componentDidMount() {
    const authToken = await SecureStore.getItemAsync(KEY_ACCESS_TOKEN);
    if (authToken) {
      this.setState({ authToken });
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    const { authToken } = this.state;
    if (prevState.authToken !== authToken) {
      const cache = new InMemoryCache();
      await persistCache({
        cache,
        storage: AsyncStorage,
      });

      const client = new ApolloClient({
        link: createHttpLink({
          uri: 'https://api.producthunt.com/v2/api/graphql',
          headers: { Authorization: `Bearer ${authToken}` },
        }),
        cache: new InMemoryCache(),
        defaultOptions: {
          query: {
            fetchPolicy: 'cache-first',
          },
        },
      });

      this.setState({ client });
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
    } else if (!this.state.client) {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <Text>Loading…</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <ApolloProvider client={this.state.client}>
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
