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
  additionalInfo: {
    minHeight: '100@vs',
    marginTop: '5@vs',
    marginBottom: '5@vs'
  },
  footer: {
    padding: '12@s'
  },
  nextButton: {
    width: '100%',
    marginBottom: '10@vs'
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cameraContainer: {
    minHeight: '70@vs'
  },
  photoContainer: {
    width: '100%',
    height: '100%',
    marginTop: '12@vs'
  },
  photo: {
    width: '120@s',
    height: '90@s',
    marginRight: '10@s',
    overflow: 'hidden',
    borderRadius: '10@s'
  },
  photoImage: {
    width: '100%',
    height: '100%'
  },
  removeIcon: {
    position: 'absolute',
    top: '0@vs',
    right: '0@s',
    left: '0@s',
    bottom: '0@vs',
    backgroundColor: 'rgba(255,255,255,0.5)',
    padding: '3@s',
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default styles;
