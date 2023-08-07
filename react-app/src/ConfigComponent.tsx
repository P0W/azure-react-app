import React, { useState } from "react";
import "./ConfigComponent.css";

interface ConfigComponentProps {
  CloseToPremium: string;
  StopLossFactor: string;
  Quantity: string;
  onChange: (name: string, value: string) => void;
  onRefresh: () => void;
}

export const ConfigComponent: React.FC<ConfigComponentProps> = ({
  CloseToPremium,
  StopLossFactor,
  Quantity,
  onChange,
  onRefresh
}) => {
  const [closeToPremium, setCloseToPremium] = useState(CloseToPremium);
  const [stopLossFactor, setStopLossFactor] = useState(StopLossFactor);
  const [quantity, setQuantity] = useState(Quantity);

  return (
    <div className="bottom-section">
      <div className="bottom-item">
        <table>
          <tbody>
            <tr>
              <td>
                <label>Close To Premium:</label>
              </td>
              <td>
                <input
                  type="text"
                  value={closeToPremium}
                  onChange={(e) => { onChange("CloseToPremium", e.target.value); setCloseToPremium(e.target.value);}}
                />
              </td>
              <td>
                <button className="refresh-button" onClick={onRefresh}>
                  Refresh
                </button>
              </td>
            </tr>
            <tr>
              <td>
                <label>Stop Loss Factor:</label>
              </td>
              <td>
                <input
                  type="text"
                  value={stopLossFactor}
                  onChange={(e) => {onChange("StopLossFactor", e.target.value); setStopLossFactor(e.target.value);}}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label>Quantity:</label>
              </td>
              <td>
                <input
                  type="text"
                  value={quantity}
                  onChange={(e) => {onChange("Quantity", e.target.value); setQuantity(e.target.value);}}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
