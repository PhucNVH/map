import {StyleSheet} from 'react-native';
import {Colors} from './../../Themes';

export default StyleSheet.create({
  text: {},
  brandName: {
    fontSize: 30,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    flex: 1,
    width: 200,
    height: 200,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    width: '80%',
  },
  textInput: {
    height: 40,
    borderColor: Colors.SILVER,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 20,
  },
});
