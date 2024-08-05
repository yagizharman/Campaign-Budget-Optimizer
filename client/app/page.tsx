"use client";
// src/App.js
import React, { useState } from "react";
import axios from "axios";

function App() {
  const [totalBudgetZ, setTotalBudgetZ] = useState(10000);
  const [adBudgets, setAdBudgets] = useState([1000, 2000, 1500]);
  const [agencyFeePercentage, setAgencyFeePercentage] = useState(0.1);
  const [thirdPartyFeePercentage, setThirdPartyFeePercentage] = useState(0.05);
  const [fixedAgencyHoursCost, setFixedAgencyHoursCost] = useState(500);
  const [maxBudget, setMaxBudget] = useState(null);

  const handleCalculate = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5241/campaign/calculate",
        {
          totalBudgetZ,
          adBudgets,
          agencyFeePercentage,
          thirdPartyFeePercentage,
          fixedAgencyHoursCost,
        }
      );
      setMaxBudget(response.data.maxBudgetForTargetAd);
    } catch (error) {
      console.error("Error calculating max budget:", error);
    }
  };

  return (
    <div className="">
      <h1>Campaign Media Planning</h1>
      <div>
        <label>Total Budget Z: </label>
        <input
          type="number"
          value={totalBudgetZ}
          onChange={(e) => setTotalBudgetZ(parseFloat(e.target.value))}
        />
      </div>
      <div>
        <label>Ad Budgets (comma separated): </label>
        <input
          type="text"
          value={adBudgets.join(",")}
          onChange={(e) => setAdBudgets(e.target.value.split(",").map(Number))}
        />
      </div>
      <div>
        <label>Agency Fee Percentage: </label>
        <input
          type="number"
          step="0.01"
          value={agencyFeePercentage}
          onChange={(e) => setAgencyFeePercentage(parseFloat(e.target.value))}
        />
      </div>
      <div>
        <label>Third Party Fee Percentage: </label>
        <input
          type="number"
          step="0.01"
          value={thirdPartyFeePercentage}
          onChange={(e) =>
            setThirdPartyFeePercentage(parseFloat(e.target.value))
          }
        />
      </div>
      <div>
        <label>Fixed Agency Hours Cost: </label>
        <input
          type="number"
          value={fixedAgencyHoursCost}
          onChange={(e) => setFixedAgencyHoursCost(parseFloat(e.target.value))}
        />
      </div>
      <button onClick={handleCalculate}>Calculate</button>
      {maxBudget !== null && (
        <div>
          <h2>Maximum Budget for Target Ad: {maxBudget}</h2>
        </div>
      )}
    </div>
  );
}

export default App;
