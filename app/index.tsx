import React, { useLayoutEffect } from "react";
import { View, useColorScheme } from "react-native";
import { Button } from "react-native-paper";
import { Link } from "expo-router";
import { generalStyles } from "@/constants/Styles";
import { themeColors } from "@/constants/Colors";
import { useNavigation } from "@react-navigation/native";

export default function Start() {
  const colorScheme = useColorScheme();
  const themeContainer = colorScheme === "light" ? themeColors.light.container : themeColors.dark.container;
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: "Tracker auswählen" });
  }, [navigation]);
  return (
    <View style={[generalStyles.container, themeContainer, { padding: 24, gap: 16 }] }>
      <Link href="/(cabo)" asChild>
        <Button mode="contained" icon="cards">Cabo Tracker</Button>
      </Link>
      <Link href="/(fahrstuhl)" asChild>
        <Button mode="contained" icon="elevator">Fahrstuhl Tracker</Button>
      </Link>
    </View>
  );
}
