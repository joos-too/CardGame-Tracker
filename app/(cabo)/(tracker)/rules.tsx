import React from "react";
import {ScrollView, useColorScheme, View} from "react-native";
import {Text} from "react-native-paper";
import {themeColors} from "@/constants/Colors";

const sections = [
    {
        heading: "Ziel des Spiels",
        body: "Gewinnen!",
    },
];

export default function CaboRules() {
    const colorScheme = useColorScheme();
    const palette = themeColors[colorScheme === "light" ? "light" : "dark"];

    return (
        <ScrollView style={[{ flex: 1 }, palette.container]} contentContainerStyle={{ padding: 20, gap: 24 }}>
            <View style={{ gap: 16 }}>
                <Text variant="bodyMedium">
                    Diese Übersicht fasst die wichtigsten Regeln von Cabo zusammen und wie der Tracker zu benutzen ist.
                </Text>
            </View>

            {sections.map(section => (
                <View key={section.heading} style={{ gap: 8 }}>
                    <Text variant="titleMedium">{section.heading}</Text>
                    <Text variant="bodyMedium">{section.body}</Text>
                </View>
            ))}
        </ScrollView>
    );
}
