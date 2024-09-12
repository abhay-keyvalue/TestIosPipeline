import React, {useMemo} from 'react';
import type {RegisteredStyle} from 'react-native';
import {TouchableOpacity, View} from 'react-native';
import {ScaledSheet} from 'react-native-size-matters';
import {useSelector} from 'react-redux';

import type {RootState} from '@src/store';
import {goBack, navigateTo} from '@navigation/navigationUtils';
import {fontWeights, hitSlop} from '@constants/general';
import {routes} from '@constants/labels';
import LanguageSelector from '@components/languageSelector';
import CustomImage from '@components/customImage';
import CustomText from '@components/customText';
import BackIcon from '@assets/svg/back.svg';
import Close from '@assets/svg/close.svg';

type HeaderProps = {
  title?: string;
  mainTitle?: string;
  showAvatar?: boolean;
  showBackButton?: boolean;
  showLanguageSelector?: boolean;
  showBadge?: boolean;
  badgeCount?: number;
  showCloseButton?: boolean;
  rightContainerItem?: React.ReactNode;
  mainTitleStyle?: RegisteredStyle<{fontSize: number; fontWeight: '600'}>;
  onClosePress?: () => void;
  onBackPress?: () => void;
};

const CustomHeader = ({
  title,
  showBackButton,
  showLanguageSelector,
  showAvatar,
  showBadge,
  badgeCount,
  mainTitle,
  showCloseButton,
  mainTitleStyle,
  rightContainerItem,
  onClosePress,
  onBackPress
}: HeaderProps) => {
  const {colors} = useSelector((state: RootState) => state.theme);
  const {profileData} = useSelector((state: RootState) => state.home);

  const themeStyle = {
    title: {
      color: colors?.PRIMARY_TEXT
    },
    badgeContainer: {
      backgroundColor: colors?.PRIMARY_TEXT
    },
    badgeCount: {
      color: colors?.PRIMARY_BACKGROUND
    }
  };

  const backButtonPress = () => {
    if (onBackPress) onBackPress();
    else goBack();
  };

  const goToProfile = () => {
    navigateTo(routes.PROFILE);
  };

  const showLeftContainer = useMemo(() => {
    return showBackButton || showAvatar || title || showBadge;
  }, [showBackButton, showAvatar, title, showBadge]);

  const showRightContainer = useMemo(() => {
    return showLanguageSelector || showCloseButton || rightContainerItem;
  }, [showLanguageSelector, showCloseButton]);

  const renderAvatar = useMemo(() => {
    return profileData?.avatar?.length > 0 && <CustomImage source={{uri: profileData?.avatar}} />;
  }, [profileData?.avatar]);

  const renderLeftContainer = () => {
    return (
      <View style={[styles.leftContainer]}>
        {showBackButton && (
          <TouchableOpacity hitSlop={hitSlop} style={styles.backButton} onPress={backButtonPress}>
            <BackIcon color={colors.PRIMARY_TEXT} />
          </TouchableOpacity>
        )}
        {showAvatar && (
          <TouchableOpacity style={styles.avatarIcon} hitSlop={hitSlop} onPress={goToProfile}>
            {renderAvatar}
          </TouchableOpacity>
        )}
        {title?.length > 0 && (
          <CustomText fontWeight={fontWeights.MEDIUM} style={[styles.title, themeStyle.title]}>
            {title}
          </CustomText>
        )}
        {showBadge && badgeCount > 0 && (
          <View style={[styles.badgeContainer, themeStyle.badgeContainer]}>
            <CustomText style={[styles.badgeCount, themeStyle.badgeCount]}>{badgeCount}</CustomText>
          </View>
        )}
      </View>
    );
  };

  const renderRightContainer = () => {
    return (
      <View style={[styles.rightContainer]}>
        {rightContainerItem}
        {showLanguageSelector && <LanguageSelector />}
        {showCloseButton && (
          <TouchableOpacity hitSlop={hitSlop} onPress={onClosePress}>
            <Close color={colors.PRIMARY_TEXT} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const middleContainer = () => {
    return (
      <View style={styles.middleContainer}>
        {mainTitle?.length > 0 && (
          <CustomText
            numberOfLines={2}
            fontWeight={fontWeights.MEDIUM}
            style={[styles.titleLarge, themeStyle.title, mainTitleStyle]}
          >
            {mainTitle}
          </CustomText>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {showLeftContainer && renderLeftContainer()}
      {mainTitle?.length > 0 && middleContainer()}
      {showRightContainer && renderRightContainer()}
    </View>
  );
};

const styles = ScaledSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '12@ms',
    width: '100%',
    height: '64@ms'
  },
  backButton: {
    paddingRight: '10@ms'
  },
  title: {
    fontSize: '20@ms0.3',
    fontWeight: '600',
    paddingRight: '7@ms'
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minWidth: '65@s',
    minHeight: '40@ms'
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minWidth: '65@s',
    minHeight: '40@ms'
  },
  middleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  titleLarge: {
    fontSize: '18@ms',
    fontWeight: '600',
    textAlign: 'center'
  },
  avatarIcon: {
    width: '40@ms',
    height: '40@ms',
    borderRadius: '20@ms',
    overflow: 'hidden',
    marginRight: '10@ms',
    justifyContent: 'center',
    alignItems: 'center'
  },
  badgeContainer: {
    borderRadius: '11@ms',
    height: '22@ms',
    paddingHorizontal: '6@s',
    justifyContent: 'center',
    alignItems: 'center'
  },
  badgeCount: {
    fontSize: '12@ms',
    fontWeight: '700'
  },
  flex: {
    flex: 1
  }
});

export default CustomHeader;
