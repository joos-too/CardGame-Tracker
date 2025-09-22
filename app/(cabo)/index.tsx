import React, {useState, useEffect, useLayoutEffect} from "react";
import {View, FlatList, ListRenderItem, useColorScheme, Pressable} from "react-native";
import {TextInput, Button, IconButton, Dialog, Portal, Text, Checkbox} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {generalStyles, indexStyles, listStyles} from "@/constants/Styles";
import BorderedText from "@/components/BorderedText";
import {themeColors} from "@/constants/Colors";
import {Player} from "@/constants/Interfaces";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";
import { useDialog } from "@/components/DialogProvider";

// Extended Player interface for Cabo
interface CaboPlayer extends Player {
    currentRoundScore: number;
    hasCalled: boolean;
    hasKamikaze: boolean;
    caboCalls: number; // Anzahl der Cabo-Ansagen über alle Runden
}

const initialPlayers: CaboPlayer[] = [
    {id: "1", name: "", leftValue: 0, totalValue: [0], currentRoundScore: 0, hasCalled: false, hasKamikaze: false, caboCalls: 0},
    {id: "2", name: "", leftValue: 0, totalValue: [0], currentRoundScore: 0, hasCalled: false, hasKamikaze: false, caboCalls: 0},
    {id: "3", name: "", leftValue: 0, totalValue: [0], currentRoundScore: 0, hasCalled: false, hasKamikaze: false, caboCalls: 0},
    {id: "4", name: "", leftValue: 0, totalValue: [0], currentRoundScore: 0, hasCalled: false, hasKamikaze: false, caboCalls: 0},
];

