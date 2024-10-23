import {StyleSheet} from "react-native";


export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    listItem: {
        flexDirection: "row",
        alignItems: "flex-end",
        marginBottom: 15,
    },
    nameField: {
        flex: 1,
        marginRight: 4,
    },
    valuesContainer: {
        flexDirection: "row",
    },
    box: {
        width: 50,
        marginHorizontal: 4,
    },
    valueField: {
        borderWidth: 1,
        borderRadius: 5,
        fontSize: 30,
        height: 50,
    },
    activeField: {
        borderColor: "#6200ee",
    },
    buttonContainer: {
        flexDirection: "row",
        marginRight: 4,

    },
    valueButton: {
        borderRadius: 10,
        marginHorizontal: 4
    },
    totalText: {
        borderRadius: 5,
        fontSize: 19,
        fontWeight: "bold"
    },
    editControls: {
        justifyContent: "center",
    },
    editButton: {
        marginLeft: "auto",
        height: 50,
        width: 50
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