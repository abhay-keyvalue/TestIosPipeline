import {ScaledSheet} from 'react-native-size-matters';

import {isIOS} from '@constants/general';

const styles = ScaledSheet.create({
  container: {
    flex: 1
  },
  content: {
    padding: '12@s',
    paddingTop: '2@s'
  },
  line: {
    height: 1,
    width: '100%',
    marginTop: '20@vs'
  },
  or: {
    position: 'absolute',
    textAlign: 'center',
    paddingHorizontal: '10@s',
    left: '46%',
    bottom: -7,
    fontSize: 14,
    textTransform: 'uppercase'
  },
  inputTitle: {
    fontSize: '13@ms0.3',
    marginBottom: '5@vs',
    marginTop: '14@vs',
    fontWeight: '500'
  },
  formContainer: {
    marginTop: '2@vs'
  },
  footer: {
    padding: '12@s'
  },
  draftButton: {
    width: '100%',
    backgroundColor: 'transparent'
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
  },
  timeLocationContainer: {
    flex: 1,
    paddingHorizontal: '10@s',
    paddingRight: '20@s',
    paddingVertical: '6@vs',
    borderRadius: '8@s',
    marginTop: '10@vs'
  },
  timeLocationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: '6@s'
  },
  timeLocationText: {
    fontSize: '14@ms0.3',
    marginLeft: '6@s',
    lineHeight: isIOS ? '17@vs' : '22@vs'
  },
  circumstances: {
    minHeight: '100@vs'
  }
});

export default styles;
