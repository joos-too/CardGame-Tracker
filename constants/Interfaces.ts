export interface Player {
    id: string;
    name: string;
    leftValue: number;
    rightValue?: number;
    totalValue: number[];
    color?: string;
}