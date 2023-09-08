<script lang="ts">
  import Editor from "./Editor.svelte";

  export let value: string;
  export let disabled: boolean;
</script>

<main>
  <Editor {value} {disabled}/>
</main>