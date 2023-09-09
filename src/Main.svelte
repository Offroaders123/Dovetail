<script lang="ts">
  import Editor from "./Editor.svelte";
  import FormatOptions2 from "./FormatOptions.svelte";

  import type { FormatOptions } from "nbtify";

  export let value: string = "";

  export let options: Required<FormatOptions>;
</script>

<main>
  <Editor {value} disabled={true} placeholder="NBT data will show here..."/>
  <FormatOptions2 {options}/>
</main>

<style>
  main {
    position: relative;
    flex-grow: 1;
    display: flex;
  }
</style>