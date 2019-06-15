import React from 'react';
import {
  Platform,
  StyleSheet,
  Button,
  Text,
  View,
  AsyncStorage,
} from 'react-native';
import SwipeableCard from '../components/SwipeableCard';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const STORAGE_CURSOR = 'STORAGE_CURSOR',
  STORAGE_REMOVED = 'STORAGE_REMOVED';

const GET_GOALS = gql`
  query Goals($cursor: String) {
    goals(completed: false, first: 20, after: $cursor) {
      edges {
        node {
          title
          isCheered
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
`;

const CHEER_GOAL = gql`
  mutation Cheer($id: ID!) {
    goalCheer(input: { goalId: $id }) {
      errors {
        message
      }
    }
  }
`;

class HomeScreen extends React.Component {
  state = {
    removedGoals: [],
    initialCursor: null,
  };

  static navigationOptions = {
    header: null,
  };

  async componentDidMount() {
    const initialCursor = await AsyncStorage.getItem(STORAGE_CURSOR);
    if (initialCursor !== null && this.state.initialCursor === null) {
      this.setState({ initialCursor });
    }

    const removedGoals = await AsyncStorage.getItem(STORAGE_REMOVED);
    if (removedGoals !== null) {
      this.setState({ removedGoals: JSON.parse(removedGoals) });
    }
  }

  render() {
    const { initialCursor, removedGoals } = this.state;

    return (
      <View style={styles.container}>
        {initialCursor && (
          <Query query={GET_GOALS} variables={{ cursor: initialCursor }}>
            {({ loading, error, data, fetchMore, refetch }) => {
              if (loading) {
                return <Text style={styles.message}>Loading…</Text>;
              }

              if (error) {
                return (
                  <>
                    <Text style={styles.message}>Error loading goals</Text>
                    <Text style={styles.detail}>{error.message}</Text>
                    <Button onPress={() => refetch()} title="Try again" />
                  </>
                );
              }

              const goals = data.goals
                ? data.goals.edges
                    .map(goals => goals.node)
                    .filter(goal => removedGoals.indexOf(goal.id) === -1)
                    .filter(goal => !goal.isCheered)
                : [];

              if (goals.length === 0) {
                if (data.goals.pageInfo.hasNextPage) {
                  AsyncStorage.setItem(
                    STORAGE_CURSOR,
                    data.goals.pageInfo.endCursor
                  );

                  fetchMore({
                    variables: {
                      cursor: data.goals.pageInfo.endCursor,
                    },
                    updateQuery: (prev, { fetchMoreResult }) => fetchMoreResult,
                  });

                  return (
                    <Text style={styles.message}>Loading more goals…</Text>
                  );
                } else {
                  return (
                    <Text style={styles.message}>No more goals to swipe</Text>
                  );
                }
              }

              return goals.map((item, key) => (
                <Mutation
                  mutation={CHEER_GOAL}
                  variables={{ id: item.id }}
                  key={key}
                >
                  {cheer => (
                    <SwipeableCard
                      item={item}
                      removeCard={swipeLeft => {
                        if (swipeLeft) {
                          cheer();
                        }

                        // Only keep last 20 skipped items and save this to AsyncStorage
                        this.setState(
                          state => ({
                            removedGoals: [
                              ...state.removedGoals.slice(-20),
                              item.id,
                            ],
                          }),
                          () => {
                            AsyncStorage.setItem(
                              STORAGE_REMOVED,
                              JSON.stringify(this.state.removedGoals)
                            );
                          }
                        );
                      }}
                    />
                  )}
                </Mutation>
              ));
            }}
          </Query>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },
  message: {
    fontSize: 22,
    padding: 20,
  },
  detail: {
    fontSize: 12,
    padding: 20,
  },
});

export default HomeScreen;
