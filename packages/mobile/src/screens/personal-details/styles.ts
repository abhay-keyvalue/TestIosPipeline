import {ScaledSheet} from 'react-native-size-matters';

const styles = ScaledSheet.create({
  container: {
    flex: 1
  },
  content: {
    padding: '12@s',
    paddingTop: '2@s'
  },
  inputTitle: {
    fontSize: '13@ms0.3',
    marginBottom: '5@vs',
    marginTop: '10@vs',
    fontWeight: '500'
  },
  formContainer: {
    marginTop: '2@vs'
  },
  footer: {
    padding: '12@s'
  },
  nextButton: {
    width: '100%',
    marginBottom: '10@vs'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  half: {
    width: '48%'
  },
  buttonText: {
    fontWeight: '600'
  },
  progress: {
    paddingHorizontal: '12@s'
  }
});

export default styles;
