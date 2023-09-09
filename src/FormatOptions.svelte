<script lang="ts">
  import type { Compression } from "nbtify";

  let compression: Compression = null;
</script>

<dialog open>
  <form method="dialog">
    <fieldset>
      <legend>Compression: {compression}</legend>
      {#each ['none', 'gzip', 'deflate', 'deflate-raw'] as value}
        <label>
          <input
            type="radio"
            name="flavours"
            value={value}
            checked={value === compression}
            bind:group={compression}
          />
          {value}
        </label>
      {/each}
    </fieldset>
  </form>
</dialog>