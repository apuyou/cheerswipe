import React from 'react';
import {
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import { AuthSession } from 'expo';
import clap from '../assets/images/clap.jpg';

const CLIENT_ID =
  'ca21ee5548526ae665427d30fc632b40cb253cd6b9d081fcdc1a505a1b534dbf';

export default class SigninScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Image source={clap} style={styles.bgImage} />
        <View style={styles.login}>
          <Text style={styles.logo}>👏 Cheer Up!</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={this._handleSignin}
            activeOpacity={0.8}
          >
            <Text style={styles.loginText}>LOGIN WITH PRODUCT HUNT</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  _handleSignin = async () => {
    const redirectUrl = AuthSession.getRedirectUrl();
    const result = await AuthSession.startAsync({
      authUrl:
        `https://api.producthunt.com/v2/oauth/authorize?client_id=${CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(redirectUrl)}` +
        `&response_type=code` +
        `&scope=public+private+write`,
    });

    if (result.params && result.params.code) {
      const accessReq = await fetch(
        'https://jwpak61m9g.execute-api.us-east-1.amazonaws.com/dev/token',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code: result.params.code }),
        }
      );
      const accessRes = await accessReq.json();
      if (accessRes.access_token) {
        this.props.setAuthToken(accessRes.access_token);
      }
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },
  login: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgImage: {
    position: 'absolute',
    height: '120%',
    resizeMode: 'contain',
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  loginButton: {
    marginTop: 50,
    backgroundColor: '#da552f',
    borderRadius: 3,
    width: '80%',
    padding: 13,
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
