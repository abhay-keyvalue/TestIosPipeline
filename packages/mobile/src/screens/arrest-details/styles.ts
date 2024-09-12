import {ScaledSheet} from 'react-native-size-matters';

const styles = ScaledSheet.create({
  container: {
    flex: 1
  },
  content: {
    padding: '12@s',
    paddingTop: '2@s'
  },
  suspectInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: '16@vs',
    marginTop: '16@vs',
    padding: '12@s',
    borderRadius: '10@s'
  },
  textContainer: {
    marginLeft: '12@s',
    overflow: 'hidden'
  },
  text: {
    fontSize: '14@ms0.3',
    paddingTop: '3@vs',
    flex: 1
  },
  statusText: {
    fontSize: '13@ms0.3'
  },
  suspectImage: {
    width: '80@ms0.3',
    height: '80@ms0.3',
    borderRadius: '10@s',
    overflow: 'hidden',
    backgroundColor: '#E5E5E5'
  },
  title: {
    fontSize: '18@ms0.3',
    fontWeight: '600'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: '8@vs'
  },
  half: {
    width: '50%'
  },
  cardContainer: {
    padding: '12@s',
    borderRadius: '8@s',
    marginBottom: '16@vs'
  },
  header: {
    fontSize: '18@ms0.3',
    fontWeight: '600',
    marginBottom: '10@vs'
  },
  statusContainer: {
    marginTop: '5@vs',
    borderRadius: '5@s',
    padding: '5@s',
    paddingHorizontal: '8@s'
  }
});

export default styles;
