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
    minHeight: '80@vs'
  },
  photoContainer: {
    width: '100%',
    height: '100%',
    marginTop: '14@vs'
  },
  photo: {
    width: '70@s',
    height: '70@s',
    marginRight: '10@s',
    borderRadius: '6@s'
  },
  photoImage: {
    width: '100%',
    height: '100%',
    borderRadius: '6@s',
    overflow: 'hidden'
  },
  removeIcon: {
    position: 'absolute',
    top: -12,
    right: -12,
    zIndex: 2
  },
  previewContainer: {
    padding: '8@s',
    borderRadius: '8@s',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  previewImage: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: '8@s'
  },
  previewImageContainer: {
    width: '70@s',
    height: '70@s',
    borderRadius: '8@s'
  },
  reTakeButton: {
    marginRight: '10@vs',
    flexDirection: 'row',
    alignItems: 'center'
  },
  reTakeText: {
    fontSize: '14@ms0.3',
    fontWeight: '500',
    marginLeft: '5@s'
  },
  closeButton: {
    position: 'absolute',
    top: -12,
    right: -12,
    zIndex: 2
  }
});

export default styles;
