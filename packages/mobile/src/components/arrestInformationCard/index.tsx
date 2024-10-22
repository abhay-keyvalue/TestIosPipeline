import React, {useMemo, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {ScaledSheet} from 'react-native-size-matters';
import dateFormat from 'dateformat';

import type {RootState} from '@src/store';
import {defenceAssignmentList, fontWeights, genderList} from '@constants/general';
import {navigateAndPush, navigateTo} from '@navigation/navigationUtils';
import type {ArrestDraftType} from '@screens/review-arrest-details/arrestDraftSlice';
import {routes} from '@constants/labels';
import VoicePlayer from '@components/voicePlayer';
import CustomText from '@components/customText';
import CustomImage from '@components/customImage';
import EditIcon from '@components/editIcon';
import Down from '@assets/svg/downArrow.svg';
import DocumentIcon from '@assets/svg/document.svg';

const ArrestInformationCard = ({
  arrestDraft,
  hideEdit
}: {
  arrestDraft: ArrestDraftType;
  hideEdit?: boolean;
}) => {
  const {
    userImage,
    name,
    locationName,
    gender,
    dob,
    proofDocument,
    circumstance,
    criminalOffence,
    defenceLawyer,
    defenceAssignment,
    circumstanceRecording,
    caseNumber,
    avatar,
    isIdRefused,
    createdAt
  } = arrestDraft || {};

  const imageUrl = userImage?.mediaLocalUrl || avatar;

  const {name: lawyerName, phoneNumber: telephoneNumber} = defenceLawyer || {};

  const detaineeDeclaration = defenceAssignmentList.find(
    (item) => item.value === defenceAssignment
  ) || {label: ''};

  const {colors} = useSelector((state: RootState) => state.theme);
  const {t} = useTranslation();

  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

  const themeStyle = {
    background: {
      backgroundColor: colors?.PRIMARY_BACKGROUND
    },
    text: {
      color: colors?.PRIMARY_TEXT
    },
    cardBackground: {
      backgroundColor: colors?.CARD_BACKGROUND
    },
    subText: {
      color: colors?.SECONDARY_TEXT
    }
  };

  const openImageViewer = (url?: string) => {
    navigateTo(routes.IMAGE_VIEWER, {imageUrl: url || ''});
  };

  const editPersonalInfo = () => {
    navigateAndPush(routes.MANDATORY_INFORMATION);
  };

  const renderGender = useMemo(() => {
    let genderLabel = '-';

    genderList?.map((item) => {
      if (item.value === gender) genderLabel = item.label;
    });

    return t(`${genderLabel}`);
  }, [gender]);

  const renderProfileImage = useMemo(
    () => imageUrl?.length > 0 && <CustomImage source={{uri: imageUrl}} />,
    [imageUrl]
  );
  const renderIDImage = useMemo(
    () =>
      (proofDocument?.documentLocalUrl?.length > 0 || proofDocument?.documentKey?.length > 0) && (
        <CustomImage
          source={{uri: proofDocument?.documentLocalUrl || proofDocument?.documentKey}}
        />
      ),
    [proofDocument?.documentLocalUrl, proofDocument?.documentKey]
  );

  const renderHalfBox = (title: string, value: string) => {
    return (
      <View style={styles.half}>
        <CustomText fontWeight={fontWeights.MEDIUM} style={[themeStyle.text, styles.text]}>
          {title}
        </CustomText>
        <CustomText style={[themeStyle.text, styles.text]}>{value || '-'}</CustomText>
      </View>
    );
  };

  const renderTitle = (title) => {
    return (
      <CustomText fontWeight={fontWeights.MEDIUM} style={styles.text}>
        {title}
      </CustomText>
    );
  };

  return (
    <View style={[styles.cardContainer, themeStyle.cardBackground]}>
      <View style={styles.titleRow}>
        <CustomText fontWeight={fontWeights.MEDIUM} style={[styles.cardTitle, themeStyle.text]}>
          {t('arrest_information')}
        </CustomText>
        {!hideEdit && <EditIcon onPress={editPersonalInfo} />}
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          disabled={!imageUrl}
          onPress={() => openImageViewer(imageUrl)}
          style={styles.suspectImage}
        >
          {renderProfileImage}
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <CustomText
            numberOfLines={2}
            fontWeight={fontWeights.MEDIUM}
            style={[themeStyle.text, styles.title]}
          >
            {name}
          </CustomText>
          {caseNumber?.length > 0 && (
            <CustomText numberOfLines={1} style={[themeStyle.text, styles.text]}>
              {caseNumber}
            </CustomText>
          )}
          <CustomText numberOfLines={1} style={[themeStyle.subText, styles.subText]}>
            {dateFormat(createdAt, caseNumber?.length > 0 ? 'hh:MM TT, dd mmmm yyyy' : 'dd/mm/yy')}
          </CustomText>
          <CustomText numberOfLines={2} style={[themeStyle.subText, styles.subText]}>
            {locationName}
          </CustomText>
        </View>
      </View>
      <View style={styles.row}>
        {renderHalfBox(t('gender'), renderGender)}
        {renderHalfBox(t('date_of_birth'), dob)}
      </View>
      <TouchableOpacity
        style={styles.textRow}
        onPress={() => setShowAdditionalInfo(!showAdditionalInfo)}
      >
        <CustomText fontWeight={fontWeights.MEDIUM} style={[styles.text, themeStyle.text]}>
          {t('additional_details')}
        </CustomText>
        <View style={styles.downArrow}>
          <Down color={colors.PRIMARY_TEXT} />
        </View>
      </TouchableOpacity>
      {showAdditionalInfo && null}
      {!isIdRefused && (
        <>
          {renderTitle(t('id_card'))}
          <View style={[styles.IdContainer, themeStyle.background]}>
            <View style={styles.textRow}>
              <View style={styles.documentIcon}>
                <DocumentIcon color={colors.PRIMARY_TEXT} />
              </View>
              <CustomText style={[themeStyle.text, styles.text]}>
                {proofDocument?.documentName}
              </CustomText>
            </View>
            <TouchableOpacity
              disabled={!(proofDocument?.documentLocalUrl || proofDocument?.documentKey)}
              onPress={() =>
                openImageViewer(proofDocument?.documentLocalUrl || proofDocument?.documentKey)
              }
              style={styles.idImage}
            >
              {renderIDImage}
            </TouchableOpacity>
          </View>
        </>
      )}
      <View style={styles.column}>
        {renderTitle(t('criminal_offense'))}
        <CustomText numberOfLines={2} style={styles.text}>
          {criminalOffence || '-'}
        </CustomText>
      </View>
      <View style={styles.column}>
        {renderTitle(t('circumstances'))}
        <VoicePlayer
          style={styles.voicePlayer}
          audioUrl={
            circumstanceRecording?.mediaLocalUrl ||
            circumstanceRecording?.mediaKey ||
            circumstanceRecording?.documentKey
          }
        />
        <CustomText numberOfLines={4} style={[styles.text, themeStyle.text]}>
          {circumstance || '-'}
        </CustomText>
      </View>
      <View style={styles.column}>
        <CustomText fontWeight={fontWeights.MEDIUM} style={styles.text}>
          {t('detainee_declaration')}
        </CustomText>
        <CustomText numberOfLines={2} style={styles.text}>
          {t(`${detaineeDeclaration?.label || 'does_not_want_lawyer'}`)}
        </CustomText>
      </View>
      <View style={styles.row}>
        {renderHalfBox(t('name_of_lawyer'), lawyerName)}
        {renderHalfBox(t('telephone_number'), telephoneNumber)}
      </View>
    </View>
  );
};

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
    marginBottom: '16@vs'
  },
  cardTitle: {
    fontSize: '16@ms0.3',
    fontWeight: '600'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: '12@vs'
  },
  textContainer: {
    marginLeft: '12@s',
    flex: 1
  },
  text: {
    fontSize: '14@ms0.3',
    paddingTop: '5@vs'
  },
  subText: {
    fontSize: '12@ms0.3',
    paddingTop: '5@vs'
  },
  suspectImage: {
    width: '90@ms0.3',
    height: '90@ms0.3',
    borderRadius: '12@s',
    overflow: 'hidden',
    backgroundColor: '#E5E5E5'
  },
  title: {
    fontSize: '18@ms0.3',
    fontWeight: '600'
  },
  half: {
    width: '50%'
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '12@vs'
  },
  downArrow: {
    marginLeft: '5@s',
    marginTop: '7@vs'
  },
  IdContainer: {
    marginBottom: '10@vs',
    marginTop: '10@vs',
    padding: '12@s',
    borderRadius: '8@s'
  },
  idImage: {
    width: '100%',
    height: '80@s',
    borderRadius: '5@s',
    overflow: 'hidden',
    backgroundColor: '#E5E5E5'
  },
  documentIcon: {
    marginRight: '10@s',
    marginTop: '5@vs'
  },
  smallText: {
    fontSize: '10@ms0.3',
    paddingTop: '6@vs',
    textTransform: 'uppercase'
  },
  column: {
    flexDirection: 'column',
    marginBottom: '8@vs'
  },
  voicePlayer: {
    marginBottom: '4@vs',
    marginTop: '8@vs'
  }
});

export default ArrestInformationCard;
