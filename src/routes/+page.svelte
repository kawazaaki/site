<script lang="ts">
  import Highlight from './Highlight.svelte';
  import { onMount } from 'svelte';
  import { getAllFactors, getAllRunners} from '$lib/db';
  import Card from './card.svelte';
  import Namenew from './name.svelte';
  import { goto } from '$app/navigation';
	import Name from './name.svelte';
  import { fade, scale } from 'svelte/transition';
  function goToCreate() {
    goto('/create');
  }
  function openFactor() {
    goto(`/view/${id}`);
  }

  
  export let id;
  const colors = [
    '#c4d8e3', '#c4e0e3', '#c4e3db', '#c4e3cc', '#d8e3c4',
    '#e3e3c4', '#e3d4c4', '#e3c8c4'
  ];

  let faktors: {
    id: number;
    name: string;
    sum: number;
    date: string;
  }[] = [];

  let activeDeleteId = null;
  onMount(async () => { faktors = await getAllFactors(); });

  let namenew = false;
  let focuson = false;
  let searchQuery = '';

  

  $: filteredFactors = faktors.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );


function highlight(text: string, query: string) {
  if (!text) return ''; 
  if (!query) return text;
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, `<span class="highlight">$1</span>`);
}

  
</script>


<style>

  :global(*){
    scrollbar-color: rgba(0, 0, 0, 0.477) rgba(0, 0, 0, 0);
    scrollbar-width:thin;
    font-family: "system-ui";
    direction: rtl;
  }

  main {
    min-height: 100vh;
    font-family: system-ui, sans-serif;
    padding: 1rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
    
  }

  header {
    width: 100%;
    height: 50px;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid rgba(0, 0, 0, 0.236);
  }

  #search {
    width: 200px;
    height: 25px;
    border-radius: 8px;
    padding-right: 10px;
    outline: 0;
    border: 1px rgba(0, 0, 0, 0.341) solid;
    position: absolute;
    right: 10px;
  }

  .createDiv {
    position: absolute;
    top: 100px;
    width: 40%;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
  }

  .bod {
    color: rgba(0, 0, 0, 0.712);
    position: absolute;
    top: 0;
    
  }
  .create{
    position: relative;
    top: 10px;
    transition: all 0.3s ease !important;
    width: 110px;
    height: 35px;
  }
  .create:hover{
    width: 120px;
    height: 40px;
  }
  :global(button) {
    padding: 0.5rem 1.2rem;
    border: none;
    background-color: #ff3e00;
    color: white;
    font-weight: bold;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  :global(button):hover {
    background-color: #d73700;
  }
  header button{
    position: absolute;
    left: 10px;
    display: flex;
    gap: 10px;
  }
  .adddd{
    padding: 0.5rem 1.2rem;
    border: none;
    background-color: rgb(107, 137, 255);
    color: white;
    font-weight: bold;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s;
    position:absolute;
    left:10px;
    outline:none;
  }
  .adddd:hover{
    background-color: rgb(79, 103, 195);
  }
  @media (max-width :950px){
    .createDiv{
      width: 60%;
    }
  }
  @media (max-width :570px){
    .createDiv{
      width: 80%;
    }
  }
  @media (max-width :470px){
    .createDiv{
      width: 100%;
    }
  }
  @media (max-width :610px){
    .createDiv{
      width: 90%;
    }
  }
  .backdrop {
	position: fixed;
	inset: 0;
  margin-top: 100px;
	background-color: rgba(255, 255, 255, 0.2);
	backdrop-filter: blur(3px);
	-webkit-backdrop-filter: blur(3px); 
	z-index: 999;
}
header .ser{
  border: 1px rgba(0, 0, 0, 0.355) solid;
  width: 250px;
  z-index: 1000;
  height: 300px;
  overflow-y: auto;
  position: fixed;
  top:49.50px;
  right: 0px;
  background-color: white;
  border-bottom-left-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 0px 0px;
  display: flex;
  align-items: center;
  flex-direction:column;
  
}
.card{
  width: 95%;
  height: 70px;
  border: 1px rgba(0, 0, 0, 0.295) solid;
  margin-top: 2px;
  margin-bottom: 2px;
  border-radius: 7px;
  flex-shrink: 0;
}
.p1{
  position: absolute;
  right: 15px;
}
.p2{
  position: absolute;
  left: 10px;
}
.p3{
  position: absolute;
  left: 15px;
  transform: translateY(45px);
}
.Openser{

  padding: 5px;
  width: 70px;
  position: absolute;
  right: 12px;
  transform: translateY(33px);
  padding-right: 10px;
}
</style>

<main>
  <header>
    <input type="text"
       name="search"
       autocomplete="off"
       id="search"
       placeholder="جستوجو اسم مالک..."
       bind:value={searchQuery}
       on:focus={() => focuson = true} />

{#if focuson}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="backdrop" transition:fade on:click={() => focuson = false}></div>
  <div class="ser" transition:fade>
    {#if filteredFactors.length === 0}
      <p>چیزی پیدا نشد</p>
    {/if}
{#each filteredFactors as f (f?.id)}
  <div class="card">
    <p class="p1">
      <Highlight text={f?.name ?? ''} query={searchQuery} />
    </p>
    <p class="p2">{f?.date}</p>
    <p class="p3">{f?.sum} تومن</p>
    <button class="Openser" on:click={() => goto(`/view/${f.id}`)}>باز کردن</button>
  </div>
{/each}

  </div>
{/if}

    

      
      

    
    {#if faktors.length > 0}
     <button class="adddd" on:click={goToCreate}>ساخت فاکتور</button>
    {/if}
  </header>


  <div class="createDiv">
  {#if faktors.length === 0}
    <div class="bod" style="display: flex; flex-direction: column; align-items: center;">
      <p> خوش اومدی.<br>اولین فاکتورتو بساز</p> 
      <button class="create" on:click={async () => {
          const runners = await getAllRunners();
          if (runners.length > 0) {
              goto('/create');
          } else {
              namenew = true;
          }
      }}>ساخت فاکتور</button>
    </div>
  {/if}
  {#each faktors as f, i (f.id)}
    <Card
      name={f.name}
      date={f.date}
      sum={f.sum}
      color={colors[i % colors.length]}
      id={f.id} 
      activeDeleteId={activeDeleteId}
      on:setDeleteId={(e) => activeDeleteId = e.detail}
      on:deleted={async () => {
        faktors = await getAllFactors();
      }}
      on:click={() => goto(`/print/${f.id}`)} 
    />


  {/each}
{#if namenew}
  <div class="backdrop" transition:fade>
    <Namenew
      on:close={() => namenew = false}
      on:saved={async (e) => {
        faktors = await getAllFactors();
        namenew = false;
        goto('/create');
      }}
    />
  </div>
{/if}




</div>
</main>
