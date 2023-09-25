<script lang="ts">
  import Editor from "./Editor.svelte";
  import FormatOptions from "./FormatOptions.svelte";

  import type { Format } from "nbtify";

  export let value: string = "";

  export let options: Format;
</script>

<main>
  <Editor {value} disabled={true} placeholder="NBT data will show here..."/>
  <FormatOptions {options}/>
</main>

<style>
  main {
    position: relative;
    flex-grow: 1;
    display: flex;
  }
</style>