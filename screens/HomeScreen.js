import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SwipeableCard from '../components/SwipeableCard';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    cards: [
      {
        id: 1,
        title: 'Card 1',
        backgroundColor: '#FFC107',
      },
      {
        id: 2,
        title: 'Card 2',
        backgroundColor: '#ED2525',
      },
      {
        id: 3,
        title: 'Card 3',
        backgroundColor: '#E7088E',
      },
      {
        id: 4,
        title: 'Card 4',
        backgroundColor: '#00BCD4',
      },
      {
        id: 5,
        title: 'Card 5',
        backgroundColor: '#FFFB14',
      },
    ].reverse(),
  };

  removeCard = id => () => {
    this.setState(state => ({
      cards: state.cards.filter(card => card.id !== id),
    }));
  };

  render() {
    const { cards } = this.state;

    return (
      <View style={styles.container}>
        {cards.map((item, key) => (
          <SwipeableCard
            key={key}
            item={item}
            removeCard={this.removeCard(item.id)}
          />
        ))}
        {cards.length === 0 && (
          <Text style={{ fontSize: 22, color: '#000' }}>No more cards</Text>
        )}
      </View>
    );
  }
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
