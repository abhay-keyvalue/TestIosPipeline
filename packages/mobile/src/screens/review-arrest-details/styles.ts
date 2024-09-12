import {ScaledSheet} from 'react-native-size-matters';

const styles = ScaledSheet.create({
  container: {
    flex: 1
  },
  content: {
    padding: '12@s',
    paddingTop: '2@s'
  },
  footer: {
    padding: '12@s'
  },
  nextButton: {
    width: '100%',
    marginBottom: '10@vs'
  },
  buttonText: {
    fontWeight: '600'
  }
});

export default styles;
