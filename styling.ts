import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    listItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    nameField: {
        flex: 1,
        marginRight: 4,
        borderWidth: 1,
        height: 50,
    },
    activeNameField: {
        fontWeight: "bold"
    },
    valuesContainer: {
        flexDirection: "row",
    },
    valueField: {
        marginHorizontal: 4,
        height: 50,
        width: 50,
        borderWidth: 1,
        borderRadius: 5,
        fontSize: 25,
    },
    activeValueField: {
        borderColor: "#6200ee",
    },
    buttonContainer: {
        flexDirection: "row",
        marginRight: 4,
    },
    valueButton: {
        borderRadius: 10,
        marginHorizontal: 4,
    },
    totalText: {
        fontSize: 19,
        fontWeight: "bold",
    },
    totalBetView: {
        flex: 1.75,
        alignItems: "center",
        fontSize: 24,
    },
    totalBetText: {
        fontSize: 35,
    },
    editButton: {
        position: "absolute",
        marginLeft: "auto",
        height: 50,
        width: 50,
        right: 15,
    },
    floatingButton: {
        position: "absolute",
        backgroundColor: "#6200ee",
        borderRadius: 15,
        height: 70,
        width: 70,
        right: 15,
        bottom: 15,
    },
});

export const colors = StyleSheet.create({
    lightContainer: {
        backgroundColor: "#ffffff",
    },
    darkContainer: {
        backgroundColor: "#000000",
    },
    lightThemeText: {
        color: "#0a7ea4",
    },
    darkThemeText: {
        color: "#ffffff",
    },
});