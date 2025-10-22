import React, {useLayoutEffect} from "react";
import {Image, ImageSourcePropType, ScrollView, StyleSheet, View, useColorScheme} from "react-native";
import {Card, Text, useTheme} from "react-native-paper";
import {useRouter} from "expo-router";
import {generalStyles} from "@/constants/Styles";
import {themeColors} from "@/constants/Colors";
import {useNavigation} from "@react-navigation/native";

export default function Start() {
    const colorScheme = useColorScheme();
    const themeContainer =
        colorScheme === "light" ? themeColors.light.container : themeColors.dark.container;
    const navigation = useNavigation();
    const router = useRouter();
    const theme = useTheme();
    const cardBackground = theme.colors.surfaceVariant ?? theme.colors.surface;

    const trackerOptions: Array<{
        title: string;
        subtitle: string;
        href: string;
        image: ImageSourcePropType;
    }> = [
        {
            title: "Cabo Tracker",
            subtitle: "Verwalte Runden und Punktestände für Cabo.",
            href: "/(cabo)/(tracker)",
            image: require("../assets/images/cabo.jpg"),
        },
        {
            title: "Fahrstuhl Tracker",
            subtitle: "Behalte die Übersicht über angesagte Stiche und Punktzahlen in Fahrstuhl.",
            href: "/(fahrstuhl)/(tracker)",
            image: require("../assets/images/fahrstuhl.jpg"),
        },
    ];

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "Cardgame Tracker",
            headerLeft: () => (
                <Image
                    source={require("../assets/images/adaptive-icon.png")}
                    style={[
                        styles.logo,
                        colorScheme === "dark" ? {tintColor: themeColors.dark.text.color} : null,

                    ]}
                    resizeMode="contain"
                />
            ),
        });
    }, [navigation, colorScheme]);

    return (
        <View style={[generalStyles.container, themeContainer]}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {trackerOptions.map((tracker) => (
                    <Card
                        key={tracker.href}
                        mode="contained"
                        style={[styles.card, {backgroundColor: cardBackground}]}
                        onPress={() => router.push(tracker.href)}
                    >
                        <Card.Cover source={tracker.image} style={styles.cover}/>
                        <Card.Content>
                            <Text variant="titleLarge" style={[styles.cardTitle, {color: theme.colors.primary}]}>
                                {tracker.title}
                            </Text>
                            <Text variant="bodyMedium" style={styles.cardSubtitle}>
                                {tracker.subtitle}
                            </Text>
                        </Card.Content>
                    </Card>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        paddingHorizontal: 24,
        paddingVertical: 32,
    },
    card: {
        marginBottom: 24,
        borderRadius: 24,
        overflow: "hidden",
        elevation: 3,
    },
    cover: {
        height: 180,
    },
    cardTitle: {
        marginTop: 8,
        marginBottom: 4,
    },
    cardSubtitle: {
        opacity: 0.7,
    },
    sectionTitle: {
        marginBottom: 16,
        fontWeight: "600",
    },
    logo: {
        width: 48,
        height: 48,
        marginLeft: 0,
    },
});
