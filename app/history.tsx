import React, {useState} from 'react';
import {
    View,
    Text,
    Dimensions,
    useColorScheme,
    ActivityIndicator,
    FlatList,
    ScrollView,
    Modal,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {LineChart} from 'react-native-chart-kit';
import {Appbar, Provider as PaperProvider, Button} from 'react-native-paper';
import {Player} from "@/constants/Interfaces";
import {styles} from "@/constants/Styles";
import {colors, playerColors} from "@/constants/Colors";
import BorderedText from "@/components/BorderedText";

export default function History() {
    const colorScheme = useColorScheme();
    const themeTextStyle = colorScheme === 'light' ? colors.lightThemeText : colors.darkThemeText;
    const themeContainerStyle = colorScheme === 'light' ? colors.lightContainer : colors.darkContainer;

    const [items, setItems] = useState<Player[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

    useFocusEffect(
        React.useCallback(() => {
            const loadItems = async () => {
                try {
                    const savedItems = await AsyncStorage.getItem('players');
                    if (savedItems) {
                        setItems(JSON.parse(savedItems));
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

    const totalValueLength = items[0]?.totalValue.length || 0;
    const labels = Array.from({length: totalValueLength}, (_, index) => index.toString());
    const datasets = items.map((item, index) => ({
        data: item.totalValue,
        color: (opacity = 1) => playerColors[index % playerColors.length],
    }));

    const renderItem = ({item, index}: { item: Player; index: number }) => (
        <View style={styles.listElement}>
            <Button
                style={{width: 100, marginRight: 4, borderWidth: 1, borderRadius: 6}}
                mode="outlined"
                textColor={playerColors[index % playerColors.length]}
                onPress={() => {
                    setSelectedPlayer(item);
                    setModalVisible(true);
                }}
            >
                <Text style={{fontWeight: "bold", fontSize: 15}}>
                    {item.name !== "" ? item.name : "Spieler"}
                </Text>
            </Button>
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            >
                {item.totalValue.map((value, idx) => (
                    <BorderedText
                        value={value.toString()}
                        key={idx}
                        style={[styles.innerListItem, {backgroundColor: playerColors[index % playerColors.length]}]}
                    />
                ))}
            </ScrollView>
        </View>
    );

    const closeModal = () => {
        setModalVisible(false);
        setSelectedPlayer(null);
    };

    const playerDataChart = selectedPlayer ? {
        labels: labels,
        datasets: [{
            data: selectedPlayer.totalValue,
            color: (opacity = 1) => playerColors[items.indexOf(selectedPlayer) % playerColors.length],
        }],
    } : {labels: [], datasets: []};

    return (
        <PaperProvider>
            <Appbar.Header>
                <Appbar.Content title="Verlauf"/>
            </Appbar.Header>
            <View style={[styles.container, themeContainerStyle]}>
                {loading ? (
                    <ActivityIndicator
                        style={{paddingVertical: 110}}
                        size="large"
                    />
                ) : (
                    <>
                        <LineChart
                            data={{labels: labels, datasets: datasets,}}
                            width={Dimensions.get("window").width * 0.95}
                            height={220}
                            withShadow={true}
                            chartConfig={{
                                backgroundGradientFrom: colorScheme === "light" ? "#6200ee" : "#1c1c1c",
                                backgroundGradientTo: colorScheme === "light" ? "#a91cf0" : "#1c1c1c",
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                propsForDots: {
                                    r: "4",
                                    strokeWidth: "1",
                                    stroke: colorScheme === "light" ? "#6200ee" : "#1c1c1c",
                                },
                            }}
                            bezier
                            style={{
                                marginVertical: 8,
                                paddingBottom: 3,
                                borderRadius: 16,
                            }}
                        />
                        <FlatList
                            data={items}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                        />
                    </>
                )}
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <TouchableWithoutFeedback onPress={closeModal}>
                    <View style={modalStyles.modalContainer}>
                        {selectedPlayer && (
                            <>
                                <Text style={modalStyles.modalTitle}>{selectedPlayer.name}</Text>
                                <LineChart
                                    data={playerDataChart}
                                    width={Dimensions.get("window").width * 0.95}
                                    height={220}
                                    chartConfig={{
                                        backgroundGradientFrom: colorScheme === "light" ? "#6200ee" : "#1c1c1c",
                                        backgroundGradientTo: colorScheme === "light" ? "#a91cf0" : "#1c1c1c",
                                        decimalPlaces: 0,
                                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                        propsForDots: {
                                            r: "4",
                                            strokeWidth: "1",
                                            stroke: colorScheme === "light" ? "#6200ee" : "#1c1c1c",
                                        },
                                    }}
                                    bezier
                                    style={modalStyles.modalChart}
                                />
                                <Button onPress={closeModal}>Schließen</Button>
                            </>
                        )}
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </PaperProvider>
    );
}

const modalStyles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        paddingTop: 110,
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.8)",
    },
    modalTitle: {
        fontSize: 20,
        color: 'white',
        marginBottom: 16,
    },
    modalChart: {
        marginVertical: 8,
        borderRadius: 16,
    },
});