export default function Cabo() {
    const colorScheme = useColorScheme();
    const themeContainer = colorScheme === "light" ? themeColors.light.container : themeColors.dark.container;
    const dialog = useDialog();

    const [players, setPlayers] = useState<CaboPlayer[]>(initialPlayers);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [resetConfirmationVisible, setResetConfirmationVisible] = useState<boolean>(false);
    const [endRoundConfirmationVisible, setEndRoundConfirmationVisible] = useState<boolean>(false);
    const [selectedPlayer, setSelectedPlayer] = useState<CaboPlayer | null>(null);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [roundEnded, setRoundEnded] = useState<boolean>(false);
    const [caboCallerIndex, setCaboCallerIndex] = useState<number>(-1);
    const [endGameVisible, setEndGameVisible] = useState<boolean>(false);
    const [endGameWinners, setEndGameWinners] = useState<string>("");

    const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Pressable
                        accessibilityLabel={isEditing ? "Speichern" : "Bearbeiten"}
                        hitSlop={10}
                        onPress={() => setIsEditing(!isEditing)}
                        style={{ paddingHorizontal: 8 }}
                    >
                        <MaterialCommunityIcons name={isEditing ? "content-save" : "pencil"} size={24} color={themeColors[colorScheme === "light" ? "light" : "dark"].text.color} />
                    </Pressable>
                    <Pressable
                        accessibilityLabel="Zurücksetzen"
                        hitSlop={10}
                        onPress={() => setResetConfirmationVisible(true)}
                        style={{ paddingRight: 12, paddingLeft: 4 }}
                    >
                        <MaterialCommunityIcons name="restore" size={24} color={themeColors[colorScheme === "light" ? "light" : "dark"].text.color} />
                    </Pressable>
                </View>
            ),
        });
    }, [navigation, isEditing, colorScheme]);

    // Load players from AsyncStorage
    useEffect(() => {
        const loadPlayers = async () => {
            try {
                const savedPlayers = await AsyncStorage.getItem("caboPlayers");
                if (savedPlayers) {
                    const parsed: CaboPlayer[] = JSON.parse(savedPlayers);
                    // Backward compatibility: ensure caboCalls exists
                    const normalized = parsed.map(p => ({
                        ...p,
                        caboCalls: typeof (p as any).caboCalls === "number" ? (p as any).caboCalls : 0,
                    }));
                    setPlayers(normalized);
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

    // Update a player's current round score by delta (legacy, no longer used by UI)
    const updateScore = (index: number, delta: number) => {
        setPlayers((prevPlayers) =>
            prevPlayers.map((player, idx) => {
                if (idx === index) {
                    const newScore = Math.max(0, player.currentRoundScore + delta);
                    return { ...player, currentRoundScore: newScore };
                }
                return player;
            }),
        );
    };

    // Directly set a player's current round score from text input
    const setScoreFromInput = (index: number, text: string) => {
        // Allow only digits, treat empty as 0
        const sanitized = text.replace(/[^0-9]/g, "");
        const value = sanitized === "" ? 0 : parseInt(sanitized, 10);
        setPlayers((prevPlayers) =>
            prevPlayers.map((player, idx) =>
                idx === index ? { ...player, currentRoundScore: Math.max(0, value) } : player,
            ),
        );
    };

    // Call Cabo for a player
    const callCabo = (index: number) => {
        // Wenn noch niemand Cabo angesagt hat: für diesen Spieler ansagen
        if (caboCallerIndex === -1) {
            setPlayers((prevPlayers) =>
                prevPlayers.map((player, idx) => {
                    if (idx === index) {
                        return { ...player, hasCalled: true, caboCalls: (player.caboCalls || 0) + 1 };
                    }
                    return player;
                }),
            );
            setCaboCallerIndex(index);
            dialog.alert("Cabo angesagt", `${players[index].name || "Spieler"} hat Cabo angesagt! Jeder andere Spieler bekommt noch einen Zug.`);
            return;
        }

        // Wenn derselbe Spieler erneut drückt: Ansage zurücknehmen
        if (caboCallerIndex === index) {
            setPlayers((prevPlayers) =>
                prevPlayers.map((player, idx) => {
                    if (idx === index) {
                        const newCalls = Math.max(0, (player.caboCalls || 0) - 1);
                        return { ...player, hasCalled: false, caboCalls: newCalls };
                    }
                    return player;
                }),
            );
            setCaboCallerIndex(-1);
            dialog.alert("Cabo zurückgenommen", `Die Cabo-Ansage wurde zurückgenommen.`);
            return;
        }
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
        // Determine lowest current round score
        const lowestScore = Math.min(...players.map(p => p.currentRoundScore));
        const kamikazeWinners = players.filter(p => p.hasKamikaze);

        // Determine winners according to tie rules
        let winnersIds: Set<string> = new Set();
        if (kamikazeWinners.length > 0) {
            // All kamikaze players win
            winnersIds = new Set(kamikazeWinners.map(p => p.id));
        } else {
            const lowestPlayers = players.filter(p => p.currentRoundScore === lowestScore);
            const caboInLowest = lowestPlayers.find(p => p.hasCalled);
            if (caboInLowest) {
                winnersIds = new Set([caboInLowest.id]);
            } else {
                // No cabo caller among lowest; all lowest players win (can be >1)
                winnersIds = new Set(lowestPlayers.map(p => p.id));
            }
        }

        // Compute updated players with new totals according to rules
        const updatedPlayers: CaboPlayer[] = players.map(player => {
            const newTotalValue = [...player.totalValue];
            const lastValue = newTotalValue[newTotalValue.length - 1] || 0;
            let roundScore = 0;

            if (kamikazeWinners.length > 0) {
                // Kamikaze: winner(s) 0, others -50
                roundScore = winnersIds.has(player.id) ? 0 : -50;
            } else {
                if (winnersIds.has(player.id)) {
                    roundScore = 0;
                } else if (player.hasCalled) {
                    roundScore = -player.currentRoundScore - 5; // +5 Strafpunkte zusätzlich
                } else {
                    roundScore = -player.currentRoundScore;
                }
            }

            let newTotal = lastValue + roundScore;
            // Exactly -100 becomes -50
            if (newTotal === -100) newTotal = -50;
            newTotalValue.push(newTotal);

            return {
                ...player,
                currentRoundScore: 0,
                hasCalled: false,
                hasKamikaze: false,
                totalValue: newTotalValue,
            };
        });

        // Apply updated players
        setPlayers(updatedPlayers);

        // Determine if game ends: someone has less than -100 (über 100 Minuspunkte)
        const isGameOver = updatedPlayers.some(p => (p.totalValue[p.totalValue.length - 1] as number) < -100);

        if (isGameOver) {
            // Winner: fewest Gesamtpunkte => numerisch höchster Wert (da negative Minuspunkte)
            const finalTotals = updatedPlayers.map(p => p.totalValue[p.totalValue.length - 1] as number);
            const maxTotal = Math.max(...finalTotals);
            const topPlayers = updatedPlayers.filter(p => (p.totalValue[p.totalValue.length - 1] as number) === maxTotal);

            // Tie-breaker: derjenige, der öfter Cabo angesagt hat
            let winners: CaboPlayer[] = topPlayers;
            if (topPlayers.length > 1) {
                const maxCalls = Math.max(...topPlayers.map(p => p.caboCalls || 0));
                winners = topPlayers.filter(p => (p.caboCalls || 0) === maxCalls);
            }

            const names = winners.map(w => w.name?.trim() || "Spieler").join(", ");
            setEndGameWinners(names);
            setEndGameVisible(true);
        }

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
                hasKamikaze: false,
                caboCalls: 0,
            },
        ]);
    };

    // Remove the last player
    const removePlayer = () => {
        if (players.length > 2) {
            setPlayers((prevPlayers) => prevPlayers.slice(0, -1));
        } else {
            dialog.alert("Entfernen nicht möglich", "Du brauchst mindestens 2 Spieler für Cabo.");
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
                    <TextInput
                        style={[indexStyles.innerListItem, { width: 80 }]}
                        mode="outlined"
                        keyboardType="numeric"
                        placeholder="0"
                        value={item.currentRoundScore === 0 ? "" : item.currentRoundScore.toString()}
                        onChangeText={(text) => setScoreFromInput(index, text)}
                    />
                </View>
                <View style={listStyles.row}>
                    {!isEditing && (
                        <>
                            <IconButton
                                style={[indexStyles.valueButton, indexStyles.innerListItem]}
                                mode="contained"
                                icon="flag-checkered"
                                onPress={() => callCabo(index)}
                                disabled={caboCallerIndex !== -1 && index !== caboCallerIndex}
                                iconColor={item.hasCalled ? "#00c853" : undefined}
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
        <>
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
                        <Text variant="bodyMedium">Möchtest du das gesamte Spiel zurücksetzen?</Text>
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
                        <Text variant="bodyMedium">Möchtest du die aktuelle Runde beenden und die Punkte berechnen?</Text>
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

                <Dialog visible={endGameVisible} onDismiss={() => setEndGameVisible(false)}>
                    <Dialog.Icon icon="trophy" />
                    <Dialog.Title>Spiel beendet</Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyMedium">Das Spiel ist zu Ende.</Text>
                        <Text style={{ marginTop: 8 }} variant="bodyLarge">Gewinner: {endGameWinners}</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setEndGameVisible(false)}>OK</Button>
                        <Button onPress={() => { setEndGameVisible(false); resetGame(); }}>Neues Spiel</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </>
    );
}