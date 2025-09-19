import {Stack} from "expo-router";
import React from "react";
import {useColorScheme} from "react-native";
import {DarkTheme, DefaultTheme, ThemeProvider} from "@react-navigation/native";
import {MD3DarkTheme, MD3LightTheme, PaperProvider} from "react-native-paper";

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const paperTheme = colorScheme === "dark" ? MD3DarkTheme : MD3LightTheme;
    const navTheme = colorScheme === "dark" ? DarkTheme : DefaultTheme;
    return (
        <PaperProvider theme={paperTheme}>
            <ThemeProvider value={navTheme}>
                <Stack>
                    <Stack.Screen name="index" options={{headerShown: true}}/>
                    <Stack.Screen name="(cabo)" options={{headerShown: false}}/>
                    <Stack.Screen name="(fahrstuhl)" options={{headerShown: false}}/>
                </Stack>
            </ThemeProvider>
        </PaperProvider>
    );
}
