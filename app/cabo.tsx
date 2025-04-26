import React, {useState, useEffect} from "react";
import {Text, View, FlatList, ListRenderItem, useColorScheme, Alert} from "react-native";
import {TextInput, Button, IconButton, Provider as PaperProvider, Appbar, Dialog, Portal, Paragraph, Checkbox} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {generalStyles, indexStyles, listStyles} from "@/constants/Styles";
import BorderedText from "@/components/BorderedText";
import {themeColors} from "@/constants/Colors";
import {Player} from "@/constants/Interfaces";

// Extended Player interface for Cabo
interface CaboPlayer extends Player {
    currentRoundScore: number;
    hasCalled: boolean;
    hasKamikaze: boolean;
}

const initialPlayers: CaboPlayer[] = [
    {id: "1", name: "", leftValue: 0, totalValue: [0], currentRoundScore: 0, hasCalled: false, hasKamikaze: false},
    {id: "2", name: "", leftValue: 0, totalValue: [0], currentRoundScore: 0, hasCalled: false, hasKamikaze: false},
    {id: "3", name: "", leftValue: 0, totalValue: [0], currentRoundScore: 0, hasCalled: false, hasKamikaze: false},
    {id: "4", name: "", leftValue: 0, totalValue: [0], currentRoundScore: 0, hasCalled: false, hasKamikaze: false},
];

