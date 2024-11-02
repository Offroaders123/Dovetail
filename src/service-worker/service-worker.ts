import { version as VERSION } from "../../package.json";

declare var self: ServiceWorkerGlobalScope;
declare const clients: Clients;

const NAME = "Flatlands";
const CACHE_NAME = `${NAME} v${VERSION}` as const;

self.addEventListener("activate",event => {
  event.waitUntil(removeOutdatedVersions());
});

self.addEventListener("fetch",event => {
  event.respondWith(matchRequest(event.request));
});

/**
 * Clears out old versions of the app from Cache Storage.
*/
async function removeOutdatedVersions(): Promise<void> {
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
*/
async function matchRequest(request: Request): Promise<Response> {
  let response = await caches.match(request);
  if (response !== undefined) return response;

  response = await fetch(request);
  await cacheRequest(request,response);

  return response;
}

/**
 * Adds a network request and response to Cache Storage.
*/
async function cacheRequest(request: Request, response: Response): Promise<void> {
  const cache = await caches.open(CACHE_NAME);
  await cache.put(request,response.clone());
}