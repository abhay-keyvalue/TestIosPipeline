import React from 'react';
import type {ImageProps, RegisteredStyle} from 'react-native';
import {Image, StyleSheet} from 'react-native';
interface CustomImageProps extends ImageProps {
  style?: RegisteredStyle<{[key: string]: string | number}>;
}

const CustomImage: React.FC<CustomImageProps> = ({style, ...props}) => {
  return <Image style={[styles.image, style]} {...props} />;
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#E5E5E5'
  }
});

export default CustomImage;
