/**
 * Specifies whether the Compression Streams API must be polyfilled to run in the current browser.
*/
export const usePolyfill: boolean = (() => {
  try {
    new CompressionStream("deflate-raw");
    new DecompressionStream("deflate-raw");
    return false;
  } catch {
    return true;
  }
})();

if (usePolyfill){
  const {
    makeCompressionStream,
    makeDecompressionStream
  } = await import("compression-streams-polyfill/ponyfill");

  globalThis.CompressionStream = makeCompressionStream(TransformStream);
  globalThis.DecompressionStream = makeDecompressionStream(TransformStream);
}