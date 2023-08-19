<script lang="ts">
  import { Int32 } from "nbtify";

  import type { Name, Endian, Compression, BedrockLevel } from "nbtify";

  export let open: boolean = true;

  export let name: Name;
  $: name, console.log(name);

  export let endian: Endian;
  $: endian, console.log(endian);

  export let compression: Compression;
  $: compression, console.log(compression);

  export let bedrockLevel: BedrockLevel;
  $: bedrockLevel, console.log(bedrockLevel);

  $: rootNameDisabled = name === null;
</script>

<dialog {open}>
  <form method="dialog">
    <dialog-header>
      <h3>Format Options</h3>
      <button type="submit" aria-label="Close">✕</button>
    </dialog-header>

    <fieldset>
      <legend>Root Name</legend>

      <label>
        <input type="text" name="name" placeholder="<empty>" autocomplete="off" disabled={rootNameDisabled}>
      </label>
      <label>
        <input type="checkbox" name="disableName" bind:value={rootNameDisabled}>
        Disable
      </label>
    </fieldset>

    <fieldset>
      <legend>Endian</legend>

      <label>
        <input type="radio" name="endian" checked={endian === "big"} value="big">
        Big
      </label>
      <label>
        <input type="radio" name="endian" checked={endian === "little"} value="little">
        Little
      </label>
    </fieldset>

    <fieldset>
      <legend>Compression</legend>

      <div>
        <label>
          <input type="radio" name="compression" checked={compression === null} value="none">
          None
        </label>
        <label>
          <input type="radio" name="compression" checked={compression === "gzip"} value="gzip">
          gzip
        </label>
      </div>
      <div>
        <label>
          <input type="radio" name="compression" checked={compression === "deflate"} value="deflate">
          deflate (zlib)
        </label>
        <label>
          <input type="radio" name="compression" checked={compression === "deflate-raw"} value="deflate-raw">
          deflate-raw
        </label>
      </div>
    </fieldset>

    <fieldset>
      <legend>Bedrock Level</legend>

      <label>
        <input type="number" name="bedrockLevel" placeholder="<false>" min="0" max="4294967295">
        <code>(Uint32)</code>
      </label>
    </fieldset>
  </form>
</dialog>
