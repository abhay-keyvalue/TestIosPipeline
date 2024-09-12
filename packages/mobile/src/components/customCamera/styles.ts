import {ScaledSheet} from 'react-native-size-matters';

const styles = ScaledSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  },
  takePictureContainer: {
    borderRadius: '8@s',
    minHeight: '100@vs',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '5@vs',
    overflow: 'hidden'
  },
  takePictureText: {
    fontSize: '14@ms0.3',
    paddingLeft: '10@s',
    marginTop: '3@vs'
  },
  backContainer: {
    borderRadius: '20@s',
    padding: '10@s'
  },
  bottomToolsContainer: {
    zIndex: 2,
    position: 'absolute',
    bottom: '0@vs',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: '35@vs',
    paddingTop: '25@vs',
    backgroundColor: 'rgba(0,0,0,0.1)'
  },
  topToolsContainer: {
    zIndex: 2,
    position: 'absolute',
    top: '0@vs',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: '10@vs',
    paddingBottom: '10@vs',
    paddingTop: '10@vs',
    backgroundColor: 'rgba(0,0,0,0.1)'
  },
  captureInner: {
    width: '50@s',
    height: '50@s',
    borderRadius: '25@s',
    backgroundColor: '#FFF'
  },
  captureOuter: {
    width: '60@s',
    height: '60@s',
    borderRadius: '30@s',
    borderWidth: '2@s',
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  safeAreaView: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'space-between'
  },
  cameraText: {
    color: '#FFF',
    fontSize: '12@ms0.3',
    fontWeight: '500'
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    overflow: 'hidden',
    resizeMode: 'cover'
  },
  iconContainer: {
    width: '60@s',
    height: '60@s',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default styles;
