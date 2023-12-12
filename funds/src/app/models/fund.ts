export class Fund{
    instrumentId: string;
    fundName: string;
    fundCompany: string;
    fundType: string;
    currency: string;
    startValue: number;
    closePrice: number;
    estimationDate: number;
    latestClosePriceDate: number;
    change1m: number;
    change3m: number;
    change3y: number;           
    yearHigh: number;
    yearLow: number;
    documents: string[];    
    administrativeFee: number;
    countDecimals: number;
    startDate: number;
    isin: number
}