import React, {useState, useEffect, useLayoutEffect} from "react";
import {View, FlatList, ListRenderItem, useColorScheme, Pressable} from "react-native";
import {TextInput, Button, IconButton, Dialog, Portal, Text} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {generalStyles, indexStyles, listStyles} from "@/constants/Styles";
import BorderedText from "@/components/BorderedText";
import {themeColors} from "@/constants/Colors";
import {Player} from "@/constants/Interfaces";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {useNavigation} from "@react-navigation/native";
import {useRouter} from "expo-router";

const Players: Player[] = [
    {id: "1", name: "", leftValue: 0, totalValue: [0]},
    {id: "2", name: "", leftValue: 0, totalValue: [0]},
    {id: "3", name: "", leftValue: 0, totalValue: [0]},
    {id: "4", name: "", leftValue: 0, totalValue: [0]},
];

export default function App() {
    const colorScheme = useColorScheme();
    const router = useRouter();
    const themeText = colorScheme === "light" ? themeColors.light.text : themeColors.dark.text;
    const themeContainer = colorScheme === "light" ? themeColors.light.container : themeColors.dark.container;

    const [items, setItems] = useState<Player[]>(Players);
    const [toggleRight, setToggleRight] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [resetConfirmationVisible, setResetConfirmationVisible] = useState<boolean>(false);
    const [activePlayerIndex, setActivePlayerIndex] = useState<number>(0);
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    useEffect(() => {
        const loadItems = async () => {
            try {
                const savedItems = await AsyncStorage.getItem("players");
                if (savedItems) {
                    setItems(JSON.parse(savedItems));
                }
            } catch (error) {
                console.error("Fehler beim Laden der Daten:", error);
            }
        };
        loadItems();
    }, []);

    useEffect(() => {
        const saveItems = async () => {
            try {
                await AsyncStorage.setItem("players", JSON.stringify(items));
            } catch (error) {
                console.error("Fehler beim Speichern der Daten:", error);
            }
        };
        saveItems();
    }, [items]);

    const updateValue = (index: number, delta: number) => {
        setItems((prevItems) =>
            prevItems.map((item, idx) => {
                if (idx === index) {
                    if (toggleRight) {
                        const newValue = Math.min(99, (item.rightValue || 0) + delta);
                        return {...item, rightValue: Math.max(newValue, 0)};
                    } else {
                        const newValue = Math.min(99, item.leftValue + delta);
                        return {...item, leftValue: Math.max(newValue, 0)};
                    }
                }
                return item;
            }),
        );
    };

    const getLeftTotal = () => items.reduce((sum, item) => sum + item.leftValue, 0);
    const getRightTotal = () => items.reduce((sum, item) => sum + (item.rightValue || 0), 0);

    const toggleHandler = () => {
        if (toggleRight) {
            setItems((prevItems) =>
                prevItems.map((item) => {
                    let updatedTotal = [...item.totalValue];
                    const newValue = item.leftValue === item.rightValue
                        ? 10 + item.leftValue * 2
                        : -(item.leftValue === 0 ? 2 : item.leftValue * 2);

                    const lastValue = updatedTotal.length > 0 ? updatedTotal[updatedTotal.length - 1] : 0;
                    updatedTotal.push(lastValue + newValue);

                    return {...item, leftValue: 0, rightValue: undefined, totalValue: updatedTotal};
                }),
            );
        } else {
            setItems((prevItems) =>
                prevItems.map((item) => ({
                    ...item,
                    rightValue: item.leftValue,
                })),
            );
        }

        if (toggleRight) {
            setActivePlayerIndex((prevIndex) => {
                return (prevIndex + 1) % items.length;
            });
        }
        setToggleRight(!toggleRight);
    };

    const resetHandler = () => {
        setItems(Players.map(item => ({
            ...item,
            leftValue: 0,
            rightValue: undefined,
            totalValue: [0],
        })));
        setToggleRight(false);
        setResetConfirmationVisible(false);
        setActivePlayerIndex(0);
    };

    const addPlayer = () => {
        const newId = (items.length + 1).toString();
        setItems((prevItems) => [
            ...prevItems,
            {id: newId, name: "", leftValue: 0, totalValue: [0]},
        ]);
    };

    const removePlayer = () => {
        setItems((prevItems) => prevItems.slice(0, -1));
    };

    const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Text style={[{fontSize: 20, marginRight: 12}, themeText]}>Fahrstuhl</Text>
                    <View style={indexStyles.totalBetView}>
                        <Text style={[indexStyles.totalBetText, themeText]}>
                            {`${getLeftTotal()}:${getRightTotal()}`}
                        </Text>
                    </View>
                </View>
            ),
            headerRight: () => (
                <View style={{flexDirection: "row", alignItems: "center"}}>
                        <Pressable
                            accessibilityLabel={"Zu den Regeln"}
                            hitSlop={10}
                            onPress={() => router.push("rules")}
                            style={{paddingHorizontal: 8}}
                        >
                            <MaterialCommunityIcons name={"information"} size={24}
                                                    color={themeColors[colorScheme === "light" ? "light" : "dark"].text.color}/>
                        </Pressable>
                        <Pressable
                            accessibilityLabel={isEditing ? "Speichern" : "Bearbeiten"}
                            hitSlop={10}
                            onPress={() => setIsEditing(!isEditing)}
                            style={{paddingHorizontal: 8}}
                        >
                            <MaterialCommunityIcons name={isEditing ? "content-save" : "pencil"} size={24}
                                                    color={themeColors[colorScheme === "light" ? "light" : "dark"].text.color}/>
                        </Pressable>
                        <Pressable
                            accessibilityLabel="Zurücksetzen"
                            hitSlop={10}
                            onPress={() => setResetConfirmationVisible(true)}
                            style={{paddingRight: 12, paddingLeft: 4}}
                        >
                            <MaterialCommunityIcons name="restore" size={24}
                                                    color={themeColors[colorScheme === "light" ? "light" : "dark"].text.color}/>
                        </Pressable>
                    </View>
                    ),
                    });
                    }, [navigation, isEditing, colorScheme, items]);

                    const renderPlayer: ListRenderItem<Player> = ({item, index}) => {

                    return (
                    <View style={[listStyles.listRow, themeContainer]}>
                    <TextInput
                        style={[indexStyles.nameField, index === activePlayerIndex && {fontWeight: "bold"}]}
                        mode="outlined"
                        editable={isEditing}
                        textColor={index === activePlayerIndex ? "#873def" : ""}
                        placeholder="Spieler"
                        value={item.name}
                        onChangeText={(text) =>
                            setItems((prevItems) =>
                                prevItems.map((i, idx) => (idx === index ? {...i, name: text} : i)),
                            )
                        }
                    />
                    <View style={listStyles.row}>
                        <BorderedText
                            style={[indexStyles.innerListItem, !toggleRight && !isEditing && {borderColor: "#6200ee"}]}
                            value={item.leftValue.toString()}
                        />
                        <BorderedText
                            style={[indexStyles.innerListItem, toggleRight && !isEditing && {borderColor: "#6200ee"}]}
                            value={item.rightValue !== undefined ? item.rightValue.toString() : ""}
                        />
                    </View>
                    <View style={listStyles.row}>
                        {isEditing ? (
                            <IconButton
                                style={[indexStyles.valueButton, indexStyles.innerListItem, {width: 88}]}
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
                                    onPress={() => updateValue(index, -1)}
                                />
                                <IconButton
                                    style={[indexStyles.valueButton, indexStyles.innerListItem]}
                                    mode="contained"
                                    icon="plus"
                                    onPress={() => updateValue(index, 1)}
                                />
                            </>
                        )}
                    </View>
                    <BorderedText
                        style={[indexStyles.totalField, index === activePlayerIndex ? {borderColor: "#873def"} : {}]}
                        value={item.totalValue[item.totalValue.length - 1].toString()}
                    />
                </View>
            );
    };

    return (
        <>
            <View
                removeClippedSubviews={false}
                style={[generalStyles.container, themeContainer, isEditing ? {paddingBottom: 145} : {paddingBottom: 100}]}>
                <FlatList
                    data={items}
                    keyboardShouldPersistTaps="handled"
                    renderItem={renderPlayer}
                    keyExtractor={(item) => item.id}/>
                {!isEditing && (
                    <IconButton
                        style={indexStyles.checkButton}
                        icon={toggleRight ? "check-all" : "check"}
                        iconColor="#ffffff"
                        size={32}
                        onPress={toggleHandler}
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
                    <Dialog.Title>Reset</Dialog.Title>
                    <Dialog.Content>
                        <Text variant="bodyMedium">Möchtest du den Punktestand zurücksetzen?</Text>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setResetConfirmationVisible(false)}>Abbrechen</Button>
                        <Button onPress={resetHandler}>Ja, zurücksetzen</Button>
                    </Dialog.Actions>
                </Dialog>

                <Dialog visible={modalVisible} onDismiss={() => setModalVisible(false)}>
                    <Dialog.Title>{selectedPlayer?.name ? selectedPlayer?.name : "Spieler"}</Dialog.Title>
                    <Dialog.Content>
                        <View style={[indexStyles.modalItem, indexStyles.modalTopRow]}>
                            <TextInput
                                style={[indexStyles.modalValueField, {marginRight: 10}]}
                                label="Linker Wert"
                                placeholder="0"
                                value={selectedPlayer && selectedPlayer.leftValue === 0 ? "" : selectedPlayer?.leftValue.toString()}
                                mode="outlined"
                                keyboardType="numeric"
                                onChangeText={(text) => {
                                    if (selectedPlayer) {
                                        setSelectedPlayer({...selectedPlayer, leftValue: Number(text)});
                                    }
                                }}
                            />
                            <TextInput
                                style={[indexStyles.modalValueField, {marginLeft: 10}]}
                                label="Rechter Wert"
                                editable={toggleRight}
                                placeholder="0"
                                value={selectedPlayer && (selectedPlayer.rightValue === undefined || selectedPlayer.rightValue === 0) ? "" : selectedPlayer?.rightValue?.toString()}
                                mode="outlined"
                                keyboardType="numeric"
                                onChangeText={(text) => {
                                    if (selectedPlayer) {
                                        setSelectedPlayer({...selectedPlayer, rightValue: Number(text)});
                                    }
                                }}
                            />
                        </View>
                        <TextInput
                            style={indexStyles.modalItem}
                            label="Summe"
                            placeholder="0"
                            value={selectedPlayer && selectedPlayer.totalValue[selectedPlayer.totalValue.length - 1] === 0 ? "" : selectedPlayer?.totalValue[selectedPlayer?.totalValue.length - 1].toString()}
                            mode="outlined"
                            keyboardType="numeric"
                            onChangeText={(text) => {
                                if (selectedPlayer) {
                                    const newTotalValue = [...selectedPlayer.totalValue];
                                    newTotalValue[newTotalValue.length - 1] = Number(text);
                                    setSelectedPlayer({...selectedPlayer, totalValue: newTotalValue});
                                }
                            }}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setModalVisible(false)}>Schließen</Button>
                        <Button
                            onPress={() => {
                                if (selectedPlayer) {
                                    setItems((prevItems) =>
                                        prevItems.map((item) => (item.id === selectedPlayer.id ? selectedPlayer : item))
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
        </>
    );
    }