import React from "react";
import {Text, StyleSheet, StyleProp, ViewStyle, useColorScheme} from "react-native";
import {colors} from "../constants/Colors";


interface BorderedTextProps {
    value: string;
    style?: StyleProp<ViewStyle>;
}

const BorderedText: React.FC<BorderedTextProps> = ({ value, style }) => {
    const colorScheme = useColorScheme();
    const themeTextStyle = colorScheme === "light" ? colors.lightThemeText : colors.darkThemeText;
    const backgroundColor = colorScheme === "light" ? colors.lightInputField : colors.darkInputField;

    return (
        <Text
            style={[custom.valueField, backgroundColor, themeTextStyle, style]}>
            {value}
        </Text>
    );
}

const custom = StyleSheet.create({
    valueField: {
        borderColor: "#6e6b73",
        borderWidth: 2,
        borderRadius: 10,
        width: 40,
        height: 40,
        textAlign: "center",
        textAlignVertical: "center",
        fontSize: 25,
        fontWeight: "bold",
    },
});

export default BorderedText;