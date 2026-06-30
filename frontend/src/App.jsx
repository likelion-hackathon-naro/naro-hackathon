import { useState } from "react";
import WorryInput from "./pages/WorryInput";
import ChoiceMap from "./pages/ChoiceMap";
import "./App.css";

function App() {
  const [step, setStep] = useState("input");
  const [worryData, setWorryData] = useState(null);

  if (step === "map" && worryData) {
    return <ChoiceMap worryData={worryData} />;
  }

  return (
    <WorryInput
      onSubmit={(data) => {
        setWorryData(data);
        setStep("map");
      }}
    />
  );
}

export default App;
