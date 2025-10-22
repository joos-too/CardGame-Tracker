import React from "react";
import {ScrollView, useColorScheme, View} from "react-native";
import {Text} from "react-native-paper";
import {themeColors} from "@/constants/Colors";

const sections = [
    {
        heading: "Spielidee",
        body: "Fahrstuhl ist ein Stichspiel, bei dem sich die Anzahl der ausgeteilten Karten pro Runde wie ein Fahrstuhl nach oben und wieder nach unten bewegt. Wer seine angesagten Stichzahlen möglichst oft exakt erreicht, sammelt die meisten Punkte und gewinnt die Partie.",
    },
    {
        heading: "Vorbereitung",
        body: "Ihr spielt in der Regel mit einem vollständigen 52er Kartendeck ohne Joker (ein 32er Skatdeck funktioniert zu dritt oder viert genauso gut). Bestimmt einen Geber, mischt und teilt je nach aktuellem Fahrstuhl-Stockwerk die entsprechende Kartenanzahl an jeden Spieler aus. Die nächste Karte des Stapels bestimmt den Trumpf für die Runde.",
    },
    {
        heading: "Rundenabfolge",
        body: "Zu Beginn startet ihr üblicherweise mit einer Karte pro Spieler und erhöht in jeder Runde um eine Karte, bis ihr die vereinbarte Maximalzahl (normalerweise max. 10) erreicht habt. Danach fahrt ihr den Fahrstuhl wieder herunter, indem ihr die Kartenanzahl pro Runde reduziert.",
    },
    {
        heading: "Ansagen",
        body: "Nachdem alle ihre Karten aufgenommen haben, sagt beginnend links vom Geber jeder Spieler die Anzahl der Stiche an, die er/sie gewinnen möchte.",
    },
    {
        heading: "Stichspiel",
        body: "Gespielt wird klassisch im Uhrzeigersinn. Trumpf muss hierbei immer zuerst ausgespielt werden. Die höchste Karte in der angespielten Farbe (oder, falls vorhanden, der höchste Trumpf) gewinnt den Stich und spielt als Nächster aus.",
    },
    {
        heading: "Wertung",
        body: "Nach jeder Runde vergleichen alle ihre angesagte Stichzahl mit den tatsächlich gewonnenen Stichen. Stimmt die Angabe exakt, erhält der Spieler 10 Punkte plus 2 Punkte pro angesagtem Stich. Wird die Ansage verfehlt, gibt es Minuspunkte: -2 Punkte für eine misslungene Null-Ansage, ansonsten -2 Punkte je angesagtem Stich.",
    },
    {
        heading: "Spielende",
        body: "Nachdem ihr den Fahrstuhl komplett hoch und wieder herunter gespielt habt, werden die Gesamtpunkte angeschaut. Wer die höchste Summe besitzt, gewinnt die Partie.",
    },
    {
        heading: "Den Tracker nutzen",
        body: "Im Bearbeitungsmodus ergänzt ihr neue Spieler oder ändert Namen. Während einer Runde sind die Plus/Minus-Tasten aktiv: Mit blau markiertem linken Feld tragt ihr die Ansagen ein – die farbige Hervorhebung zeigt, welcher Spieler gerade an der Reihe ist. Tippt anschließend auf den Check-Button unten rechts, um zum rechten Feld zu wechseln; jetzt gebt ihr dort die tatsächlich gewonnenen Stiche ein (die vorherige Ansage wird als Ausgangswert übernommen). Drückt ihr den Check-Button ein zweites Mal, berechnet der Tracker automatisch die Punkte nach oben genannten Regeln, setzt linkes und rechtes Feld zurück und rückt den aktiven Spieler weiter. Die aktuellen Summen werden unter dem Namensfeld angezeigt und nach jeder Runde automatisch gespeichert. Über das Restore-Symbol im Header könnt ihr jederzeit das gesamte Spiel zurücksetzen.",
    },
];

export default function FahrstuhlRules() {
    const colorScheme = useColorScheme();
    const palette = themeColors[colorScheme === "light" ? "light" : "dark"];

    return (
        <ScrollView style={[{ flex: 1 }, palette.container]} contentContainerStyle={{ padding: 20, gap: 24 }}>
            <View style={{ gap: 16 }}>
                <Text variant="bodyMedium">
                    Diese Übersicht fasst die wichtigsten Regeln von Fahrstuhl zusammen und wie der Tracker zu benutzen ist.
                </Text>
            </View>

            {sections.map(section => (
                <View key={section.heading} style={{ gap: 8 }}>
                    <Text variant="titleMedium">{section.heading}</Text>
                    <Text variant="bodyMedium">{section.body}</Text>
                </View>
            ))}
        </ScrollView>
    );
}
