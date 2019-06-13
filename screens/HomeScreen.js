import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import SwipeableCard from '../components/SwipeableCard';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import GoalCard from '../components/GoalCard';

class HomeScreen extends React.Component {
  state = {
    removedGoals: [],
    cursor: null,
  };

  static navigationOptions = {
    header: null,
  };

  getGoals = () => {
    const { data } = this.props;
    const { removedGoals } = this.state;

    const goals = data.goals ? data.goals.edges.map(goals => goals.node) : null;

    return goals && goals.filter(goal => removedGoals.indexOf(goal.id) === -1);
  };

  removeCard = id => () => {
    this.setState(
      state => ({
        removedGoals: [...state.removedGoals, id],
      }),
      this.fetchMore
    );
  };

  fetchMore = () => {
    const goals = this.getGoals();
    if (goals.length === 0) {
      if (this.props.data.goals.pageInfo.hasNextPage) {
        this.props.data.refetch({
          cursor: this.props.data.goals.pageInfo.startCursor,
        });
      }
    }
  };

  render() {
    const goals = this.getGoals();

    return (
      <View style={styles.container}>
        {goals &&
          goals.map((item, key) => (
            <SwipeableCard key={key} removeCard={this.removeCard(item.id)}>
              <GoalCard item={item} />
            </SwipeableCard>
          ))}
        {goals &&
          goals.length === 0 &&
          !this.props.data.goals.pageInfo.hasNextPage && (
            <Text style={{ fontSize: 22, color: '#000' }}>
              No more goals to swipe
            </Text>
          )}
        {goals &&
          goals.length === 0 &&
          this.props.data.goals.pageInfo.hasNextPage && (
            <Text style={{ fontSize: 22, color: '#000' }}>
              Loading more goals…
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

export default graphql(
  gql`
    query Goals($cursor: String) {
      goals(completed: false, first: 10, after: $cursor) {
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
          endCursor
        }
      }
    }
  `,
  {
    options: {
      variables: {
        cursor: null,
      },
    },
  }
)(HomeScreen);
