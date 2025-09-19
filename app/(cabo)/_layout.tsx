import { Tabs } from "expo-router";
import React from "react";
import {useColorScheme} from "react-native";
import {TabBarIcon} from "@/components/TabBarIcon";
import {themeColors} from "@/constants/Colors";
import {DarkTheme, DefaultTheme, ThemeProvider} from "@react-navigation/native";

export default function CaboTabLayout() {
    const colorScheme = useColorScheme();
    const themeText = colorScheme === "light" ? themeColors.light.text : themeColors.dark.text;

    return (
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: themeText.color,
                    headerShown: false,
                }}>
                <Tabs.Screen
                    name="index"
                    options={{
                        title: "Tabelle",
                        tabBarIcon: ({color, focused}) => (
                            <TabBarIcon name={focused ? "table" : "table-border"} color={color}/>
                        ),
                    }}
                />
                <Tabs.Screen
                    name="leaderboard"
                    options={{
                        title: "Leaderboard",
                        tabBarIcon: ({color, focused}) => (
                            <TabBarIcon name={focused ? "chart-box" : "chart-box-outline"} color={color}/>
                        ),
                    }}
                />
            </Tabs>
        </ThemeProvider>
    );
}
