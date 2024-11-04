import {Dimensions, StyleSheet} from "react-native";

export const generalStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
})

export const listStyles = StyleSheet.create({
    listRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 15
    },
    row: {
        flexDirection: "row",
        alignItems: "center"
    },
})

export const indexStyles = StyleSheet.create({
    totalBetView: {
        flex: 1.75,
        alignItems: "center",
    },
    totalBetText: {
        fontWeight: "bold",
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

    //list-items//
    innerListItem: {
        marginHorizontal: 4,
    },
    nameField: {
        flex: 1,
        marginRight: 4,
        borderWidth: 1,
        borderRadius: 6,
    },
    valueButton: {
        borderRadius: 10,
    },
    totalField: {
        flex: 0.75,
        height: 55,
        marginLeft: 4,
        fontSize: 25,
    },

    //modal-styles//
    modalItem: {
        marginVertical: 5
    },
    modalTopRow: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    modalValueField: {
        flex: 1,
    }
})

export const leaderboardStyles = StyleSheet.create({
    chart: {
        alignItems: "center",
        marginBottom: 15
    },
    buffer: {
        paddingVertical: 110
    },

    //list-items//
    statsContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    contrastBubble: {
        borderRadius: 10,
        padding: 7,
    },
    statsButton: {
        marginLeft: 8,
        borderRadius: 10,
        width: 45,
        height: 45,
    },
    placementText: {
        fontSize: 25,
        fontWeight: "bold",
        width: 50
    },
    playerName: {
        fontSize: 25,
        fontWeight: "bold",
        marginLeft: 10
    },
    totalField: {
        marginLeft: 4,
        fontSize: 25,
        width: 75,
        height: 55,
    },

    //modal-styles//
    modalContainer: {
        height: Dimensions.get("window").height,
        padding: 10,
        paddingTop: 75,
        backgroundColor: "rgba(0,0,0,0.9)",
    },
    modalCloseButton : {
        position: "absolute",
        top: 20,
        right: 20,
    },
    modalTitle: {
        fontSize: 30,
        marginBottom: 16,
    },
})