
import { useState } from "react";
import "./App.css";
import { Standby as PorodomoStandbyView } from "./features/porodomo/Standby";
import { Working as PorodomoWorkingView } from "./features/porodomo/Working";
import { View } from "./types";

function App() {
  const [view, setView] = useState<View>("porodomo:standby");

  switch (view) {
    case "porodomo:standby":
      return <PorodomoStandbyView setView={setView} />;
    case "porodomo:working":
      return <PorodomoWorkingView />;

  }
}

export default App;
