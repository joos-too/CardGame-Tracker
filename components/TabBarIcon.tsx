import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { type IconProps } from "@expo/vector-icons/build/createIconSet";
import { type ComponentProps } from "react";

export function TabBarIcon({ style, ...rest }: IconProps<ComponentProps<typeof MaterialCommunityIcons>["name"]>) {
    return (
        <MaterialCommunityIcons
            size={30}
            style={[{ marginBottom: -3 }, style]}
            {...rest}
        />
    );
}