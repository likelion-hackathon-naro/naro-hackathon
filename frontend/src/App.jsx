import { useState } from "react";
import Landing from "./pages/Landing";
import WorryInput from "./pages/WorryInput";
import ChoiceMap from "./pages/ChoiceMap";
import "./App.css";

function App() {
  const [step, setStep] = useState("landing");
  const [worryData, setWorryData] = useState(null);

  if (step === "landing") {
    return (
      <Landing
        onStart={(initialData) => {
          setWorryData(initialData);
          setStep("input");
        }}
      />
    );
  }

  if (step === "map" && worryData) {
    return <ChoiceMap worryData={worryData} />;
  }

  return (
    <WorryInput
      initialData={worryData}
      onSubmit={(data) => {
        setWorryData(data);
        setStep("map");
      }}
    />
  );
}

export default App;
