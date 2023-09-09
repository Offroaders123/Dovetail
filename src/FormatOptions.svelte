<script lang="ts">
  import type { FormatOptions } from "nbtify";

  export let options: Required<FormatOptions>;
</script>

<dialog open>
  <form method="dialog">
    <div class="header">
      <h3>Format Options</h3>
      <button type="submit" aria-label="Close">✕</button>
    </div>

    <fieldset>
      <legend>Root Name</legend>

      <label>
        <input
          type="text"
          name="name"
          placeholder="<empty>"
          autocomplete="off"
        />
      </label>
      <label>
        <input
          type="checkbox"
          name="disableName"
          on:change={() => {
            // not sure
          }}
        />
        Disable
      </label>
    </fieldset>

    <fieldset>
      <legend>Endian: {options.endian}</legend>

      {#each ["big","little"] as value}
        <label>
          <input
            type="radio"
            name="endian"
            value={value}
            checked={value === options.endian}
          />
					{value}
        </label>
      {/each}
    </fieldset>

    <fieldset>
      <legend>Compression: {options.compression}</legend>

      {#each ["none","gzip","deflate","deflate-raw"] as value}
        <label>
          <input
            type="radio"
            name="compression"
            value={value}
            checked={value === options.compression}
            bind:group={options.compression}
          />
          {value}
        </label>
      {/each}
    </fieldset>

    <fieldset>
      <legend>Bedrock Level</legend>

      <label>
        <input
          type="number"
          name="bedrockLevel"
          placeholder="<false>"
          min="0"
          max="4294967295"
        />
        <code>(Uint32)</code>
      </label>
    </fieldset>
  </form>
</dialog>

<style>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>