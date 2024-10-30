import {StyleSheet} from "react-native";


export const styles = StyleSheet.create({
    //start list-items//
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
        width: 55,
        height: 55,
        marginLeft: 4,
        fontSize: 25,
    },
    //end list-items//

    container: {
        flex: 1,
        padding: 10,
    },
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