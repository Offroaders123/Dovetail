<script lang="ts">
  export let value: string;
  export let disabled: boolean;
  export let placeholder: string;
</script>

<textarea
  {value}
  {disabled}
  {placeholder}
  wrap="off"
  spellcheck="false"
  autocomplete="off"
  autocapitalize="none"
  autocorrect="off"
/>

<style>
  textarea {
    padding: 8px;
    flex-grow: 1;
    font-size: 13px;
    font-family: ui-monospace, "Noto Sans Mono", "Cousine", monospace;
    line-height: 1.4;
    caret-color: currentColor;
    background: #aaaaaa40;
    border: 0 solid transparent;
    border-left-width: env(safe-area-inset-left);
    border-right-width: env(safe-area-inset-right);
    border-top: 1px solid #80808080;
    border-bottom-width: env(safe-area-inset-bottom);
    border-radius: 0;
    outline: none;
    resize: none;
  }

  textarea[disabled] {
    opacity: unset;
  }
</style>