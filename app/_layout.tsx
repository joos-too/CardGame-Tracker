import { Tabs } from 'expo-router';
import React from 'react';
import {useColorScheme} from 'react-native';
import {TabBarIcon} from '@/components/TabBarIcon';
import {colors} from '@/constants/Colors';
import {DarkTheme, DefaultTheme, ThemeProvider} from "@react-navigation/native";

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const themeTextStyle = colorScheme === 'light' ? colors.lightThemeText : colors.darkThemeText;

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: themeTextStyle.color,
                    headerShown: false,
                }}>
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Tabelle',
                        tabBarIcon: ({color, focused}) => (
                            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color}/>
                        ),
                    }}
                />
                <Tabs.Screen
                    name="history"
                    options={{
                        title: 'Verlauf',
                        tabBarIcon: ({color, focused}) => (
                            <TabBarIcon name={focused ? 'time' : 'time-outline'} color={color}/>
                        ),
                    }}
                />
            </Tabs>
        </ThemeProvider>
    );
}
