export const usePolyfill = (
  typeof CompressionStream === "undefined" ||
  typeof DecompressionStream === "undefined"
);

if (usePolyfill){
  const {
    CompressionStream,
    DecompressionStream
  } = await import("@stardazed/streams-compression");

  globalThis.CompressionStream = CompressionStream;
  globalThis.DecompressionStream = DecompressionStream;
}