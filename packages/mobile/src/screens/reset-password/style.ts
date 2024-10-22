import {ScaledSheet} from 'react-native-size-matters';

const styles = ScaledSheet.create({
  container: {
    flex: 1
  },
  contentContainerStyle: {
    justifyContent: 'space-between',
    flex: 1
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: '16@ms'
  },
  signIn: {
    fontSize: '28@ms',
    fontWeight: '400',
    marginBottom: '15@vs'
  },
  inputLabel: {
    fontSize: '14@ms',
    fontWeight: '400',
    paddingTop: '12@vs',
    paddingBottom: '8@vs'
  },
  text: {
    fontSize: '14@ms'
  },
  button: {
    marginTop: '25@vs'
  },
  passwordCriteriaContainer: {
    marginTop: '16@vs',
    borderRadius: '5@ms',
    padding: '8@ms'
  },
  passwordCriteria: {
    fontSize: '14@ms',
    fontWeight: '400',
    paddingBottom: '10@vs'
  },
  criteriaContainer: {
    padding: '8@ms',
    flexDirection: 'row',
    alignItems: 'center'
  },
  criteriaText: {
    fontSize: '14@ms',
    fontWeight: '400',
    paddingLeft: '8@ms'
  }
});

export default styles;
