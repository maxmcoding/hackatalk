import {Animated, Dimensions, Image} from 'react-native';
import PinchZoom, {PinchZoomRef} from '../uis/PinchZoom';
import React, {FC, memo, useCallback, useEffect, useLayoutEffect} from 'react';
import {
  RootStackNavigationProps,
  RootStackParamList,
} from '../navigations/RootStackNavigator';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';

import {SharedElement} from 'react-navigation-shared-element';
import {StatusBarBrightness} from 'dooboo-ui';
import styled from '@emotion/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.background};
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const ImageSliderContainer = styled.View`
  flex: 1;
  max-width: ${(): number => Dimensions.get('screen').width}px;
  justify-content: center;
`;

const ImageSlider: FC = () => {
  const navigation = useNavigation<RootStackNavigationProps<'ImageSlider'>>();

  const {
    params: {images, initialIndex = 0},
  } = useRoute<RouteProp<RootStackParamList, 'ImageSlider'>>();

  const [currentIndex, setCurrentIndex] = React.useState<number>(initialIndex);
  const insets = useSafeAreaInsets();
  const imageContainerWidth = Dimensions.get('screen').width;

  const imageContainerHeight =
    Dimensions.get('screen').height - insets.top - insets.bottom;

  const imageStyle = {
    width: imageContainerWidth,
    bottom: 0,
    height: imageContainerHeight,
  };

  const imageGap = 10;

  const animValues = React.useRef({
    scale: 1,
    x: 0,
    y: 0,
    nextTranslateX: 0,
    prevTranslateX: 0,
  }).current;

  const pinchZoom = React.useRef<PinchZoomRef>(null);
  const nextImageTranslateX = React.useRef(new Animated.Value(0)).current;
  const prevImageTranslateX = React.useRef(new Animated.Value(0)).current;

  const translateOtherImages = React.useCallback(() => {
    animValues.nextTranslateX =
      ((animValues.scale - 1) * imageContainerWidth) / 2 + animValues.x;

    animValues.prevTranslateX =
      ((1 - animValues.scale) * imageContainerWidth) / 2 + animValues.x;

    nextImageTranslateX.setValue(animValues.nextTranslateX);
    prevImageTranslateX.setValue(animValues.prevTranslateX);
  }, [
    imageContainerWidth,
    animValues,
    nextImageTranslateX,
    prevImageTranslateX,
  ]);

  const onRelease = useCallback(() => {
    const moveNext = animValues.nextTranslateX < -imageContainerWidth / 2;
    const movePrev = animValues.prevTranslateX > imageContainerWidth / 2;
    const targetTranslate = pinchZoom.current?.animatedValue.translate;

    if (moveNext && currentIndex < images.length - 1 && targetTranslate) {
      Animated.timing(targetTranslate, {
        toValue: {
          x: (-(animValues.scale + 1) / 2) * imageContainerWidth,
          y: animValues.y,
        },
        useNativeDriver: true,
        duration: 300,
      }).start(() => {
        setCurrentIndex(currentIndex + 1);
      });
    } else if (movePrev && currentIndex > 0 && targetTranslate) {
      Animated.timing(targetTranslate, {
        toValue: {
          x: ((animValues.scale + 1) / 2) * imageContainerWidth,
          y: animValues.y,
        },
        useNativeDriver: true,
        duration: 300,
      }).start(() => {
        nextImageTranslateX.setValue(0);
        prevImageTranslateX.setValue(0);
        setCurrentIndex(currentIndex - 1);
      });
    } else if (animValues.nextTranslateX < 0 && targetTranslate) {
      Animated.timing(targetTranslate, {
        toValue: {
          x: ((1 - animValues.scale) * imageContainerWidth) / 2,
          y: animValues.y,
        },
        useNativeDriver: true,
        duration: 300,
      }).start(() => {
        pinchZoom.current?.setValues({
          translate: {
            x: ((1 - animValues.scale) * imageContainerWidth) / 2,
            y: animValues.y,
          },
        });
      });
    } else if (animValues.prevTranslateX > 0 && targetTranslate) {
      Animated.timing(targetTranslate, {
        toValue: {
          x: ((animValues.scale - 1) * imageContainerWidth) / 2,
          y: animValues.y,
        },
        useNativeDriver: true,
        duration: 300,
      }).start(() => {
        pinchZoom.current?.setValues({
          translate: {
            x: ((animValues.scale - 1) * imageContainerWidth) / 2,
            y: animValues.y,
          },
        });
      });
    }
  }, [
    currentIndex,
    imageContainerWidth,
    animValues.nextTranslateX,
    animValues.prevTranslateX,
    animValues.scale,
    animValues.y,
    images.length,
    nextImageTranslateX,
    prevImageTranslateX,
  ]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: images[currentIndex]?.sender || '',
    });
  }, [currentIndex, images, navigation]);

  useEffect(() => {
    pinchZoom.current?.setValues({scale: 1, translate: {x: 0, y: 0}});
    nextImageTranslateX.setValue(0);
    prevImageTranslateX.setValue(0);
  }, [nextImageTranslateX, prevImageTranslateX]);

  return (
    <Container>
      <StatusBarBrightness />
      <ImageSliderContainer>
        {currentIndex > 0 ? (
          <PinchZoom
            key={`${currentIndex - 1}`}
            style={{
              position: 'absolute',
              width: imageContainerWidth,
              left: -imageContainerWidth - imageGap,
              top: 0,
              bottom: 0,
              justifyContent: 'center',
              // @ts-ignore
              transform: [{translateX: prevImageTranslateX}],
            }}
          >
            <Image
              source={{uri: images[currentIndex - 1]?.uri as string}}
              style={imageStyle}
              resizeMode="contain"
            />
          </PinchZoom>
        ) : null}
        <PinchZoom
          key={`${currentIndex}`}
          ref={pinchZoom}
          onScaleChanged={(value): void => {
            animValues.scale = value;
            translateOtherImages();
          }}
          onTranslateChanged={(value): void => {
            animValues.x = value.x;
            animValues.y = value.y;
            translateOtherImages();
          }}
          onRelease={onRelease}
          allowEmpty={{x: true, y: true}}
          fixOverflowAfterRelease={false}
          style={{
            width: imageContainerWidth,
            justifyContent: 'center',
          }}
        >
          <SharedElement id={`${images[currentIndex]?.uri}`}>
            <Image
              source={{uri: images[currentIndex]?.uri as string}}
              style={imageStyle}
              resizeMode="contain"
            />
          </SharedElement>
        </PinchZoom>
        {currentIndex < images.length - 1 ? (
          <PinchZoom
            key={`${currentIndex + 1}`}
            style={{
              width: imageContainerWidth,
              position: 'absolute',
              top: 0,
              bottom: 0,
              justifyContent: 'center',
              left: imageContainerWidth + imageGap,
              // @ts-ignore
              transform: [{translateX: nextImageTranslateX}],
            }}
          >
            <Image
              source={{uri: images[currentIndex + 1]?.uri as string}}
              style={imageStyle}
              resizeMode="contain"
            />
          </PinchZoom>
        ) : null}
      </ImageSliderContainer>
    </Container>
  );
};

export default memo(ImageSlider);
