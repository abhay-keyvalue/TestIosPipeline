import {ScaledSheet} from 'react-native-size-matters';

const styles = ScaledSheet.create({
  container: {
    flex: 1
  },
  contentContainerStyle: {
    padding: '16@ms',
    justifyContent: 'space-between'
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoContainer: {
    width: '150@ms',
    height: '150@ms',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '75@ms',
    overflow: 'hidden',
    margin: '12@ms',
    marginTop: '24@vs'
  },
  appLabel: {
    fontSize: '22@ms',
    fontWeight: '500'
  },
  subTitle: {
    fontSize: '12@ms',
    fontWeight: '400'
  },
  loginContainer: {
    marginVertical: '30@vs'
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
  sighUpLabel: {
    fontSize: '14@ms',
    paddingLeft: '4@s'
  },
  forgotPasswordLabel: {
    fontSize: '14@ms',
    width: '100%',
    textAlign: 'center',
    padding: '10@ms',
    textDecorationLine: 'underline'
  },
  button: {
    marginTop: '25@vs'
  }
});

export default styles;
