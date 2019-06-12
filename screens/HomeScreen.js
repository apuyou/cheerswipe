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
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  removeCard = id => () => {
    // this.setState(state => ({
    //   cards: state.cards.filter(card => card.id !== id),
    // }));
  };

  render() {
    const cards = this.props.data.posts
      ? this.props.data.posts.edges.map(post => post.node)
      : null;

    return (
      <View style={styles.container}>
        {cards &&
          cards.map((item, key) => (
            <SwipeableCard
              key={key}
              item={item}
              removeCard={this.removeCard(item.id)}
            />
          ))}
        {cards && cards.length === 0 && (
          <Text style={{ fontSize: 22, color: '#000' }}>No more cards</Text>
        )}
        {cards === null && (
          <Text style={{ fontSize: 22, color: '#000' }}>Loading…</Text>
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

export default graphql(gql`
  query allPosts {
    posts(last: 5) {
      edges {
        node {
          id
          name
          tagline
          media {
            url
          }
          thumbnail {
            url
          }
        }
      }
    }
  }
`)(HomeScreen);
