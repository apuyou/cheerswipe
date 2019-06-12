import React, { Component } from 'react';

import {
  Platform,
  StyleSheet,
  View,
  Text,
  Dimensions,
  Animated,
  Image,
  ImageBackground,
  PanResponder,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

const SWIPE_LEFT = 0,
  SWIPE_RIGHT = 1;

class SwipeableCard extends React.Component {
  panResponder = null;

  state = {
    delta: new Animated.ValueXY(),
    opacity: new Animated.Value(1),
    swipeRight: false,
    swipeLeft: false,
    mediaIndex: 0,
  };

  gestureDirection(gestureState) {
    if (Math.abs(gestureState.vx) > 1) {
      return gestureState.vx > 0 ? SWIPE_RIGHT : SWIPE_LEFT;
    }
    if (Math.abs(gestureState.dx) > SCREEN_WIDTH - 200) {
      return gestureState.dx > SCREEN_WIDTH - 200 ? SWIPE_RIGHT : SWIPE_LEFT;
    }
    return null;
  }

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderMove: (evt, gestureState) => {
        this.state.delta.setValue({ x: gestureState.dx, y: gestureState.dy });
        this.setState({
          swipeRight: gestureState.dx > SCREEN_WIDTH - 200,
          swipeLeft: gestureState.dx < -SCREEN_WIDTH + 200,
        });
      },
      onPanResponderRelease: (evt, gestureState) => {
        const direction = this.gestureDirection(gestureState);
        if (direction !== null) {
          Animated.parallel(
            [
              Animated.timing(this.state.delta.x, {
                toValue:
                  direction === SWIPE_RIGHT ? SCREEN_WIDTH : -SCREEN_WIDTH,
                duration: 200,
              }),
              Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: 200,
              }),
            ],
            { useNativeDriver: true }
          ).start(() => {
            this.setState({ swipeLeft: false, swipeRight: false }, () => {
              this.props.removeCard();
            });
          });
        } else {
          this.setState({
            swipeLeft: false,
            swipeRight: false,
          });
          Animated.spring(
            this.state.delta,
            {
              toValue: { x: 0, y: 0 },
              speed: 10,
              bounciness: 8,
            },
            { useNativeDriver: true }
          ).start();
        }
      },
    });
  }

  render() {
    const rotateCard = this.state.delta.x.interpolate({
      inputRange: [-200, 0, 200],
      outputRange: ['-20deg', '0deg', '20deg'],
    });

    const { item } = this.props;
    const { mediaIndex } = this.state;

    return (
      <Animated.View
        {...this.panResponder.panHandlers}
        style={[
          styles.card,
          {
            opacity: this.state.opacity,
            transform: [
              { translateX: this.state.delta.x },
              { translateY: this.state.delta.y },
              { rotate: rotateCard },
            ],
          },
          this.state.delta.x > 0 ? styles.cardShadow : {},
        ]}
      >
        <Image
          source={{ uri: item.media[mediaIndex].url }}
          style={{ width: '100%', height: '80%' }}
        />
        {item.thumbnail && (
          <Image style={styles.image} source={{ uri: item.thumbnail.url }} />
        )}
        <Text style={styles.name}>{this.props.item.name}</Text>
        <Text style={styles.tagline}>{this.props.item.tagline}</Text>
        {this.state.swipeLeft && (
          <Text style={styles.leftSwipe}>Left Swipe</Text>
        )}
        {this.state.swipeRight && (
          <Text style={styles.rightSwipe}>Right Swipe</Text>
        )}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    width: '85%',
    height: '80%',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    position: 'absolute',
    borderRadius: 7,
    backgroundColor: '#ccc',
    padding: 10,
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  image: {
    width: 50,
    height: 50,
  },
  name: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  tagline: {
    color: '#fff',
    fontSize: 20,
  },
  leftSwipe: {
    top: 22,
    right: 32,
    position: 'absolute',
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
  rightSwipe: {
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
