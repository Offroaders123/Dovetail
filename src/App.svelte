<script lang="ts">
  import Header from "./Header.svelte";
  import Main from "./Main.svelte";

  import type { FormatOptions } from "nbtify";

  let options: Required<FormatOptions> = {
    name: "",
    endian: "big",
    compression: null,
    bedrockLevel: null
  };
</script>

<Header disabled={true}/>
<Main {options}/>