import {Stack, useRouter} from "expo-router";
import React from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {Pressable, useColorScheme} from "react-native";
import {themeColors} from "@/constants/Colors";

export default function Layout() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const themeText = colorScheme === "light" ? themeColors.light.text : themeColors.dark.text;

    return (
        <Stack>
            <Stack.Screen name="index" options={{
                headerShown: true, headerTitle: "Cabo",
                headerLeft: ({tintColor}) => (
                    <Pressable
                        accessibilityLabel="Zurück"
                        hitSlop={10}
                        onPress={() => router.back()}
                        style={{paddingLeft: 4, paddingRight: 12}}
                    >
                        <MaterialCommunityIcons name="arrow-left" size={24} color={tintColor ?? themeText.color}/>
                    </Pressable>
                ),
            }}/>
            <Stack.Screen name="rules" options={{
                headerShown: true, headerTitle: "Cabo Anleitung",
                headerLeft: ({tintColor}) => (
                    <Pressable
                        accessibilityLabel="Zurück"
                        hitSlop={10}
                        onPress={() => router.back()}
                        style={{paddingLeft: 4, paddingRight: 12}}
                    >
                        <MaterialCommunityIcons name="arrow-left" size={24} color={tintColor ?? themeText.color}/>
                    </Pressable>
                ),
            }}/>
        </Stack>
    )

}