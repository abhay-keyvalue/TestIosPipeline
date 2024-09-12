import {WINDOW_HEIGHT, isIOS} from '@constants/general';
import {ScaledSheet} from 'react-native-size-matters';

const styles = ScaledSheet.create({
  title: {
    fontSize: '14@ms',
    fontWeight: '600',
    marginBottom: '14@vs',
    marginTop: '10@vs',
    textAlign: 'center'
  },
  text: {
    fontSize: '14@ms',
    fontWeight: '400',
    paddingRight: '5@s'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)'
  },
  outSide: {
    flex: 1
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '16@ms',
    borderTopLeftRadius: '20@ms',
    borderTopRightRadius: '20@ms',
    width: '100%',
    maxHeight: WINDOW_HEIGHT * 0.8,
    paddingBottom: '30@vs'
  },
  article: {
    fontSize: '10@ms',
    textTransform: 'uppercase'
  },
  label: {
    fontSize: '12@ms',
    paddingTop: '2@vs'
  },
  activityIndicator: {
    paddingRight: '5@s'
  },
  cardContainer: {
    borderWidth: 1,
    paddingHorizontal: '10@ms',
    paddingVertical: '10@vs',
    borderRadius: '4@ms',
    overflow: 'hidden',
    marginBottom: '8@vs',
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: '40@vs'
  },
  checkbox: {
    marginRight: '8@ms'
  },
  textContainer: {
    flex: 1
  },
  button: {
    width: '50%'
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: '8@vs'
  },
  transparent: {
    backgroundColor: 'transparent'
  },
  list: {
    marginTop: '10@vs',
    minHeight: WINDOW_HEIGHT * 0.7
  },
  selectorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: '4@ms',
    height: isIOS ? '40@vs' : '45@vs',
    paddingHorizontal: '8@ms',
    paddingVertical: '5@vs'
  },
  placeholder: {
    fontSize: '14@ms',
    fontWeight: '400'
  },
  iconContainer: {
    marginTop: '2@vs',
    marginRight: '2@s'
  },
  selectedItemsContainer: {
    marginTop: '4@vs'
  },
  selectedItem: {
    padding: '8@ms',
    borderRadius: '4@ms',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '2@vs'
  },
  selectedItemText: {
    fontSize: '12@ms',
    fontWeight: '600'
  },
  selectedItemTitle: {
    fontSize: '10@ms',
    fontWeight: '600',
    paddingRight: '5@s'
  },
  closeIcon: {
    width: '20@s',
    height: '20@s',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default styles;
