import {StyleSheet} from "react-native";


export const styles = StyleSheet.create({
    //start list-items//
    container: {
        flex: 1,
        padding: 10,
    },
    listElement: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    innerListItem: {
        marginHorizontal: 4,
    },
    nameField: {
        flex: 1,
        marginRight: 4,
        borderWidth: 1,
    },
    valueButton: {
        borderRadius: 10,
    },
    totalField: {
        marginLeft: 4,
        fontSize: 19,
        fontWeight: "bold",
    },
    //end list-items//

    totalBetView: {
        flex: 1.75,
        alignItems: "center",
    },
    totalBetText: {
        fontSize: 35,
    },
    editPlayerButton: {
        position: "absolute",
        height: 50,
        width: 50,
        right: 15,
    },
    checkButton: {
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