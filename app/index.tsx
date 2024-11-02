import React, {useState, useEffect} from "react";
import {Text, View, FlatList, ListRenderItem, useColorScheme} from "react-native";
import {TextInput, Button, IconButton, Provider as PaperProvider, Appbar, Dialog, Portal, Paragraph} from "react-native-paper";
import {StatusBar} from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {styles} from "@/constants/Styles";
import {colors} from "@/constants/Colors";
import BorderedText from "@/components/BorderedText";
import {Player} from "@/constants/Interfaces";

const Players: Player[] = [
    {id: "1", name: "", leftValue: 0, totalValue: [0]},
    {id: "2", name: "", leftValue: 0, totalValue: [0]},
    {id: "3", name: "", leftValue: 0, totalValue: [0]},
    {id: "4", name: "", leftValue: 0, totalValue: [0]},
];

export default function App() {
    const colorScheme = useColorScheme();
    const themeTextStyle = colorScheme === 'light' ? colors.lightThemeText : colors.darkThemeText;
    const themeContainerStyle = colorScheme === 'light' ? colors.lightContainer : colors.darkContainer;

    const [items, setItems] = useState<Player[]>(Players);
    const [toggleRight, setToggleRight] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [resetConfirmationVisible, setResetConfirmationVisible] = useState<boolean>(false);
    const [activePlayerIndex, setActivePlayerIndex] = useState<number>(0);

    useEffect(() => {
        const loadItems = async () => {
            try {
                const savedItems = await AsyncStorage.getItem('players');
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
                await AsyncStorage.setItem('players', JSON.stringify(items));
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

                    //console.log(prevItems);
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

const renderItem: ListRenderItem<Player> = ({ item, index }) => {
    const filteredItems = items.filter(i => i.totalValue.length > 1);

    const sortedItems = filteredItems.sort((a, b) => {
        const lastValueA = a.totalValue[a.totalValue.length - 1];
        const lastValueB = b.totalValue[b.totalValue.length - 1];
        return lastValueB - lastValueA;
    });

    const uniqueValues = Array.from(new Set(sortedItems.map(i => i.totalValue[i.totalValue.length - 1])));
    const topValues = uniqueValues.slice(0, 3);
    let borderColor;

    if (topValues.includes(item.totalValue[item.totalValue.length - 1])) {
        if (topValues[0] === item.totalValue[item.totalValue.length - 1]) {
            borderColor = colors.gold.borderColor;
        } else if (topValues[1] === item.totalValue[item.totalValue.length - 1]) {
            borderColor = colors.silver.borderColor;
        } else if (topValues[2] === item.totalValue[item.totalValue.length - 1]) {
            borderColor = colors.bronze.borderColor;
        }
    }

    return (
        <View style={[styles.listElement, themeContainerStyle]}>
            <TextInput
                style={[styles.nameField, index === activePlayerIndex && { fontWeight: "bold" }]}
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
            <BorderedText
                style={[styles.innerListItem, !toggleRight && !isEditing && { borderColor: "#6200ee" }]}
                value={item.leftValue.toString()}
            />
            <BorderedText
                style={[styles.innerListItem, toggleRight && !isEditing && { borderColor: "#6200ee" }]}
                value={item.rightValue !== undefined ? item.rightValue.toString() : ""}
            />
            <IconButton
                style={[styles.valueButton, styles.innerListItem]}
                mode="contained"
                icon="minus"
                onPress={() => updateValue(index, -1)}
            />
            <IconButton
                style={[styles.valueButton, styles.innerListItem]}
                mode="contained"
                icon="plus"
                onPress={() => updateValue(index, 1)}
            />
            <BorderedText
                style={[styles.totalField, borderColor ? { borderColor } : {}]}
                value={item.totalValue[item.totalValue.length - 1].toString()}
            />
        </View>
    );
};

    return (
        <PaperProvider>
            <Appbar.Header>
                <Appbar.Content title="Aufzug"/>
                <View style={styles.totalBetView}>
                    <Text style={[styles.totalBetText, themeTextStyle]}>
                        {`${getLeftTotal()}:${getRightTotal()}`}
                    </Text>
                </View>
                <Appbar.Action icon={isEditing ? "content-save" : "pencil"} onPress={() => setIsEditing(!isEditing)}/>
                <Appbar.Action icon="restore" onPress={() => setResetConfirmationVisible(true)}/>
            </Appbar.Header>
            <View
                removeClippedSubviews={false}
                style={[styles.container, themeContainerStyle, isEditing ? {paddingBottom: 145} : {paddingBottom: 100}]}>
                <FlatList
                    data={items}
                    keyboardShouldPersistTaps="handled"
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}/>
                {!isEditing && (
                    <IconButton
                        style={styles.checkButton}
                        icon={toggleRight ? "check-all" : "check"}
                        iconColor="#ffffff"
                        size={32}
                        onPress={toggleHandler}
                    />
                )}
                {isEditing && (
                    <>
                        <IconButton
                            style={[styles.valueButton, styles.editPlayerButton, {bottom: 80}]}
                            mode="contained"
                            icon="plus"
                            onPress={addPlayer}
                        />
                        <IconButton
                            style={[styles.valueButton, styles.editPlayerButton, {bottom: 16}]}
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
                        <Paragraph>Möchtest du den Punktestand zurücksetzen?</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setResetConfirmationVisible(false)}>Abbrechen</Button>
                        <Button onPress={resetHandler}>Ja, zurücksetzen</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
            <StatusBar/>
        </PaperProvider>
    );
}