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

  const CompressionStream = makeCompressionStream(TransformStream);
  const DecompressionStream = makeDecompressionStream(TransformStream);

  globalThis.CompressionStream = CompressionStream as typeof globalThis.CompressionStream;
  globalThis.DecompressionStream = DecompressionStream as typeof globalThis.DecompressionStream;
}