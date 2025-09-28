// declarations.d.ts

declare module "*.png" {
  const value: any;
  export = value;
}

declare module "*.jpg" {
  import { ImageSourcePropType } from "react-native";
  const content: ImageSourcePropType;
  export = content;
}

declare module "react-native-vector-icons/FontAwesome5" {
  import { TextProps } from "react-native";
  import React from "react";
  export interface FontAwesome5IconProps extends TextProps {
    name: string;
    size?: number;
    color?: string;
  }
  const FontAwesome5: React.FC<FontAwesome5IconProps>;
  export default FontAwesome5;
}

declare module 'react-native-vector-icons/MaterialCommunityIcons' {
  import { Icon } from 'react-native-vector-icons/Icon';
  const MaterialCommunityIcons: any;
  export default MaterialCommunityIcons;
}


