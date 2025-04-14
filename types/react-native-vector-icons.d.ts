declare module 'react-native-vector-icons' {
  export { default as MaterialIcons } from 'react-native-vector-icons/MaterialIcons';
  export { default as AntDesign } from 'react-native-vector-icons/AntDesign';
  export { default as Feather } from 'react-native-vector-icons/Feather';
  export { default as Octicons } from 'react-native-vector-icons/Octicons';
}

declare module 'react-native-vector-icons/MaterialIcons' {
  import { Component } from 'react';
  import { TextProps } from 'react-native';

  interface IconProps extends TextProps {
    name: string;
    size?: number;
    color?: string;
  }

  class Icon extends Component<IconProps> {}
  export default Icon;
}

declare module 'react-native-vector-icons/AntDesign' {
  import { Component } from 'react';
  import { TextProps } from 'react-native';

  interface IconProps extends TextProps {
    name: string;
    size?: number;
    color?: string;
  }

  class Icon extends Component<IconProps> {}
  export default Icon;
}

declare module 'react-native-vector-icons/Feather' {
  import { Component } from 'react';
  import { TextProps } from 'react-native';

  interface IconProps extends TextProps {
    name: string;
    size?: number;
    color?: string;
  }

  class Icon extends Component<IconProps> {}
  export default Icon;
}

declare module 'react-native-vector-icons/Octicons' {
  import { Component } from 'react';
  import { TextProps } from 'react-native';

  interface IconProps extends TextProps {
    name: string;
    size?: number;
    color?: string;
  }

  class Icon extends Component<IconProps> {}
  export default Icon;
} 