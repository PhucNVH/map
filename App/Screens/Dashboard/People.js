import React from 'react';
import {Icon, SearchBar, ListItem} from 'react-native-elements';
import {StyleSheet, View, FlatList, Text} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
const styles = StyleSheet.create({});

export default class People extends React.Component {
  constructor(props) {
    super(props);
    this.uid = auth().currentUser.uid;
    this.state = {
      search: '',
      type: '',
      listPeople: [],
      visualList: [],
      selectedList: [],
    };
  }
  componentDidMount() {
    const connectionCollection = firestore()
      .collection('ship')
      .doc(this.uid)
      .collection(this.props.route.params.type);
    connectionCollection.get().then(async (snapshot) => {
      const x = Promise.all(
        snapshot.docs.map((doc) => {
          const ship = doc.data();
          return ship.ref.get();
        }),
      );
      x.then((e) => {
        let ships = e.map((i) => i.data());
        ships = ships.filter((i) => i != undefined);
        this.setState({selectedList: [], visualList: ships});
      });
    });
    const shipCollection = firestore().collection('ship');
    shipCollection.get().then((snapshot) => {
      const ships = snapshot.docs.map((item) => {
        return item.data();
      });
      this.setState({listPeople: ships});
    });
  }
  updateSearch = (search) => {
    this.setState({search});
    let filteredData = this.state.listPeople.filter(function (item) {
      return item.displayName.includes(search) || item.email.includes(search);
    });
    this.setState({visualList: filteredData});
  };
  renderItem = ({item}) => (
    <ListItem
      title={item.displayName}
      subtitle={item.email}
      leftAvatar={{source: {uri: item.avatar}}}
      onPress={() => {
        this.props.navigation.navigate('Person', {
          item,
        });
      }}
      bottomDivider
      chevron
    />
  );

  keyExtractor = (item, index) => index.toString();
  render() {
    const {search, visualList} = this.state;
    return (
      <View>
        <SearchBar
          placeholder="Type Here..."
          onChangeText={this.updateSearch}
          value={search}
          lightTheme={true}
        />
        <FlatList
          keyExtractor={this.keyExtractor}
          data={visualList}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}
