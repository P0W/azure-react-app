
import { TableComponent } from "./TableComponent";
import { fetchOptionChainData, StrikesData, InstrumentsConfig, fetchOptionChainDataV2 } from "./utilities"
import "./styles.css";
import React, { useEffect, useState } from "react";

export default function App() {

  const [all_data, setData] = useState<StrikesData[]>([]);

  // call fetchOptionChainData on start of the app only
  useEffect(() => {
    const fetchData = async () => {
      const response: StrikesData[] = await Promise.all([
        fetchOptionChainData("NIFTY", InstrumentsConfig.NIFTY.close_to_premium),
        fetchOptionChainData("BANKNIFTY", InstrumentsConfig.BANKNIFTY.close_to_premium),
        fetchOptionChainData("FINNIFTY", InstrumentsConfig.FINNIFTY.close_to_premium),
      ]) ?? [];

      console.log(response);
      setData(response);
    };
    fetchData();
  }, []);


  return (
    <div>
      {(all_data)?.map((data: StrikesData, index: number) => {
        return (
          <TableComponent
            key={'StikesTable-' + index}
            Instrument={data.symbol}
            Expiry={data.expiry}
            CloseToPremium={data.cp}
            StopLossFactor={InstrumentsConfig[data.symbol].stop_loss_factor}
            Quantity={InstrumentsConfig[data.symbol].quantity}
            StrikesAndPrices={data.strikes}
          />
        );
      })}
    </div>
  );
}
