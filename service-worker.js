// @ts-check
/// <reference no-default-lib="true"/>
/// <reference types="better-typescript/worker"/>

const version = "Dovetail v1.1.0";

self.addEventListener("activate",event => {
  event.waitUntil(removeOutdatedVersions());
});

self.addEventListener("fetch",event => {
  event.respondWith(matchRequest(event.request));
});

/**
 * Clears out old versions of the app from Cache Storage.
*/
async function removeOutdatedVersions(){
  const keys = await caches.keys();

  await Promise.all(keys.map(async key => {
    const isOutdatedVersion = key.startsWith("Dovetail ") && key !== version;

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
*/
async function cacheRequest(request,response){
  const cache = await caches.open(version);
  await cache.put(request,response.clone());
}