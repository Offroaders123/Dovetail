<script lang="ts">
  import type { FormatOptions } from "nbtify";

  export let options: Required<FormatOptions>;
</script>

<dialog open>
  <form method="dialog">
    <div class="dialog-header">
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
      <legend>Endian</legend>

      {#each ["big","little"] as value}
        <label>
          <input
            type="radio"
            name="endian"
            value={value}
            checked={value === options.endian}
          />
					{value.charAt(0).toUpperCase() + value.slice(1)}
        </label>
      {/each}
    </fieldset>

    <fieldset class="grid-group">
      <legend>Compression</legend>

      {#each ["none","gzip","deflate","deflate-raw"] as value}
        <label>
          <input
            type="radio"
            name="compression"
            value={value}
            checked={value === options.compression}
            bind:group={options.compression}
          />
          {#if value === "none"}
            None
          {:else if value === "deflate"}
            {value} (zlib)
          {:else}
            {value}
          {/if}
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
  dialog {
    -webkit-user-select: none;
    user-select: none;
  }

  .dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  form {
    display: flex;
    gap: 0.75rem;
    flex-direction: column;
  }

  .grid-group {
    display: grid;
    gap: 0.25em;
    grid-template-columns: max-content max-content;
  }
</style>