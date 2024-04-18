/* @refresh reload */
import "./compression-polyfill.js";
import { render } from "solid-js/web";
import { App } from "./App.js";
import "./index.scss";

const platform: string = navigator.userAgentData?.platform ?? navigator.platform;
const appleDevice: boolean = /^(Mac|iPhone|iPad|iPod)/i.test(platform);
const isiOSDevice: boolean = appleDevice && navigator.maxTouchPoints > 1;

if (window.isSecureContext && !import.meta.env.DEV){
  await navigator.serviceWorker.register("./service-worker.js");
}

const root: HTMLDivElement = document.querySelector("#root")!;

render(() => <App isiOSDevice={isiOSDevice}/>, root);