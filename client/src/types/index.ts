import {StyleProp, TextStyle} from 'react-native';

import {FC} from 'react';
import {User} from './graphql';

export enum MessageType {
  Message,
  Photo,
  File,
}

export interface Friend extends User {
  isFriend?: boolean;
  friendSince: Date;
}

interface IconProps {
  style?: StyleProp<TextStyle>;
  width?: number | string;
  height?: number | string;
  children?: never;
}

export type IconType = FC<IconProps>;

export enum ThemeType {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}
