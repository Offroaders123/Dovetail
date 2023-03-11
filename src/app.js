import "./compression-polyfill.js";
import * as NBT from "https://cdn.jsdelivr.net/npm/nbtify@1.20.1/dist/index.js";

console.log(NBT);

await navigator.serviceWorker.register("./service-worker.js");