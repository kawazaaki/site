<!-- TODO:کامل کردن اینجا -->
<script lang="ts">
import { createEventDispatcher } from 'svelte';
import { saveRunner } from '../lib/db';

let isSaving = false;
let runnerName = '';

const dispatch = createEventDispatcher();

async function done() {
  if (!runnerName.trim()) return;
  isSaving = true;
  const id = await saveRunner({ name: runnerName });
  isSaving = false;
  dispatch('saved', { id, name: runnerName });
}

function close() {
  dispatch('close');
}

</script>
<style>
 
#all{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

}
.save{
  width: 250px;
  border: 1px rgba(0, 0, 0, 0.225) solid;
  padding: 10px;
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
}
.save :first-child{
  margin-bottom: 10px;


}
.save :first-child input{
  border: 1px rgba(0, 0, 0, 0.168) solid;
  height: 25px;
  border-radius: 8px;
  width: 93%;
  
}
.save :first-child p{
  text-align: start;
  margin:10px 10px 20px 10px;
  color: red;
  
  
}
.save :last-child{
  text-align: start;
  align-self: center;
  margin-right: 10px;
  gap: 10px;
}
.save :last-child :last-child{
  background-color: rgb(0, 0, 0);
  position: relative;
  left: 10px;
}


</style>
<div id="all">
  <div class="save">
    <div>
      <h1>نام و نام خانوادگی تو بنویس (مجری)</h1>
      <input type="text" bind:value={runnerName} placeholder="رضا رضایی..."/>
      <p>قابل تغییر نخواهد بود</p>
      
    </div>
    <div>
      <button class="green" on:click={done} disabled={isSaving} >
        {isSaving ? 'درحال ذخیره اسم...' : 'ادامه'}
      </button>
      <button class="red" on:click={close}>لغو</button>
    </div>
  </div>
</div>