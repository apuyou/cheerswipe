import React, { Component } from 'react';

import {
  Platform,
  StyleSheet,
  View,
  Text,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

class SwipeableCard extends React.Component {
  constructor() {
    super();
    this.panResponder;
    this.state = {
      Xposition: new Animated.Value(0),
      RightText: false,
      LeftText: false,
    };
    this.Card_Opacity = new Animated.Value(1);
  }

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {
        this.state.Xposition.setValue(gestureState.dx);
        if (gestureState.dx > SCREEN_WIDTH - 250) {
          this.setState({
            RightText: true,
            LeftText: false,
          });
        } else if (gestureState.dx < -SCREEN_WIDTH + 250) {
          this.setState({
            LeftText: true,
            RightText: false,
          });
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (
          gestureState.dx < SCREEN_WIDTH - 150 &&
          gestureState.dx > -SCREEN_WIDTH + 150
        ) {
          this.setState({
            LeftText: false,
            RightText: false,
          });
          Animated.spring(
            this.state.Xposition,
            {
              toValue: 0,
              speed: 5,
              bounciness: 10,
            },
            { useNativeDriver: true }
          ).start();
        } else if (gestureState.dx > SCREEN_WIDTH - 150) {
          Animated.parallel(
            [
              Animated.timing(this.state.Xposition, {
                toValue: SCREEN_WIDTH,
                duration: 200,
              }),
              Animated.timing(this.Card_Opacity, {
                toValue: 0,
                duration: 200,
              }),
            ],
            { useNativeDriver: true }
          ).start(() => {
            this.setState({ LeftText: false, RightText: false }, () => {
              this.props.removeCard();
            });
          });
        } else if (gestureState.dx < -SCREEN_WIDTH + 150) {
          Animated.parallel(
            [
              Animated.timing(this.state.Xposition, {
                toValue: -SCREEN_WIDTH,
                duration: 200,
              }),
              Animated.timing(this.Card_Opacity, {
                toValue: 0,
                duration: 200,
              }),
            ],
            { useNativeDriver: true }
          ).start(() => {
            this.setState({ LeftText: false, RightText: false }, () => {
              this.props.removeCard();
            });
          });
        }
      },
    });
  }

  render() {
    const rotateCard = this.state.Xposition.interpolate({
      inputRange: [-200, 0, 200],
      outputRange: ['-20deg', '0deg', '20deg'],
    });

    return (
      <Animated.View
        {...this.panResponder.panHandlers}
        style={[
          styles.card_Style,
          {
            backgroundColor: this.props.item.backgroundColor,
            opacity: this.Card_Opacity,
            transform: [
              { translateX: this.state.Xposition },
              { rotate: rotateCard },
            ],
          },
        ]}
      >
        <Text style={styles.Card_Title}> {this.props.item.card_Title} </Text>
        {this.state.LeftText ? (
          <Text style={styles.Left_Text_Style}> Left Swipe </Text>
        ) : null}
        {this.state.RightText ? (
          <Text style={styles.Right_Text_Style}> Right Swipe </Text>
        ) : null}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  card_Style: {
    width: '75%',
    height: '45%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    borderRadius: 7,
  },
  Card_Title: {
    color: '#fff',
    fontSize: 24,
  },
  Left_Text_Style: {
    top: 22,
    right: 32,
    position: 'absolute',
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
  Right_Text_Style: {
    top: 22,
    left: 32,
    position: 'absolute',
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
});

export default SwipeableCard;
