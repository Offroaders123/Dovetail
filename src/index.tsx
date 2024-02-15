import "./compression-polyfill.js";
import { StrictMode } from "react";
import { render } from "react-dom";
import { App } from "./App.js";
import "./index.scss";

const platform: string = navigator.userAgentData?.platform ?? navigator.platform;
const appleDevice: boolean = /^(Mac|iPhone|iPad|iPod)/i.test(platform);
const isiOSDevice: boolean = appleDevice && navigator.maxTouchPoints > 1;

if (window.isSecureContext && !import.meta.env.DEV){
  await navigator.serviceWorker.register("./service-worker.js");
}

render(
  <StrictMode>
    <App isiOSDevice={isiOSDevice}/>
  </StrictMode>
,document.querySelector<HTMLDivElement>("#root")!);