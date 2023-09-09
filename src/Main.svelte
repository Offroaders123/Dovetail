<script lang="ts">
  import FormatOptions2 from "./FormatOptions.svelte";

  import type { FormatOptions } from "nbtify";

  const options: Required<FormatOptions> = {
    name: "",
    endian: "big",
    compression: null,
    bedrockLevel: null
  };
</script>

<main>
  <FormatOptions2 {options}/>
</main>