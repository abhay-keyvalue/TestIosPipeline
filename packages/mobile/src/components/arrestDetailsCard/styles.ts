import {ScaledSheet} from 'react-native-size-matters';

const styles = ScaledSheet.create({
  cardContainer: {
    padding: '12@s',
    borderRadius: '8@s',
    marginBottom: '16@vs'
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10@vs'
  },
  cardTitle: {
    fontSize: '16@ms0.3',
    fontWeight: '600'
  },
  column: {
    flexDirection: 'column',
    marginBottom: '10@vs'
  },
  textContainer: {
    marginLeft: '12@s',
    flex: 1
  },
  text: {
    fontSize: '14@ms0.3',
    paddingTop: '3@vs'
  },
  subText: {
    fontSize: '12@ms0.3',
    paddingTop: '3@vs'
  },
  smallText: {
    fontSize: '10@ms0.3',
    paddingTop: '8@vs',
    textTransform: 'uppercase'
  },
  half: {
    width: '50%'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: '12@vs'
  },
  viewMoreContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '8@s'
  },
  separator: {
    height: '1@s',
    width: '100%',
    marginBottom: '16@vs',
    marginTop: '8@vs'
  },
  photo: {
    width: '100@s',
    height: '100@s',
    borderRadius: '8@s',
    marginRight: '8@s'
  },
  imageContainer: {
    marginTop: '10@vs'
  }
});

export default styles;
