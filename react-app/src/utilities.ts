import axios from "axios";
import { TableRowData } from "./TableComponent";

export type Symbol = "NIFTY" | "BANKNIFTY" | "FINNIFTY";

export interface StrikesData {
  expiry: string;
  cp: number;
  symbol: Symbol;
  strikes: TableRowData[];
}


type Configs = {
  [key in Symbol]: {
    quantity: number;
    close_to_premium: number;
    stop_loss_factor: number;
  };
};

export const InstrumentsConfig: Configs = {
  NIFTY: {
    quantity: 50,
    close_to_premium: 7.50,
    stop_loss_factor: 1.55
  },
  BANKNIFTY: {
    quantity: 15,
    close_to_premium: 25,
    stop_loss_factor: 1.65
  },
  FINNIFTY: {
    quantity: 40,
    close_to_premium: 12.5,
    stop_loss_factor: 1.55
  }
};

export async function fetchOptionChainData(symbol: Symbol, closest_to_premium: number) {
  try {
    const functionAppUrl = `https://dailyshort.azurewebsites.net/api/strikes?code=bBfWP1iR2RNjmaUGiZwmSHkKPGpo2IjxlMpXHMo46uibAzFuYpDndg==&symbol=${symbol}&cp=${closest_to_premium}`
    const response = await axios.get(functionAppUrl);
    return response?.data as StrikesData;
  } catch (error) {
    console.error("Error fetching data:", error);
    return {} as StrikesData;
  }
}


export async function fetchOptionChainDataV2() {
  fetch("https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY", {
    "headers": {
      //"accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "max-age=0",
      "sec-ch-ua": "\"Not/A)Brand\";v=\"99\", \"Microsoft Edge\";v=\"115\", \"Chromium\";v=\"115\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "none",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
      "authority": "www.nseindia.com",
      "method": "GET",
      "path": "/api/option-chain-indices?symbol=NIFTY",
      "scheme": "https",
      "accept-encoding": "gzip, deflate, br",
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Edg/115.0.1901.188",
    },
    //"referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors",
    //"credentials": "include",
    
  }).then(response => {
    console.log(response?.json());
  })
}