export default function CaboTracker() {
    const colorScheme = useColorScheme();
    const themeText = colorScheme === "light" ? themeColors.light.text : themeColors.dark.text;
    const themeContainer = colorScheme === "light" ? themeColors.light.container : themeColors.dark.container;

    const [players, setPlayers] = useState<CaboPlayer[]>(initialPlayers);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [resetConfirmationVisible, setResetConfirmationVisible] = useState<boolean>(false);
    const [endRoundConfirmationVisible, setEndRoundConfirmationVisible] = useState<boolean>(false);
    const [selectedPlayer, setSelectedPlayer] = useState<CaboPlayer | null>(null);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [roundEnded, setRoundEnded] = useState<boolean>(false);
    const [caboCallerIndex, setCaboCallerIndex] = useState<number>(-1);

    // Load players from AsyncStorage
    useEffect(() => {
        const loadPlayers = async () => {
            try {
                const savedPlayers = await AsyncStorage.getItem("caboPlayers");
                if (savedPlayers) {
                    setPlayers(JSON.parse(savedPlayers));
                }
            } catch (error) {
                console.error("Error loading players:", error);
            }
        };
        loadPlayers();
    }, []);

    // Save players to AsyncStorage
    useEffect(() => {
        const savePlayers = async () => {
            try {
                await AsyncStorage.setItem("caboPlayers", JSON.stringify(players));
            } catch (error) {
                console.error("Error saving players:", error);
            }
        };
        savePlayers();
    }, [players]);

    // Update a player's current round score
    const updateScore = (index: number, delta: number) => {
        setPlayers((prevPlayers) =>
            prevPlayers.map((player, idx) => {
                if (idx === index) {
                    const newScore = Math.max(0, player.currentRoundScore + delta);
                    return {...player, currentRoundScore: newScore};
                }
                return player;
            }),
        );
    };

    // Call Cabo for a player
    const callCabo = (index: number) => {
        if (caboCallerIndex !== -1) {
            Alert.alert("Cabo bereits angesagt", "Jemand hat in dieser Runde bereits Cabo angesagt.");
            return;
        }

        setPlayers((prevPlayers) =>
            prevPlayers.map((player, idx) => {
                if (idx === index) {
                    return {...player, hasCalled: true};
                }
                return player;
            }),
        );
        setCaboCallerIndex(index);
        Alert.alert("Cabo angesagt", `${players[index].name || "Spieler"} hat Cabo angesagt! Jeder andere Spieler bekommt noch einen Zug.`);
    };

    // Toggle Kamikaze status for a player
    const toggleKamikaze = (index: number) => {
        setPlayers((prevPlayers) =>
            prevPlayers.map((player, idx) => {
                if (idx === index) {
                    return {...player, hasKamikaze: !player.hasKamikaze};
                }
                return player;
            }),
        );
    };

    // End the current round and calculate scores
    const endRound = () => {
        // Find the player with the lowest score
        const lowestScore = Math.min(...players.map(p => p.currentRoundScore));
        const lowestScorePlayers = players.filter(p => p.currentRoundScore === lowestScore);

        // Check for Kamikaze winners
        const kamikazeWinners = players.filter(p => p.hasKamikaze);

        setPlayers((prevPlayers) => {
            return prevPlayers.map(player => {
                let newTotalValue = [...player.totalValue];
                let lastValue = newTotalValue[newTotalValue.length - 1] || 0;
                let roundScore = 0;

                // Handle Kamikaze rule
                if (kamikazeWinners.length > 0) {
                    if (player.hasKamikaze) {
                        // Kamikaze winner gets 0 points
                        roundScore = 0;
                    } else {
                        // Everyone else gets -50 points
                        roundScore = -50;
                    }
                } 
                // Normal scoring
                else {
                    // Check if this player has the lowest score
                    const isLowestScore = player.currentRoundScore === lowestScore;

                    // Check if this player called Cabo but doesn't have the lowest score
                    const calledCaboButNotLowest = player.hasCalled && !isLowestScore;

                    if (isLowestScore) {
                        // Winner gets 0 points
                        roundScore = 0;
                    } else if (calledCaboButNotLowest) {
                        // Cabo caller who doesn't win gets their points plus 5 penalty points
                        roundScore = -player.currentRoundScore - 5;
                    } else {
                        // Everyone else gets negative points equal to their card values
                        roundScore = -player.currentRoundScore;
                    }
                }

                // Add the round score to the total
                newTotalValue.push(lastValue + roundScore);

                // Reset for next round
                return {
                    ...player,
                    currentRoundScore: 0,
                    hasCalled: false,
                    hasKamikaze: false,
                    totalValue: newTotalValue
                };
            });
        });

        setCaboCallerIndex(-1);
        setRoundEnded(false);
        setEndRoundConfirmationVisible(false);
    };

    // Reset the game
    const resetGame = () => {
        setPlayers(initialPlayers.map(player => ({
            ...player,
            currentRoundScore: 0,
            hasCalled: false,
            hasKamikaze: false,
            totalValue: [0],
        })));
        setCaboCallerIndex(-1);
        setRoundEnded(false);
        setResetConfirmationVisible(false);
    };

    // Add a new player
    const addPlayer = () => {
        const newId = (players.length + 1).toString();
        setPlayers((prevPlayers) => [
            ...prevPlayers,
            {
                id: newId, 
                name: "", 
                leftValue: 0, 
                totalValue: [0], 
                currentRoundScore: 0, 
                hasCalled: false, 
                hasKamikaze: false
            },
        ]);
    };

    // Remove the last player
    const removePlayer = () => {
        if (players.length > 2) {
            setPlayers((prevPlayers) => prevPlayers.slice(0, -1));
        } else {
            Alert.alert("Entfernen nicht möglich", "Du brauchst mindestens 2 Spieler für Cabo.");
        }
    };

    // Render a player row
    const renderPlayer: ListRenderItem<CaboPlayer> = ({ item, index }) => {
        return (
            <View style={[listStyles.listRow, themeContainer]}>
                <TextInput
                    style={[indexStyles.nameField]}
                    mode="outlined"
                    editable={isEditing}
                    placeholder="Spieler"
                    value={item.name}
                    onChangeText={(text) =>
                        setPlayers((prevPlayers) =>
                            prevPlayers.map((p, idx) => (idx === index ? { ...p, name: text } : p)),
                        )
                    }
                />
                <View style={listStyles.row}>
                    <BorderedText
                        style={[indexStyles.innerListItem, { width: 60 }]}
                        value={item.currentRoundScore.toString()}
                    />
                </View>
                <View style={listStyles.row}>
                    {isEditing ? (
                        <IconButton
                            style={[indexStyles.valueButton, indexStyles.innerListItem, { width: 88 }]}
                            mode="contained"
                            icon="pencil"
                            onPress={() => {
                                setSelectedPlayer(item);
                                setModalVisible(true);
                            }}
                        />
                    ) : (
                        <>
                            <IconButton
                                style={[indexStyles.valueButton, indexStyles.innerListItem]}
                                mode="contained"
                                icon="minus"
                                onPress={() => updateScore(index, -1)}
                            />
                            <IconButton
                                style={[indexStyles.valueButton, indexStyles.innerListItem]}
                                mode="contained"
                                icon="plus"
                                onPress={() => updateScore(index, 1)}
                            />
                        </>
                    )}
                </View>
                <View style={listStyles.row}>
                    {!isEditing && (
                        <>
                            <IconButton
                                style={[indexStyles.valueButton, indexStyles.innerListItem]}
                                mode="contained"
                                icon="flag-checkered"
                                onPress={() => callCabo(index)}
                                disabled={item.hasCalled || caboCallerIndex !== -1}
                            />
                            <IconButton
                                style={[indexStyles.valueButton, indexStyles.innerListItem]}
                                mode="contained"
                                icon="cards"
                                onPress={() => toggleKamikaze(index)}
                                iconColor={item.hasKamikaze ? "#ff0000" : undefined}
                            />
                        </>
                    )}
                </View>
                <BorderedText
                    style={[indexStyles.totalField]}
                    value={item.totalValue[item.totalValue.length - 1].toString()}
                />
            </View>
        );
    };

    return (
        <PaperProvider>
            <Appbar.Header>
                <Appbar.Content title="Cabo Punktezähler"/>
                <Appbar.Action icon={isEditing ? "content-save" : "pencil"} onPress={() => setIsEditing(!isEditing)}/>
                <Appbar.Action icon="restore" onPress={() => setResetConfirmationVisible(true)}/>
            </Appbar.Header>
            <View
                style={[generalStyles.container, themeContainer, isEditing ? {paddingBottom: 145} : {paddingBottom: 100}]}>
                <FlatList
                    data={players}
                    keyboardShouldPersistTaps="handled"
                    renderItem={renderPlayer}
                    keyExtractor={(item) => item.id}
                />
                {!isEditing && (
                    <IconButton
                        style={indexStyles.checkButton}
                        icon="check-all"
                        iconColor="#ffffff"
                        size={32}
                        onPress={() => setEndRoundConfirmationVisible(true)}
                    />
                )}
                {isEditing && (
                    <>
                        <IconButton
                            style={[indexStyles.valueButton, indexStyles.editPlayerButton, {bottom: 80}]}
                            mode="contained"
                            icon="plus"
                            onPress={addPlayer}
                        />
                        <IconButton
                            style={[indexStyles.valueButton, indexStyles.editPlayerButton, {bottom: 16}]}
                            mode="contained"
                            icon="minus"
                            onPress={removePlayer}
                        />
                    </>
                )}
            </View>
            <Portal>
                <Dialog visible={resetConfirmationVisible} onDismiss={() => setResetConfirmationVisible(false)}>
                    <Dialog.Icon icon="alert"/>
                    <Dialog.Title>Spiel zurücksetzen</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>Möchtest du das gesamte Spiel zurücksetzen?</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setResetConfirmationVisible(false)}>Abbrechen</Button>
                        <Button onPress={resetGame}>Ja, zurücksetzen</Button>
                    </Dialog.Actions>
                </Dialog>

                <Dialog visible={endRoundConfirmationVisible} onDismiss={() => setEndRoundConfirmationVisible(false)}>
                    <Dialog.Icon icon="check-all"/>
                    <Dialog.Title>Runde beenden</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>Möchtest du die aktuelle Runde beenden und die Punkte berechnen?</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setEndRoundConfirmationVisible(false)}>Abbrechen</Button>
                        <Button onPress={endRound}>Ja, Runde beenden</Button>
                    </Dialog.Actions>
                </Dialog>

                <Dialog visible={modalVisible} onDismiss={() => setModalVisible(false)}>
                    <Dialog.Title>{selectedPlayer?.name ? selectedPlayer?.name : "Spieler"}</Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            style={indexStyles.modalItem}
                            label="Aktuelle Rundenpunkte"
                            value={selectedPlayer?.currentRoundScore.toString()}
                            mode="outlined"
                            keyboardType="numeric"
                            onChangeText={(text) => {
                                if (selectedPlayer) {
                                    setSelectedPlayer({ ...selectedPlayer, currentRoundScore: Number(text) });
                                }
                            }}
                        />
                        <TextInput
                            style={indexStyles.modalItem}
                            label="Gesamtpunktzahl"
                            value={selectedPlayer?.totalValue[selectedPlayer?.totalValue.length - 1].toString()}
                            mode="outlined"
                            keyboardType="numeric"
                            onChangeText={(text) => {
                                if (selectedPlayer) {
                                    const newTotalValue = [...selectedPlayer.totalValue];
                                    newTotalValue[newTotalValue.length - 1] = Number(text);
                                    setSelectedPlayer({ ...selectedPlayer, totalValue: newTotalValue });
                                }
                            }}
                        />
                        <View style={[listStyles.row, {marginTop: 10}]}>
                            <Checkbox
                                status={selectedPlayer?.hasCalled ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    if (selectedPlayer) {
                                        setSelectedPlayer({ ...selectedPlayer, hasCalled: !selectedPlayer.hasCalled });
                                    }
                                }}
                            />
                            <Text style={{marginLeft: 8}}>Cabo angesagt</Text>
                        </View>
                        <View style={listStyles.row}>
                            <Checkbox
                                status={selectedPlayer?.hasKamikaze ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    if (selectedPlayer) {
                                        setSelectedPlayer({ ...selectedPlayer, hasKamikaze: !selectedPlayer.hasKamikaze });
                                    }
                                }}
                            />
                            <Text style={{marginLeft: 8}}>Hat Kamikaze (2x12 und 2x13)</Text>
                        </View>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setModalVisible(false)}>Abbrechen</Button>
                        <Button
                            onPress={() => {
                                if (selectedPlayer) {
                                    setPlayers((prevPlayers) =>
                                        prevPlayers.map((player) => (player.id === selectedPlayer.id ? selectedPlayer : player))
                                    );
                                }
                                setModalVisible(false);
                            }}
                        >
                            Speichern
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </PaperProvider>
    );
}
