import "./compression-polyfill.js";
import { render } from "solid-js/web";
import { App } from "./app.jsx";
import "./index.scss";

const platform: string = navigator.userAgentData?.platform ?? navigator.platform;
const appleDevice: boolean = /^(Mac|iPhone|iPad|iPod)/i.test(platform);
const isiOSDevice: boolean = appleDevice && navigator.maxTouchPoints > 1;

if (window.isSecureContext && !import.meta.env.DEV){
  await navigator.serviceWorker.register("./service-worker.js");
}

render(() => <App isiOSDevice={isiOSDevice}/>,document.querySelector<HTMLDivElement>("#root")!);