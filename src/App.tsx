import { useState } from "react";
import { Standby as PorodomoStandbyView } from "./features/porodomo/components/Standby";
import { Working as PorodomoWorkingView } from "./features/porodomo/components/Working";
import { Breaking as PorodomoBreakingView } from "./features/porodomo/components/Breaking";
import { View } from "./types";
import "./App.css";

function App() {
  const [view, setView] = useState<View>("porodomo:standby");

  switch (view) {
    case "porodomo:standby":
      return <PorodomoStandbyView setView={setView} />;
    case "porodomo:working":
      return <PorodomoWorkingView setView={setView} />;
    case "porodomo:breaking":
      return <PorodomoBreakingView setView={setView} />;
  }
}

export default App;
