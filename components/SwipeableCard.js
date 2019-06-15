import React from 'react';
import { StyleSheet, Dimensions, Animated, PanResponder } from 'react-native';
import GoalCard from './GoalCard';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_TRIGGER = 250;

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
    if (Math.abs(gestureState.dx) > SCREEN_WIDTH - SWIPE_TRIGGER) {
      return gestureState.dx > SCREEN_WIDTH - SWIPE_TRIGGER
        ? SWIPE_RIGHT
        : SWIPE_LEFT;
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
          swipeRight: gestureState.dx > SCREEN_WIDTH - SWIPE_TRIGGER,
          swipeLeft: gestureState.dx < -SCREEN_WIDTH + SWIPE_TRIGGER,
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
              this.props.removeCard(direction === SWIPE_LEFT);
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
        <GoalCard
          item={this.props.item}
          swipeRight={this.state.swipeRight}
          swipeLeft={this.state.swipeLeft}
        />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    width: '85%',
    height: '80%',
    position: 'absolute',
    borderRadius: 10,
    backgroundColor: '#333',
    overflow: 'hidden',
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
});

export default SwipeableCard;
