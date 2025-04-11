import { ActivityIndicator, Platform } from "react-native";
import { Button as ButtonUI, Colors, View } from "react-native-ui-lib";

import { ButtonProps } from "./types";

function Button(props: ButtonProps) {
  const {
    size = "large",
    variant = "default",
    inverted = false,
    disabled = false,
    width = "100%",
    link = false,
    icon = null,
    iconOnRight = false,
    active = false,
    loading = false,
    bgColor = "",
    ...rest
  } = props;

  const variants = {
    default: {
      text: Colors.gray800,
      button: {
        backgroundColor: Colors.gray300,
      },
      inverted: {
        button: {
          borderColor: Colors.gray200,
          borderWidth: 1,
          backgroundColor: "transparent",
        },
        text: Colors.gray800,
        bg: {
          backgroundColor: "transparent",
        },
      },
      link: {
        text: Colors.gray900,
        bg: {
          backgroundColor: "transparent",
        },
      },
    },
    primary: {
      text: Colors.white,
      button: {
        backgroundColor: bgColor ? bgColor : Colors.blue600,
      },
      inverted: {
        button: {
          borderColor: disabled ? Colors.gray200 : Colors.blue500,
          borderWidth: 1,
          backgroundColor: Colors.blue50,
        },
        text: Colors.blue600,
        bg: {
          backgroundColor: "transparent",
        },
      },
      link: {
        text: Colors.blue600,
        bg: {
          backgroundColor: "transparent",
        },
      },
    },
    primaryContrast: {
      text: Colors.gray900,
      button: {
        borderWidth: 0,
        backgroundColor: Colors.white,
      },
      bg: {
        backgroundColor: "transparent",
      },
    },
    outline: {
      text: Colors.grey40,
      button: {
        backgroundColor: "transparent",
        borderColor: Colors.grey40,
        borderWidth: 1,
      },
    },
    filter: {
      text: Colors.gray900,
      button: {
        backgroundColor: "transparent",
        borderColor: Colors.gray200,
        borderWidth: 1,
      },
      inverted: {
        button: {
          borderColor: active ? Colors.blue500 : Colors.gray200,
          borderWidth: 1,
          backgroundColor: "transparent",
          paddingLeft: 12,
          paddingRight: icon ? 6 : 12,
          flex: 1,
        },
        text: active ? Colors.blue500 : Colors.gray900,
        bg: {
          backgroundColor: "transparent",
        },
      },
    },
    disabled: {
      bg: Colors.gray100,
      text: Colors.gray400,
      inverted: {
        button: {
          borderColor: Colors.gray200,
          borderWidth: 1,
        },
        text: Colors.gray400,
        bg: {
          backgroundColor: "transparent",
        },
      },
      link: {
        text: Colors.blue600,
      },
    },
    label: {
      fontFamily: variant === "default" ? "medium" : "bold",
      margin: 0,
      paddingRight: iconOnRight ? 8 : 0,
      textAlign: "center",
    },
    iOSLabel: {
      fontWeight: variant === "default" ? 500 : 700,
    },
    resetButton: {
      paddingVertical: 0,
      paddingHorizontal: 0,
      backgroundColor: "transparent",
    },
    base: {
      paddingVertical: size === "large" ? 16 : size === "medium" ? 12 : 8,
    },
  };

  const Icon = ({ icon }) => <View marginR-6>{icon}</View>;

  const buttonVariant = Object.keys(variants).includes(variant)
    ? variant
    : "default";

  const styleButton = inverted
    ? variants[buttonVariant]?.inverted.button
    : link
    ? variants.resetButton
    : disabled || loading
    ? variants.disabled.button
    : variants[buttonVariant].button;

  return (
    <ButtonUI
      disabledBackgroundColor={variants.disabled.bg}
      color={
        disabled || loading
          ? variants.disabled.text
          : inverted
          ? variants[buttonVariant].inverted.text
          : link
          ? variants[buttonVariant].link.text
          : disabled
          ? variants.disabled.text
          : variants[buttonVariant].text
      }
      style={[variants.base, styleButton]}
      labelStyle={[
        variants.label,
        Platform.OS === "ios" ? variants.iOSLabel : "",
      ]}
      br30
      labelProps={{
        adjustsFontSizeToFit: false,
        allowFontScaling: false,
        numberOfLines: 1,
        minimumFontScale: 1,
      }}
      enableShadow={false}
      iconOnRight={iconOnRight}
      iconSource={() => icon && <Icon icon={icon} />}
      size={size}
      {...rest}
      disabled={disabled || loading}
    >
      {loading && (
        <View marginR-10>
          <ActivityIndicator animating color={Colors.gray300} />
        </View>
      )}
    </ButtonUI>
  );
}

export default Button;
