import React from 'react';
import { Platform, StyleSheet, View, Button } from 'react-native';
import { AuthSession } from 'expo';

const CLIENT_ID =
  'ca21ee5548526ae665427d30fc632b40cb253cd6b9d081fcdc1a505a1b534dbf';

export default class SigninScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Button title="Signin to Product Hunt" onPress={this._handleSignin} />
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

    if (result.params.code) {
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
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },
});
