import React from "react";
import {StyleSheet, StyleProp, useColorScheme, Dimensions} from "react-native";
import {LineChart} from "react-native-chart-kit";

interface DataSet {
    data: number[];
    color?: (opacity: number) => string;
    strokeWidth?: number;
}

interface HistoryChartProps {
    data: {
        labels: string[];
        datasets: DataSet[];
    };
    style?: StyleProp<any>;
    shadow?: boolean;
    formatYLabel?: (label: string) => string;
}

const HistoryChart: React.FC<HistoryChartProps> = ({ data, style, shadow, formatYLabel }) => {
    const colorScheme = useColorScheme();

    return (
        <LineChart
            data={data}
            width={Dimensions.get("window").width * 0.95}
            height={220}
            withShadow={shadow != null ? shadow : true}
            chartConfig={{
                backgroundGradientFrom: colorScheme === "light" ? "#e880ff" : "#323232",
                backgroundGradientTo: colorScheme === "light" ? "#7141ba" : "#1c1c1c",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                propsForDots: {
                    r: "4",
                    strokeWidth: "1",
                    stroke: colorScheme === "light" ? "#6200ee" : "#1c1c1c",
                },
            }}
            formatYLabel={formatYLabel}
            bezier
            style={StyleSheet.flatten([custom.chart, style])}
        />
    );
}

const custom = StyleSheet.create({
    chart: {
        borderRadius: 16,
    },
});

export default HistoryChart;