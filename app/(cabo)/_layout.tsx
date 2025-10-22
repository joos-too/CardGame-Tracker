import { Tabs } from "expo-router";
import React from "react";
import {useColorScheme} from "react-native";
import {TabBarIcon} from "@/components/TabBarIcon";
import {themeColors} from "@/constants/Colors";

export default function CaboTabLayout() {
    const colorScheme = useColorScheme();
    const themeText = colorScheme === "light" ? themeColors.light.text : themeColors.dark.text;

    return (
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: themeText.color,
                    headerShown: false,
                }}>
                <Tabs.Screen
                    name="(tracker)"
                    options={{
                        title: "Tabelle",
                        tabBarIcon: ({color, focused}) => (
                            <TabBarIcon name={focused ? "table" : "table-border"} color={color}/>
                        ),
                    }}
                />
                <Tabs.Screen
                    name="(leaderboard)"
                    options={{
                        title: "Leaderboard",
                        tabBarIcon: ({color, focused}) => (
                            <TabBarIcon name={focused ? "chart-box" : "chart-box-outline"} color={color}/>
                        ),
                    }}
                />
            </Tabs>
    );
}
