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



.save {
 
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 280px;
	padding: 1rem;
	background-color: #ffffff;
	z-index: 1000;
	border: 1px solid #00000024;
	border-radius: 10px;
	box-shadow: 0 0 8px #00000033;
	font-size: 15px;
	text-align: right;
}



button{
  width: 50px;
    font-size: 10px;
    background-color: rgba(3, 145, 10, 0.785);
    transition: all 0.3s ease;

}
button:hover{

    background-color: rgba(4, 124, 24, 0.785);
    width: 55px;

}
.red{
    background-color: #d70d0dc7;
    position: absolute;
    left: 155px;
}
.red:hover{
    background-color: #b40707c7;
}
input{
	position: relative;
	right: 30px;
	border-radius: 5px;
	height: 15px;
	margin-bottom: 20px;
	margin-top: 10px;
  height: 20px;
  padding-bottom: 10px;
  transition: all 0.3s ease ;

	
}
.save div p{
  font-size: small;
  margin-right: 15px;
  color: rgb(246, 39, 39);
}


</style>

<div class="save">
  <div>
    <h1>نام و نام خانوادگی تو بنویس (مجری)</h1>
    <input type="text" bind:value={runnerName} placeholder="رضا رضایی..."/>
    <p>فقط برای قرار گرفتن در فاکتور </p>
    <p>قابل تغییر نخواهد بود</p>
    <br>
    <button class="green" on:click={done} disabled={isSaving} >
      {isSaving ? 'درحال ذخیره اسم...' : 'ادامه'}
    </button>
    <button class="red" on:click={close}>لغو</button>
  </div>
</div>
