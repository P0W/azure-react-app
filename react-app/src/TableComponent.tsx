import React, { useMemo, useState } from "react";
import { ConfigComponent } from "./ConfigComponent";
import "./TableComponent.css";
import { Symbol, fetchOptionChainData } from "./utilities"

export interface TableRowData {
  group: string;
  ceStrike: number;
  ceLtp: number;
  peStrike: number;
  peLtp: number;
  loss?: number | 0.0;
  profit?: number | 0.0;
}

interface TableComponentProps {
  Instrument: Symbol;
  Expiry: string;
  CloseToPremium: number;
  StopLossFactor: number;
  Quantity: number;
  StrikesAndPrices: TableRowData[];
}

export const TableComponent: React.FC<TableComponentProps> = ({
  Instrument,
  Expiry,
  CloseToPremium,
  StopLossFactor,
  Quantity,
  StrikesAndPrices
}) => {
  const [closeToPremium, setCloseToPremium] = useState<number>(CloseToPremium);
  const [stopLossFactor, setStopLossFactor] = useState<number>(StopLossFactor);
  const [quantity, setQuantity] = useState<number>(Quantity);
  const [strikesAndPrices, setStrikesAndPrices] = useState<TableRowData[]>(StrikesAndPrices);

  const handleInputChange = (name: string, value: string) => {
    const val = parseFloat(value);
    // Check if the result is NaN, and if so, set it to 0
    const result = isNaN(val) ? 0 : val;
    if (name === "CloseToPremium") {
      setCloseToPremium(result);
    } else if (name === "StopLossFactor") {
      setStopLossFactor(result);
    } else if (name === "Quantity") {
      setQuantity(result);
    }
  };

  const onRefresh = async () => {
    console.log(`Fetch for latest ${closeToPremium}`);
    const response = await fetchOptionChainData(Instrument, closeToPremium);
    console.log(response);
    // update the table with new data response.strikes
    setStrikesAndPrices(response.strikes);
  };

  // Calculate MaxLoss and MaxProfit for each row
  const tableData = useMemo(() => {
    const calculateMaxLoss = (celtp: number, peltp: number) => {
      return quantity * (celtp + peltp);
    };

    const calculateMaxProfit = (celtp: number, peltp: number) => {
      return quantity * (1 - stopLossFactor) * (celtp + peltp);
    };

    return strikesAndPrices.map((rowData) => ({
      ...rowData,
      loss: calculateMaxLoss(rowData.ceLtp, rowData.peLtp),
      profit: calculateMaxProfit(rowData.ceLtp, rowData.peLtp)
    }));
  }, [quantity, stopLossFactor, strikesAndPrices]);

  const handleGroupClick = (groupName: string) => {
    console.log(`Clicked group: ${groupName}`);
    // send data to broker API
  };

  return (
    <div className="table-container">
      <div className="table-title">
        {Instrument.toString()}:{Expiry}
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th></th>
            <th colSpan={2}>CE</th>
            <th colSpan={2}>PE</th>
            <th colSpan={2}>P/L</th>
          </tr>
          <tr>
            <th></th>
            <th>Strike</th>
            <th>LTP</th>
            <th>Strike</th>
            <th>LTP</th>
            <th>Max Loss</th>
            <th>Max Profit</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((rowData, index) => (
            <tr key={index}>
              <td
                className="group-cell"
                onClick={() => handleGroupClick(rowData.group)}
              >
                {rowData.group}
              </td>
              <td>{rowData.ceStrike}</td>
              <td>{rowData.ceLtp}</td>
              <td>{rowData.peStrike}</td>
              <td>{rowData.peLtp}</td>
              <td className={rowData.loss >= 0 ? "positive" : "negative"}>
                {rowData.loss.toFixed(2)}
              </td>
              <td className={rowData.profit >= 0 ? "positive" : "negative"}>
                {rowData.profit.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfigComponent
        CloseToPremium={closeToPremium.toString()}
        StopLossFactor={stopLossFactor.toString()}
        Quantity={quantity.toString()}
        onChange={handleInputChange}
        onRefresh={onRefresh}
      />
    </div>
  );
};
