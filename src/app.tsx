import { Button } from "@mantine/core";
import { ReactElement } from "react";
import MapInput from "./containers/mapinput";
import LocationTable from "./containers/locationtable";

const App = (): ReactElement => {
  return (
    <div id="app">
      <MapInput />
      <LocationTable />
    </div>
  );
};

export default App;
