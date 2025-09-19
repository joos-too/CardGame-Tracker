import { Tabs, useRouter } from "expo-router";
import React from "react";
import {Pressable, useColorScheme} from "react-native";
import {TabBarIcon} from "@/components/TabBarIcon";
import {themeColors} from "@/constants/Colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function FahrstuhlTabLayout() {
    const colorScheme = useColorScheme();
    const router = useRouter();
    const themeText = colorScheme === "light" ? themeColors.light.text : themeColors.dark.text;

    return (
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: themeText.color,
                    headerShown: true,
                    headerTitle: "Fahrstuhl",
                    headerLeft: ({ tintColor }) => (
                        <Pressable
                            accessibilityLabel="Zu Cabo wechseln"
                            hitSlop={10}
                            onPress={() => router.replace("/(cabo)")}
                            style={{ paddingHorizontal: 12 }}
                        >
                            <MaterialCommunityIcons name="cards" size={24} color={tintColor ?? themeText.color} />
                        </Pressable>
                    ),
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
    );
}
