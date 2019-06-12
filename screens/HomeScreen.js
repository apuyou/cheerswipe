import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import SwipeableCard from '../components/SwipeableCard';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import GoalCard from '../components/GoalCard';

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
    const goals = this.props.data.goals
      ? this.props.data.goals.edges.map(goals => goals.node)
      : null;

    return (
      <View style={styles.container}>
        {goals &&
          goals.map((item, key) => (
            <SwipeableCard key={key} removeCard={this.removeCard(item.id)}>
              <GoalCard item={item} />
            </SwipeableCard>
          ))}
        {goals && goals.length === 0 && (
          <Text style={{ fontSize: 22, color: '#000' }}>
            No more goals to swipe
          </Text>
        )}
        {goals === null && (
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
  query {
    goals(completed: false, last: 2) {
      edges {
        node {
          title
          id
          cheerCount
          user {
            profileImage
            coverImage
            name
          }
        }
      }
      pageInfo {
        hasNextPage
        startCursor
      }
    }
  }
`)(HomeScreen);
