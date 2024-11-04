import React from "react";
import {Text, StyleSheet, StyleProp, useColorScheme} from "react-native";
import {themeColors} from "@/constants/Colors";


interface BorderedTextProps {
    value: string;
    style?: StyleProp<any>;
}

const BorderedText: React.FC<BorderedTextProps> = ({ value, style }) => {
    const colorScheme = useColorScheme();
    const themeText = colorScheme === "light" ? themeColors.light.text : themeColors.dark.text;
    const fieldBackgroundColor = colorScheme === "light" ? themeColors.light.input : themeColors.dark.input;

    return (
        <Text
            style={StyleSheet.flatten([custom.valueField, fieldBackgroundColor, themeText, style])}>
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