import {Stack} from "expo-router";
import * as SystemUI from 'expo-system-ui';
import {StatusBar} from 'expo-status-bar';
import React from "react";
import {useColorScheme} from "react-native";
import {DarkTheme, DefaultTheme, ThemeProvider} from "@react-navigation/native";
import {MD3DarkTheme, MD3LightTheme, PaperProvider} from "react-native-paper";
import { DialogProvider } from "@/components/DialogProvider";

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const paperTheme = colorScheme === "dark" ? MD3DarkTheme : MD3LightTheme;
    const navTheme = colorScheme === "dark" ? DarkTheme : DefaultTheme;
    SystemUI.setBackgroundColorAsync(colorScheme === 'dark' ? 'dark' : 'white')
        .then(() => console.log('Successfully set System UI Background Color: ' + colorScheme));

    return (
        <PaperProvider theme={paperTheme}>
            <DialogProvider>
                <ThemeProvider value={navTheme}>
                    <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'}/>
                    <Stack>
                        <Stack.Screen name="index" options={{headerShown: true}}/>
                        <Stack.Screen name="(cabo)" options={{headerShown: false}}/>
                        <Stack.Screen name="(fahrstuhl)" options={{headerShown: false}}/>
                    </Stack>
                </ThemeProvider>
            </DialogProvider>
        </PaperProvider>
    );
}
