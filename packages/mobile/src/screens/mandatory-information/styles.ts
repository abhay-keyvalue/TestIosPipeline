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
    minHeight: '100@vs',
    flex: 1
  },
  voicePlayer: {
    marginTop: '6@vs',
    marginBottom: '10@vs'
  },
  checkbox: {
    marginRight: '6@ms',
    marginBottom: '5@vs',
    marginTop: '14@vs'
  },
  idRefusedRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  disabled: {
    opacity: 0.7
  },
  previewContainer: {
    padding: '10@s',
    borderRadius: '6@s',
    overflow: 'hidden',
    marginTop: '4@vs',
    flexDirection: 'column',
    minHeight: '160@vs',
    justifyContent: 'space-between'
  },
  previewImage: {
    width: '100%',
    height: '120@vs',
    borderRadius: '6@s',
    marginBottom: '10@vs'
  },
  documentName: {
    fontSize: '14@ms0.3',
    marginBottom: '6@vs',
    fontWeight: '500'
  },
  reTakeButton: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  voiceRecorder: {
    marginLeft: '6@s'
  }
});

export default styles;
