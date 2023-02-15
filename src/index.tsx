import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./app";
import { MantineProvider } from "@mantine/core";
import { RecoilRoot } from "recoil";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <RecoilRoot>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <App />
      </MantineProvider>
    </RecoilRoot>
  </React.StrictMode>
);
