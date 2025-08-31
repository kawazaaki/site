<script>
  import { fade } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  import { deleteFactor } from '$lib/db';
  import { goto } from '$app/navigation';

  export let name;
  export let date;
  export let sum;
  export let color;
  export let id;
  export let activeDeleteId;
  
  

  function openFactor() {
    goto(`/view/${id}`);
  }
  const dispatch = createEventDispatcher();

  const showDelete = () => {
    if (activeDeleteId !== id) {
      dispatch('setDeleteId', id);
    }
  };

  const closeDelete = () => {
    dispatch('setDeleteId', null);
  };

  const confirmDelete = async () => {
    await deleteFactor(id);
    dispatch('setDeleteId', null);
    dispatch('deleted'); 
  };

</script>



<style>

  .bk{
    background: rgba(214, 213, 213, 0.166);
    width: 90%;
    position: relative;
    left: 10px;
    border: 1px rgba(0, 0, 0, 0.259) solid;
    display: flex;
    padding-right: 0px;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding-top: 10px;
    border-radius: 8px;
    margin-bottom: 10px;
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
    

  }

  .delete {
    position: absolute;
    left: 10px;
    top: 15px;
  }




  .fuctor button {
    position: absolute;
    bottom: 10px;
    right: 15px;
    background-color: rgba(243, 126, 0, 0.623);
    color: black;
  }

  .fuctor button:hover {
    background-color: rgba(0, 0, 0, 0.677);
    color: #fff;
    
  }


  .fuctor {
    padding: 0 20px;
    position: relative;
    bottom: 5px;
    width: 95%;
    min-height: 100px;
    border-radius: 8px;
    background: linear-gradient(135deg, #f5f7fa, #c4d0e3 95%);
    
  }

  .info {
 
    
    min-width: 80px;
    flex-grow: 1;
    position: absolute;
    right: 90px;
    bottom: 10px;

  }
  .sum{
    position: relative;
    right: 20px;
    font-size: 15px;
    color: #000;

  }
  .n-sum{
    color: #000000c2;
    font-size: 12px;
  }
  .inf {
 
    
    min-width: 80px;
    flex-grow: 1;
    position: relative;
    left: 60px;

  }

  .name {
    font-size: 18px;
    font-weight: bold;
    position: absolute;
    right: 50px;
  }
  .del-window{
    width: 130px;
    height: 100px;
    border: rgba(0, 0, 0, 0.358) solid 1px;
    z-index: 999;
    position: absolute;
    top: 5px;
    border-radius: 8px;
    left: 60px;
    background-color: rgba(0, 0, 0, 0.748);
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.336);
    color: #fff;
    display: flex;
    justify-content: center;



  }
  .del-window button{
    position: relative;
    top: 3px;
    font-size: 12px;
    padding: 5px 10px;
    width: 50px;
    background-color: rgb(231, 2, 2);
    
  }
  .bt :last-child{
    background-color: rgba(233, 233, 233, 0.999);
    border: 1px solid rgba(0, 0, 0, 0.303);
    color: #000000;


  }
  .bt{
    background-color: #00000000;
    position: absolute;
    bottom: 5px;

  }
  .date{
    position: absolute;
    left: 20px;
    bottom: 10px;
  }
  

</style>
<div class="bk"> 
  {#if activeDeleteId === id}
    <div class="del-window" transition:fade={{ duration: 100 }}>
      فاکتور {name} حذف شود؟
      <div class="bt">
        <button on:click={confirmDelete}>آره</button>
        <button on:click={closeDelete}>نه</button>
      </div>
    </div>
  {/if}

<div class="fuctor" style={`background: linear-gradient(135deg, #f5f7fa, ${color} 95%)`}>
  <div class="inf">
   
    <p class="name">{name}</p>
    
  </div>


  <div class="info">
    <p class="n-sum">جمع کل</p>
    <p class="sum">{sum.toLocaleString('en-US')} تومان</p>
    

  </div>

  <p class="date">{date}</p>
  <p class="typd"></p>
  
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <img src="/delete.svg" alt="حذف" class="delete" on:click={showDelete} />
  <button on:click={openFactor}>باز کردن</button>
</div>
</div>

