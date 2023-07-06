/**
 * Specifies whether the Compression Streams API must be polyfilled to run in the current browser.
*/
const USE_POLYFILL: boolean = (() => {
  try {
    new CompressionStream("deflate-raw");
    new DecompressionStream("deflate-raw");
    return false;
  } catch {
    return true;
  }
})();

if (USE_POLYFILL){
  const {
    makeCompressionStream,
    makeDecompressionStream
  } = await import("compression-streams-polyfill/ponyfill");

  globalThis.CompressionStream = makeCompressionStream(TransformStream);
  globalThis.DecompressionStream = makeDecompressionStream(TransformStream);
}

export default USE_POLYFILL;