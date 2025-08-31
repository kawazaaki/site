//
<script>

    import { Radio } from "flowbite-svelte";
    import toast, { Toaster } from 'svelte-5-french-toast';
    import { createEventDispatcher } from 'svelte';
    import { currency } from '../stores.js';
    import { selectedv } from '../stores.js';
	let checked =false;
	$: currency.set(checked? 'ریال' : 'تومن')
    
	let isSaving = false;
	const dispatch = createEventDispatcher();

	function close() {
		dispatch('close');
	}
		
	function done() {
		if (isSaving) return;
		isSaving = true;

		dispatch('done');
		setTimeout(() => {
			isSaving = false;
		}, 3000);
	}



		


</script>
<style>
    label{
        font-size: 13px;
    }
.save {
	display: block;
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

:global(.radio-label){
	display: flex;
	align-items: center;
	margin: 10px;
	cursor: pointer;
	gap: 5px;
    color: #000000d7;
    font-size: 11px;
}

:global(.radio-label input[type="radio"]) {
	accent-color: #ff6600; 
	width: 16px;
	height: 16px;
}
button{
    font-size: 10px;
    background-color: rgba(3, 145, 10, 0.785);

}
button:hover{

    background-color: rgba(4, 124, 24, 0.785);

}
.red{
    background-color: #d70d0dc7;
}
.red:hover{
    background-color: #b40707c7;
}
input{
	position: relative;
	right: 18px;
	border-radius: 5px;
	height: 15px;
	margin-bottom: 20px;
	margin-top: 10px;
	
}
#check{
	position: relative;
	right: 18px;
	bottom: 5px;
}


</style>
<div class="save">
		<div>
            <h1>فاکتور مشتری</h1>
            <label class="radio-label">
				<Radio name="example1" value="1" bind:group={$selectedv} />
				ذخیره به عنوان عکس
			</label>
			<label class="radio-label">
				<Radio name="example1" value="2" bind:group={$selectedv} />
				ذخیره به عنوان PDF
			</label>
			<input type="checkbox" name="" bind:checked={checked}>
			<label for="rial" id="check" > قیمت به صورت ریال </label>
				
			<br>
                <button class="green" on:click={done} disabled={isSaving} >
				    {isSaving ? 'در حال ذخیره...' : 'ذخیره نهایی'}
				</button>
                <button class="red" on:click={close}>لغو</button>
			
		</div>
</div>	
<Toaster />