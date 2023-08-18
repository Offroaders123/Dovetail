/// <reference no-default-lib="true"/>
/// <reference types="better-typescript/worker.d.ts"/>

var self = /** @type { ServiceWorkerGlobalScope } */ (/** @type { unknown } */ (globalThis));

const NAME = "Dovetail";
const VERSION = "v1.8.2";
const CACHE_NAME = /** @type { const } */ (`${NAME} ${VERSION}`);

self.addEventListener("activate",event => {
  event.waitUntil(removeOutdatedVersions());
});

self.addEventListener("fetch",event => {
  event.respondWith(matchRequest(event.request));
});

/**
 * Clears out old versions of the app from Cache Storage.
 * 
 * @returns { Promise<void> }
*/
async function removeOutdatedVersions(){
  const keys = await caches.keys();

  await Promise.all(keys.map(async key => {
    const isOutdatedVersion = key.startsWith(NAME) && key !== CACHE_NAME;

    if (isOutdatedVersion){
      await caches.delete(key);
    }
  }));

  await clients.claim();
}

/**
 * Matches a network request with it's cached counterpart from Cache Storage.
 * 
 * If it hasn't been cached yet, it will fetch the network for a response, cache a clone, then return the response.
 * 
 * @param { Request } request
 * @returns { Promise<Response> }
*/
async function matchRequest(request){
  let response = await caches.match(request);
  if (response !== undefined) return response;

  response = await fetch(request);
  await cacheRequest(request,response);

  return response;
}

/**
 * Adds a network request and response to Cache Storage.
 * 
 * @param { Request } request
 * @param { Response } response
 * @return { Promise<void> }
*/
async function cacheRequest(request,response){
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request,response.clone());
}