import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
    topContainer: {
        flex: 1,
        padding: 10,
        paddingBottom: 100,
    },
    bottomContainer: {
    },
    listItem: {
        flexDirection: "row",
        alignItems: "flex-end",
        marginBottom: 15,
    },
    nameField: {
        flex: 1,
        marginRight: 4,
        borderWidth: 1,
        borderRadius: 5,
        height: 50,
    },
    activeNameField: {
        borderWidth: 1,
        borderRadius: 5,
        borderTopWidth: 1,
        borderColor: "#6200ee",
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
        fontSize: 30,
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
        borderRadius: 5,
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
        marginLeft: "auto",
        height: 50,
        width: 50,
        right: 16,
        bottom: 16,
    },
    floatingButton: {
        position: "absolute",
        right: 16,
        bottom: 16,
        borderRadius: 15,
        height: 70,
        width: 70,
        backgroundColor: "#6200ee",
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