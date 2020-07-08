import {StyleSheet} from 'react-native';
import {Colors} from './../../Themes';

export default StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
  },
  logoContainer: {
    flex: 9,
  },
  logo: {
    backgroundColor: Colors.WHITE,
    height: 200,
    width: 200,
  },
  textWrap: {
    flex: 1,
  },
  text: {
    color: '#3d3d3d',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
