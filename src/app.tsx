import { ReactElement } from "react";
import LocationTable from "./containers/locationtable";
import MapInput from "./containers/mapinput";

const App = (): ReactElement => {
  return (
    <div id="app">
      <MapInput />
      <LocationTable />
    </div>
  );
};

export default App;
