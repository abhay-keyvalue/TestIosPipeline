import React from 'react';
import {View, Modal, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import {ScaledSheet} from 'react-native-size-matters';

import type {RootState} from '@src/store';
import {fontWeights} from '@constants/general';
import CustomText from '@components/customText';
import CustomButton from '@components/customButton';
import Close from '@assets/svg/close.svg';

type CustomPopupType = {
  visible: boolean;
  setVisible: (flag: boolean) => void;
  icon?: React.ReactNode;
  title: string;
  description?: string;
  onClose?: () => void;
  buttonProps?: {
    primaryButtonTitle?: string;
    secondaryButtonTitle?: string;
    primaryButtonAction?: () => void;
    secondaryButtonAction?: () => void;
  };
};

const CustomPopup = ({
  visible,
  setVisible,
  icon,
  title,
  description,
  buttonProps,
  onClose
}: CustomPopupType) => {
  const {colors} = useSelector((state: RootState) => state.theme);

  const themeStyle = {
    cardBackground: {
      backgroundColor: colors?.CARD_BACKGROUND
    },
    primary: {
      color: colors?.PRIMARY_COLOR
    }
  };

  const closePopup = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  return (
    <Modal animationType='slide' transparent={true} visible={visible} onRequestClose={closePopup}>
      <View style={styles.container}>
        <View style={[styles.content, themeStyle.cardBackground]}>
          <View style={styles.row}>
            <View>{icon}</View>
            <TouchableOpacity onPress={closePopup}>
              <Close color={colors.PRIMARY_TEXT} />
            </TouchableOpacity>
          </View>
          <View style={styles.textContainer}>
            {title?.length > 0 && <CustomText style={styles.title}>{title}</CustomText>}
            {description?.length > 0 && (
              <CustomText fontWeight={fontWeights.MEDIUM} style={styles.description}>
                {description}
              </CustomText>
            )}
          </View>
          <View style={styles.row}>
            {buttonProps?.secondaryButtonTitle?.length > 0 && (
              <CustomButton
                title={buttonProps?.secondaryButtonTitle}
                onPress={buttonProps?.secondaryButtonAction}
                style={styles.secondaryButton}
                textStyle={[styles.secondaryButtonText, themeStyle.primary]}
              />
            )}
            {buttonProps?.primaryButtonTitle?.length > 0 && (
              <CustomButton
                title={buttonProps?.primaryButtonTitle}
                onPress={buttonProps?.primaryButtonAction}
                style={styles.primaryButton}
                textStyle={styles.primaryButtonText}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = ScaledSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    zIndex: 2
  },
  content: {
    width: '90%',
    borderRadius: '10@s',
    padding: '15@s'
  },
  title: {
    fontSize: '20@s',
    fontWeight: '700',
    marginBottom: '12@s',
    marginTop: '8@vs'
  },
  description: {
    fontSize: '14@s',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  primaryButton: {
    flex: 1,
    height: '40@s'
  },
  primaryButtonText: {
    fontSize: '14@s',
    fontWeight: '600'
  },
  secondaryButton: {
    flex: 1,
    height: '40@s',
    backgroundColor: 'transparent'
  },
  secondaryButtonText: {
    fontSize: '14@s',
    fontWeight: '600'
  },
  textContainer :{
    marginBottom: '16@s'
  }
});

export default CustomPopup;
