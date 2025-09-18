import React from "react";
import { View, useColorScheme } from "react-native";
import { Provider as PaperProvider, Appbar, Button } from "react-native-paper";
import { Link } from "expo-router";
import { generalStyles } from "@/constants/Styles";
import { themeColors } from "@/constants/Colors";

export default function Start() {
  const colorScheme = useColorScheme();
  const themeContainer = colorScheme === "light" ? themeColors.light.container : themeColors.dark.container;
  return (
    <PaperProvider>
      <Appbar.Header>
        <Appbar.Content title="Tracker auswählen" />
      </Appbar.Header>
      <View style={[generalStyles.container, themeContainer, { padding: 24, gap: 16 }] }>
        <Link href="/(cabo)" asChild>
          <Button mode="contained" icon="cards">Cabo Tracker</Button>
        </Link>
        <Link href="/(aufzug)" asChild>
          <Button mode="contained" icon="elevator">Aufzug Tracker</Button>
        </Link>
      </View>
    </PaperProvider>
  );
}
