export const usePolyfill = (
  typeof CompressionStream === "undefined" ||
  typeof DecompressionStream === "undefined"
);

if (usePolyfill){
  const {
    CompressionStream,
    DecompressionStream
  } = await import("https://cdn.jsdelivr.net/npm/@stardazed/streams-compression@1.0.0/+esm");

  globalThis.CompressionStream = CompressionStream;
  globalThis.DecompressionStream = DecompressionStream;
}