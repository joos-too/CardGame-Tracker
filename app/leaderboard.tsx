import React, {useState} from "react";
import {View, Text, useColorScheme, ActivityIndicator, FlatList, Modal, TouchableWithoutFeedback, Share} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useFocusEffect} from "@react-navigation/native";
import {Appbar, Provider as PaperProvider, IconButton, TextInput} from "react-native-paper";
import {Player} from "@/constants/Interfaces";
import {leaderboardStyles} from "@/constants/Styles";
import {themeColors, colors, playerColors} from "@/constants/Colors";
import BorderedText from "@/components/BorderedText";
import HistoryChart from "@/components/HistoryChart";

export default function History() {
    const colorScheme = useColorScheme();
    const themedText = colorScheme === "light" ? themeColors.light.text : themeColors.dark.text;
    const themedInput = colorScheme === "light" ? themeColors.light.input : themeColors.dark.input;
    const themeContainer = colorScheme === "light" ? themeColors.light.container : themeColors.dark.container;

    const [items, setItems] = useState<Player[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

    useFocusEffect(
        React.useCallback(() => {
            const loadItems = async () => {
                try {
                    const savedItems = await AsyncStorage.getItem("players");
                    if (savedItems) {
                        const players: Player[] = JSON.parse(savedItems);
                        players.sort((a, b) => {
                            const lastValueA = a.totalValue[a.totalValue.length - 1] || 0;
                            const lastValueB = b.totalValue[b.totalValue.length - 1] || 0;
                            return lastValueB - lastValueA;
                        });
                        setItems(players);
                    }
                } catch (error) {
                    console.error("Fehler beim Laden der Daten:", error);
                } finally {
                    setLoading(false);
                }
            };
            loadItems();
        }, [])
    );

    const closeModal = () => {
        setModalVisible(false);
        setSelectedPlayer(null);
    };

    const shareStats = async () => {
        const stats = items.map(item =>
            `${item.name ? item.name : "Spieler"}: ${item.totalValue[item.totalValue.length - 1]}`).join("\n");
        await Share.share({message: stats})
    };

    const totalValueLength = items[0]?.totalValue.length || 0;
    const labels = Array.from({length: totalValueLength}, (_, index) => index.toString());
    const datasets = items.map((item, index) => ({
        data: item.totalValue,
        color: (opacity = 1) => playerColors[index % playerColors.length],
    }));

    const playerDataChart = selectedPlayer
        ? { labels: labels, datasets: [{ data: selectedPlayer.totalValue, color: (opacity = 1) => playerColors[items.indexOf(selectedPlayer) % playerColors.length] }] }
        : { labels: [], datasets: [] };

    const renderPlayerStats = ({item, index}: { item: number; index: number }) => {
        const previousValue = index > 0 ? (selectedPlayer as Player).totalValue[index - 1] : 0;
        const difference = item - previousValue;
        const formattedDifference = difference !== 0 ? (difference >= 0 ? `+${difference}` : difference.toString()) : null;

        return (
            <View style={[leaderboardStyles.listElement, themedInput, {borderRadius: 10, padding: 7, marginHorizontal: 10}]}>
                <Text style={[{fontSize: 25, paddingLeft: 5}, themedText]}>{`Runde: ${index}`}</Text>
                <View style={leaderboardStyles.leftContainer}>
                    <Text style={[{marginRight: 8, fontSize: 15}, themedText]}>{formattedDifference}</Text>
                    <BorderedText
                        style={{fontSize: 20, width: 75,
                            color: playerColors[items.indexOf(selectedPlayer as Player) % playerColors.length]
                            }}
                        value={item.toString()}/>
                </View>
            </View>
        );
    };

    const renderPlayer = ({ item }: { item: Player }) => {
        const uniqueValues = Array.from(new Set(items.map(i => i.totalValue[i.totalValue.length - 1])));
        const topValues = uniqueValues.sort((a, b) => b - a).slice(0, 3);
        let borderColor = "";

        const currentPlayerValue = item.totalValue[item.totalValue.length - 1];
        if (item.totalValue.length > 1) {
            if (topValues[0] === currentPlayerValue) {
                borderColor = colors.gold.borderColor;
            } else if (topValues[1] === currentPlayerValue) {
                borderColor = colors.silver.borderColor;
            } else if (topValues[2] === currentPlayerValue) {
                borderColor = colors.bronze.borderColor;
            }
        }

        return (
            <View style={leaderboardStyles.listElement}>
                <TextInput
                    style={leaderboardStyles.nameField}
                    mode="outlined"
                    editable={false}
                    textColor={playerColors[items.indexOf(item) % playerColors.length]}>
                    {item.name !== "" ? item.name : "Spieler"}
                </TextInput>
                <View style={leaderboardStyles.leftContainer}>
                    <IconButton
                        style={leaderboardStyles.statsButton}
                        mode="contained"
                        iconColor={playerColors[items.indexOf(item) % playerColors.length]}
                        icon="chart-bell-curve-cumulative"
                        onPress={() => {
                            setSelectedPlayer(item);
                            setModalVisible(true);
                        }}
                    />
                    <BorderedText
                        style={[
                            leaderboardStyles.totalField,
                            borderColor !== "" ? { color: borderColor, borderColor: borderColor } : {}
                        ]}
                        value={currentPlayerValue.toString()}
                    />
                </View>
            </View>
        );
    };

    return (
        <PaperProvider>
            <Appbar.Header>
                <Appbar.Content title="Leaderboard"/>
                <Appbar.Action icon="share-variant" onPress={shareStats}/>
            </Appbar.Header>
            <View style={[leaderboardStyles.container, themeContainer]}>
                {loading ? (
                    <ActivityIndicator
                        style={leaderboardStyles.buffer}
                        size="large"
                    />
                ) : (
                    <>
                        <View style={leaderboardStyles.chart}>
                            <HistoryChart
                                data={{labels: labels, datasets: datasets}}
                                shadow={false}
                            />
                        </View>
                        <FlatList
                            data={items}
                            renderItem={renderPlayer}
                            keyExtractor={(item) => item.id}
                        />
                    </>
                )}
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}>
                <View style={leaderboardStyles.modalContainer}>
                    {selectedPlayer && (
                        <>
                            <View style={leaderboardStyles.modalCloseButton}>
                                <IconButton
                                    onPress={closeModal}
                                    icon="close"/>
                            </View>
                            <TouchableWithoutFeedback onPress={closeModal}>
                                <View style={leaderboardStyles.chart}>
                                    <Text
                                        style={[leaderboardStyles.modalTitle, { color: playerColors[items.indexOf(selectedPlayer) % playerColors.length] }]}>
                                        {selectedPlayer.name !== "" ? selectedPlayer.name : "Spieler"}
                                    </Text>
                                    <HistoryChart data={playerDataChart}/>
                                </View>
                            </TouchableWithoutFeedback>
                            <FlatList
                                data={selectedPlayer?.totalValue}
                                renderItem={renderPlayerStats}
                            />
                        </>
                    )}
                </View>
            </Modal>
        </PaperProvider>
    );
}