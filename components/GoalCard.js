import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';

class GoalCard extends React.Component {
  render() {
    const { item } = this.props;
    return (
      <View style={styles.card}>
        {item.user.coverImage && (
          <Image style={styles.cover} source={{ uri: item.user.coverImage }} />
        )}
        {this.props.swipeRight && <Text style={styles.rightSwipe}>Ignore</Text>}
        <View style={styles.content}>
          <Text style={styles.cheerCount}>
            {this.props.swipeLeft
              ? this.props.item.cheerCount + 1
              : this.props.item.cheerCount}{' '}
            🙌🏼
          </Text>
          <Text style={styles.title}>{this.props.item.title}</Text>
          <View style={styles.author}>
            <Image
              style={styles.profile}
              source={{ uri: item.user.profileImage }}
            />
            <Text style={styles.name}>{this.props.item.user.name}</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    padding: 25,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cover: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  profile: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  name: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    color: '#fff',
    fontSize: 24,
  },
  cheerCount: {
    color: '#fff',
    fontSize: 20,
    alignSelf: 'flex-end',
  },
  author: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
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

export default GoalCard;
