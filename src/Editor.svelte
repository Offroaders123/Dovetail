<script lang="ts">
  export let value: string;
  export let disabled: boolean;
</script>

<textarea {disabled} placeholder="NBT data will show here..." wrap="off" spellcheck="false" autocomplete="off" autocapitalize="none" autocorrect="off">{value}</textarea>