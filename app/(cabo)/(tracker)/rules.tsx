import React from "react";
import {ScrollView, useColorScheme, View} from "react-native";
import {Text} from "react-native-paper";
import {themeColors} from "@/constants/Colors";

const sections = [
    {
        heading: "Ziel des Spiels",
        body: "In Cabo gewinnt, wer nach Ende der letzten Runde die wenigsten Punkte in seiner Auslage hat. Jede Karte besitzt einen festen Wert. Weil die Karten verdeckt vor dir liegen, spielst du das ganze Spiel über mit unvollständigen Informationen und versuchst, hohe Karten aus deiner Auslage zu tauschen oder wegzuwerfen.",
    },
    {
        heading: "Vorbereitung",
        body: "Mische alle Karten und gib jedem Spieler vier verdeckte Karten, die als Reihe vor der Person liegen bleiben. Der Rest bildet einen verdeckten Nachziehstapel; decke die oberste Karte als ersten Ablagestapel auf. Jede Person darf sich genau zwei ihrer vier Karten anschauen, bevor das Spiel startet. Ein Startspieler wird bestimmt; in Folgerunden wechseln Start und Mischen gemäß Vereinbarung.",
    },
    {
        heading: "Spielzug",
        body: "Es wird reihum im Uhrzeigersinn gespielt. Im eigenen Zug hast du drei Möglichkeiten: (1) Nimm die offene Karte vom Ablagestapel und tausche sie 1:1 gegen eine Karte deiner Auslage (oder gegen ein gültiges Duett/Triplett/Quartett). (2) Ziehe die oberste Karte vom Nachziehstapel: Du kannst sie nach dem Anschauen abwerfen, gegen eine Auslagekarte tauschen oder – falls es eine Aktionskarte ist – sofort ausführen und anschließend abwerfen. (3) Stattdessen kannst du \"Cabo\" ansagen, wenn du glaubst, die niedrigste Punktzahl zu besitzen (siehe unten).",
    },
    {
        heading: "Duett, Triplett, Quartett",
        body: "Hast du zwei, drei oder vier Karten mit identischem Wert in deiner Auslage, kannst du sie gemeinsam gegen genau eine Karte vom Nachzieh- oder Ablagestapel austauschen. Zeige die passenden Karten allen Mitspielern und lege sie auf den Ablagestapel. Verwechselst du auch nur eine Karte, nimmst du dein Set zurück in die ursprüngliche Reihenfolge und die gezogene Karte wandert auf den Ablagestapel – dein Zug verfällt damit.",
    },
    {
        heading: "Aktionskarten",
        body: "Peek lässt dich eine eigene Karte ansehen. Spy erlaubt dir, eine Karte bei einem Mitspieler zu sehen. Swap zwingt dich, eine eigene Karte blind mit einer Karte eines Mitspielers zu tauschen. Aktionskarten dürfen nur direkt nach dem Ziehen vom Nachziehstapel eingesetzt werden; ziehst du sie offen vom Ablagestapel oder liegen sie bereits in deiner Auslage, gelten sie ausschließlich als Punktekarten.",
    },
    {
        heading: "Cabo ansagen",
        body: "Sobald du glaubst, die wenigsten Punkte zu haben, kannst du statt eines normalen Zuges \"Cabo\" rufen. Ab diesem Moment dürfen alle anderen Spieler genau noch einen Zug ausführen. Danach endet die Runde automatisch.",
    },
    {
        heading: "Schlusswertung",
        body: "Am Rundenende decken alle ihre Karten auf und addieren ihre Werte. Wer die wenigsten Punkte hat, bekommt 0 Punkte gutgeschrieben. Alle anderen notieren die Summe ihrer Karten als Minuspunkte. Hat der Cabo-Ansager nicht die meisten Minuspunkte eingespart, erhält er zusätzlich 5 Strafpunkte. Bei Gleichstand entscheidet die Cabo-Ansage zugunsten des Ansagers; teilen sich mehrere Nicht-Ansager die niedrigste Summe, gelten alle als Sieger und bekommen 0 Punkte.",
    },
    {
        heading: "Kamikaze & Kampagne",
        body: "Liegt am Ende genau die Kombination 12+12+13+13 vor, gewinnt der Spieler sofort, erhält 0 Punkte und alle anderen kassieren 50 Minuspunkte – eine echte Kamikaze-Runde. Über mehrere Partien hinweg könnt ihr Minuspunkte aufsummieren: Sobald jemand mehr als 100 Minuspunkte erreicht, endet die Serie. Exakt -100 Punkte werden auf -50 reduziert. Gewinner der Serie ist, wer insgesamt die höchste (also am wenigsten negative) Punktzahl besitzt; Gleichstände entscheidet die Anzahl der Cabo-Ansagen.",
    },
    {
        heading: "Den Tracker nutzen",
        body: "Im Bearbeitungsmodus kannst du Namen hinzufügen oder entfernen. Trage während einer Runde die aktuellen Kartenwerte jeder Person im Feld \"Rundenpunkte\" ein – per Plus/Minus oder direkt über die Tastatur. Tippe auf die Zielflagge, um eine Cabo-Ansage für den jeweiligen Spieler zu hinterlegen oder sie erneut anzutippen, um sie zurückzunehmen. Mit dem Kartensymbol markierst du eine Kamikaze-Kombination. Der Button unten rechts beendet die Runde: Der Tracker vergibt automatisch 0 Punkte an die Gewinner, addiert Minuspunkte für alle anderen (inklusive Cabo-Strafe) und berücksichtigt Sonderfälle wie Kamikaze oder den Sprung von genau -100 auf -50. Die Gesamtsummen laufen als Historie mit; die Daten werden automatisch gespeichert und stehen euch beim nächsten Start wieder zur Verfügung. Brauchst du einen Neustart, nutzt du im Header das Rücksetzen-Symbol.",
    },
];

export default function CaboRules() {
    const colorScheme = useColorScheme();
    const palette = themeColors[colorScheme === "light" ? "light" : "dark"];

    return (
        <ScrollView style={[{ flex: 1 }, palette.container]} contentContainerStyle={{ padding: 20, gap: 24 }}>
            <View style={{ gap: 16 }}>
                <Text variant="bodyMedium">
                    Diese Übersicht fasst die wichtigsten Regeln von Cabo zusammen und wie der Tracker zu benutzen ist.
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
