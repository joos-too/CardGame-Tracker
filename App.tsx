import React, { useState, useEffect } from "react";
import { Text, View, FlatList, ListRenderItem, useColorScheme } from "react-native";
import { TextInput, Button, IconButton, Provider as PaperProvider, Appbar, Dialog, Portal, Paragraph } from "react-native-paper";
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles, colors } from "./styling";

interface ListItem {
    id: string;
    name: string;
    leftValue: number;
    rightValue?: number;
    totalValue: number;
}

const initialItems: ListItem[] = [
    { id: "1", name: "", leftValue: 0, totalValue: 0 },
    { id: "2", name: "", leftValue: 0, totalValue: 0 },
    { id: "3", name: "", leftValue: 0, totalValue: 0 },
    { id: "4", name: "", leftValue: 0, totalValue: 0 },
];

export default function App() {
    const colorScheme = useColorScheme();
    const themeTextStyle = colorScheme === 'light' ? colors.lightThemeText : colors.darkThemeText;
    const themeContainerStyle = colorScheme === 'light' ? colors.lightContainer : colors.darkContainer;

    const [items, setItems] = useState<ListItem[]>(initialItems);
    const [toggleRight, setToggleRight] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [resetConfirmationVisible, setResetConfirmationVisible] = useState<boolean>(false);
    const [activePlayerIndex, setActivePlayerIndex] = useState<number>(0);
    useEffect(() => {
        const loadItems = async () => {
            try {
                const savedItems = await AsyncStorage.getItem('items');
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
                await AsyncStorage.setItem('items', JSON.stringify(items));
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
                        const newValue = (item.rightValue || 0) + delta;
                        return { ...item, rightValue: Math.max(newValue, 0) };
                    } else {
                        const newValue = item.leftValue + delta;
                        return { ...item, leftValue: Math.max(newValue, 0) };
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
                    let updatedTotal = item.totalValue;
                    if (item.leftValue === item.rightValue) {
                        updatedTotal += 10 + item.leftValue * 2;
                    } else {
                        updatedTotal -= item.leftValue === 0 ? 2 : item.leftValue * 2;
                    }
                    return { ...item, leftValue: 0, rightValue: undefined, totalValue: updatedTotal };
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

        if (!toggleRight) {
            setActivePlayerIndex((prevIndex) => {
                return (prevIndex + 1) % items.length;
            });
        }

        setToggleRight(!toggleRight);
    };

    const resetHandler = () => {
        setItems(initialItems.map(item => ({
            ...item,
            leftValue: 0,
            rightValue: undefined,
            totalValue: 0,
        })));
        setToggleRight(false);
        setResetConfirmationVisible(false);
        setActivePlayerIndex(0);
    };

    const addPlayer = () => {
        const newId = (items.length + 1).toString();
        setItems((prevItems) => [
            ...prevItems,
            { id: newId, name: "", leftValue: 0, totalValue: 0 },
        ]);
    };

    const removePlayer = () => {
        setItems((prevItems) => prevItems.slice(0, -1));
    };

    const renderItem: ListRenderItem<ListItem> = ({ item, index }) => (
        <View style={[styles.listItem, themeContainerStyle]}>
            <TextInput
                style={[styles.nameField, index === activePlayerIndex && styles.activeNameField]}
                mode="outlined"
                editable={isEditing}
                textColor={index === activePlayerIndex ? "#7d28f3": ""}
                label="Spieler"
                value={item.name}
                onChangeText={(text) =>
                    setItems((prevItems) =>
                        prevItems.map((i, idx) => (idx === index ? { ...i, name: text } : i)),
                    )
                }
            />
            <View style={styles.valuesContainer}>
                <TextInput
                    mode="outlined"
                    inputMode={"numeric"}
                    value={item.leftValue.toString()}
                    editable={isEditing && toggleRight}
                    disabled={isEditing && !toggleRight}
                    style={[
                        styles.valueField,
                        !toggleRight && !isEditing && styles.activeValueField,
                    ]}
                    onChangeText={(text) =>
                        setItems((prevItems) =>
                            prevItems.map((i, idx) =>
                                idx === index
                                    ? { ...i, leftValue: parseInt(text) || 0 }
                                    : i,
                            ),
                        )
                    }
                />
                <TextInput
                    mode="outlined"
                    value={item.rightValue !== undefined ? item.rightValue.toString() : ""}
                    editable={false}
                    disabled={isEditing}
                    style={[
                        styles.valueField,
                        toggleRight && !isEditing && styles.activeValueField,
                    ]}
                />
            </View>
            <View style={styles.buttonContainer}>
                <IconButton
                    mode="contained"
                    icon="minus"
                    style={styles.valueButton}
                    onPress={() => updateValue(index, -1)}
                    disabled={isEditing}
                />
                <IconButton
                    mode="contained"
                    icon="plus"
                    style={styles.valueButton}
                    onPress={() => updateValue(index, 1)}
                    disabled={isEditing}
                />
            </View>
            <TextInput
                mode="outlined"
                value={item.totalValue.toString()}
                inputMode={"numeric"}
                editable={isEditing}
                style={styles.totalText}
                onChangeText={(text) =>
                    setItems((prevItems) =>
                        prevItems.map((i, idx) =>
                            idx === index
                                ? { ...i, totalValue: parseInt(text) || 0 }
                                : i,
                        ),
                    )
                }
            />
        </View>
    );

    return (
        <PaperProvider>
            <Appbar.Header>
                <Appbar.Content title="Aufzug" />
                <View style={styles.totalBetView}>
                    <Text style={[styles.totalBetText, themeTextStyle]}>
                        {`${getLeftTotal()}:${getRightTotal()}`}
                    </Text>
                </View>
                <Appbar.Action icon={isEditing ? "content-save" : "pencil"} onPress={() => setIsEditing(!isEditing)} />
                <Appbar.Action icon="restore" onPress={() => setResetConfirmationVisible(true)} />
            </Appbar.Header>
<View removeClippedSubviews={false} style={[styles.container, themeContainerStyle, isEditing ? {paddingBottom: 145} : {paddingBottom: 100}]}>
    <FlatList data={items} renderItem={renderItem} keyExtractor={(item) => item.id} />
    {!isEditing && (
        <IconButton
            icon={toggleRight ? "check-all" : "check"}
            iconColor="#ffffff"
            size={32}
            onPress={toggleHandler}
            style={styles.floatingButton}
        />
    )}
    {isEditing && (
        <>
            <IconButton
                mode="contained"
                icon="plus"
                style={[styles.valueButton, styles.editButton, {bottom: 80}]}
                onPress={addPlayer}
            />
            <IconButton
                mode="contained"
                icon="minus"
                style={[styles.valueButton, styles.editButton, {bottom: 16}]}
                onPress={removePlayer}
            />
        </>
    )}
</View>
            <Portal>
                <Dialog visible={resetConfirmationVisible} onDismiss={() => setResetConfirmationVisible(false)}>
                    <Dialog.Icon icon="alert" />
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
            <StatusBar />
        </PaperProvider>
    );
}