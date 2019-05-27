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
        id: '1',
        card_Title: 'Card 1',
        backgroundColor: '#FFC107',
      },
      {
        id: '2',
        card_Title: 'Card 2',
        backgroundColor: '#ED2525',
      },
      {
        id: '3',
        card_Title: 'Card 3',
        backgroundColor: '#E7o88E',
      },
      {
        id: '4',
        card_Title: 'Card 4',
        backgroundColor: '#00BCD4',
      },
      {
        id: '5',
        card_Title: 'Card 5',
        backgroundColor: '#FFFB14',
      },
    ],
    no: false,
  };

  componentDidMount() {
    this.setState({
      cards: this.state.cards.reverse(),
    });
  }

  removeCard = id => () => {
    this.state.cards.splice(this.state.cards.findIndex(x => x.id == id), 1);
    this.setState({ cards: this.state.cards });
  };

  render() {
    const { cards } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.MainContainer}>
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  MainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },
});
