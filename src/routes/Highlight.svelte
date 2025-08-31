<script lang="ts">
  export let text: string = '';
  export let query: string = '';

  // جدا کردن متن به بخش‌های عادی و هایلایت شده
  $: parts = query
    ? text.split(new RegExp(`(${query})`, 'gi')).map(part => ({
        text: part,
        highlight: part.toLowerCase() === query.toLowerCase()
      }))
    : [{ text, highlight: false }];
</script>

<span>
  {#each parts as part}
    {#if part.highlight}
      <span class="highlight">{part.text}</span>
    {:else}
      {part.text}
    {/if}
  {/each}
</span>

<style>
  .highlight {
    background-color: yellow;
    color: red;
    font-weight: bold;
    padding: 0 2px;
    border-radius: 3px;
  }
</style>
