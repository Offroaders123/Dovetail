<script lang="ts">
  import Header from "./Header.svelte";
  import Main from "./Main.svelte";

  import type { Format } from "nbtify";

  let options: Format = {
    name: "",
    endian: "big",
    compression: null,
    bedrockLevel: null
  };
</script>

<Header disabled={true}/>
<Main {options}/>