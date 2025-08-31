
<script lang="ts">
	import {FKtype} from '../stores.js'
  	import { goto } from '$app/navigation';	
	import { getAllFactors, saveFactor } from '$lib/db';
	import ALLtable from './table.svelte';
	import Save from './save.svelte';
	import toast, { Toaster } from 'svelte-5-french-toast';
	import { onMount } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import '../../app.css';
	import { faktors } from '$lib/stores';

    let checked =false;
	$: FKtype.set(checked? 'توکار' : 'روکار')

	onMount(async () => {
	const saved = await getAllFactors();
	faktors.set(saved);
	});
	


	function collectValidRows() {
		const rows = document.querySelectorAll<HTMLTableRowElement>('#myTable tbody tr');
		const result = [];

		rows.forEach((row, index) => {
			const nameCell = users[index]?.name;
			const qtyInput = row.querySelector<HTMLInputElement>('.quantity-input');
			const priceInput = row.querySelector<HTMLInputElement>('.price-input');

			const qty = parseFloat(qtyInput?.value || '0');
			const price = parseFloat(priceInput?.value || '0');

			if (qty > 0 && price > 0) {
			result.push({
				name: nameCell,
				quantity: qty,
				price: price,
				total: qty * price
			});
			}
		});

		return result;
		}

    
	let showSave = false;
	let selectedValue = '1';
	let today: string = '';
	let sum = 0;

let users = [
	{ name: "لوله 2" },{ name: 'لوله ¼1 اینچ' },{ name: "لوله ½1 اینچ" },  { name: 'لوله 1' }, { name: 'لوله ¾' }, { name: 'لوله ½' },{ name: "دستمزد لوله ¼1" }, { name: "دستمزد لوله ½1" }, { name: "دستمزد لوله 2" },{ name: 'دستمزد لوله 1' },  
	{ name: 'اتصالات ¼1' }, { name: 'اتصالات 1' },{ name: 'ایجاد کلکتور' },{ name: ' قفل شونده 1 اینچ' },{ name: ' قفل شونده ½ اینچ' },
	{ name: 'شیر فرعی در مسیر' }, { name: 'رنگ' }, { name: 'نقشه G4' },{ name: "نقشه G4 تجاری" }, { name: "نقشه G6" }, { name: "نقشه G6 تجاری" }, 
	{ name: "نقشه G6 دو واحده" }, { name: "نقشه G10" },
	{ name: "نقشه G10 تجاری" }, { name: "نقشه G10 سه واحده" }, { name: "نقشه G25" }, 
	{ name: "نقشه G40" }, { name: "نقشه G65" },
	{ name: 'خدمات ثبت' }, { name: 'گردش پرونده شهری' },{ name: "گردش پرونده روستایی" }, { name: 'مراجعات ناظر شهری' },	{ name: "مراجعات ناظر روستایی" },  
	{ name: "برشکاری 4" },{ name: "برشکاری 3" },{ name: "برشکاری ½2" }, { name: "برشکاری 2" },{ name: "برشکاری ½1" }, { name: 'برشکاری ¼1' }, { name: 'برشکاری 1' }, { name: 'جا به جایی کنتور' },
	{ name: 'نصب کنتور موجود' }, { name: 'نصب رگولاتور موجود' },  { name: 'پایین آوردن سیستم', hr: 'برای هر واحد' },{ name: "لوله کشی گاز  تجاری زیر 20 متر" },
	{ name: 'حمل وسایل' }
];




	function calculateSums(): void {
		const rows = document.querySelectorAll<HTMLTableRowElement>('#myTable tbody tr');
		let total = 0;

		rows.forEach((row) => {
			const qtyInput = row.querySelector<HTMLInputElement>('.quantity-input');
			const priceInput = row.querySelector<HTMLInputElement>('.price-input');
			const sumCell = row.querySelector<HTMLElement>('.sum-cell');

			const qty = parseFloat(qtyInput?.value || '0');
			const price = parseFloat(priceInput?.value || '0');
			const rowSum = qty * price;

			if (sumCell) {
				sumCell.textContent = rowSum.toLocaleString('en-US');
			}

			total += rowSum;
		});

		sum = total;
		const sumDisplay = document.querySelector<HTMLElement>('#sum-all span');
		if (sumDisplay) {
			sumDisplay.textContent = `${sum.toLocaleString('en-US')} تومن`;
		}
	}

	function handleInput(event: Event): void {
		const target = event.target as HTMLElement;
		if (
			target instanceof HTMLInputElement &&
			(target.classList.contains('quantity-input') || target.classList.contains('price-input'))
		) {
			calculateSums();
		}
	}

onMount(() => {
	const formatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	});

	const parts = formatter.formatToParts(new Date());
	const year = parts.find(p => p.type === 'year')?.value;
	const month = parts.find(p => p.type === 'month')?.value.padStart(2, '0');
	const day = parts.find(p => p.type === 'day')?.value.padStart(2, '0');

	today = `${year}-${month}-${day}`;

	document.addEventListener('input', handleInput);

	document.addEventListener('keydown', (event: KeyboardEvent) => {
		if (event.key === 'Enter') {
			const orderedInputs = Array.from(
				document.querySelectorAll<HTMLInputElement>('.quantity-input, .price-input')
			);
			const currentIndex = orderedInputs.indexOf(document.activeElement as HTMLInputElement);
			if (currentIndex !== -1) {
				const next = orderedInputs[currentIndex + 1];
				if (next) {
					event.preventDefault();
					const scrollY = window.scrollY;
					requestAnimationFrame(() => {
						next.focus();
						window.scrollTo({ top: scrollY });
					});
				}
			}
		}
	});
});


</script>

<style>
	:global(main) {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		font-family: system-ui, sans-serif;
		padding: 1rem;
		text-align: center;
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

	* {
		direction: rtl;
		user-select: none;
		font-family: system-ui;
	}

	.btn {

		background-color: rgba(255, 160, 26, 0.998);
		color: rgb(0, 0, 0);
		width: 66px;
		height: 35px;
		transition: all 0.3s ease;
	}
	.btn:hover{
		background-color: rgb(230, 149, 35);


	}
	#black-btn:hover{
		background-color: #000000b8;


	}
	#black-btn {
		background-color: #000000d7;
		color: #fff;
	    transition: all 0.3s ease;
		width: 55px;
		height: 35px;


	}
	.bt{
		position: relative;
		top: 20px;
        display: flex;
		gap: 10px;
		padding-right: 20px;
		margin-bottom: 30px;
		transition: all 0.3s ease;
		width: 100%;
		justify-content: center;
		padding-left: 300px;
		z-index: 997;
	}

.backdrop {
	position: fixed;
	inset: 0;
	background-color: rgba(255, 255, 255, 0.2);
	backdrop-filter: blur(3px);
	-webkit-backdrop-filter: blur(3px); 
	z-index: 999;
}
@media screen and (max-width: 400px) {
  .btn {
    left: 40px !important;
    bottom: 0 !important;
  }




  main {
    padding: 0.5rem;
  }
}
:global(.toast-error) {
  background-color: #f44336 !important;
  color: white;
}

.checkbox-container {
  display: flex;

  position: absolute;
  top: 40px;
  width: 100%;
  justify-content: center;
  padding-right: 340px;
  gap: 10px;
  padding-left: 30px;
  

}

.ios-checkbox {
  --checkbox-size:25px;
  --checkbox-color: #3b82f6;
  --checkbox-bg: #dbeafe;
  --checkbox-border: #93c5fd;

  position: relative;
  display: inline-block;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.ios-checkbox input {
  display: none;

}

.checkbox-wrapper {
  position: relative;
  width: var(--checkbox-size);
  height: var(--checkbox-size);
  border-radius: 8px;
  transition: transform 0.2s ease;
}

.checkbox-bg {
  position: absolute;
  inset: 0;
  border-radius: 8px;
  border: 2px solid var(--checkbox-border);
  background: white;
  transition: all 0.2s ease;
}

.checkbox-icon {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 80%;
  height: 80%;
  color: white;
  transform: scale(0);
  transition: all 0.2s ease;
}

.check-path {
  stroke-dasharray: 40;
  stroke-dashoffset: 40;
  transition: stroke-dashoffset 0.3s ease 0.1s;
}

/* Checked State */
.ios-checkbox input:checked + .checkbox-wrapper .checkbox-bg {
  background: var(--checkbox-color);
  border-color: var(--checkbox-color);
}

.ios-checkbox input:checked + .checkbox-wrapper .checkbox-icon {
  transform: scale(1);
}

.ios-checkbox input:checked + .checkbox-wrapper .check-path {
  stroke-dashoffset: 0;
}

.ios-checkbox:hover .checkbox-wrapper {
  transform: scale(1.05);
}


.ios-checkbox:active .checkbox-wrapper {
  transform: scale(0.95);
}


.ios-checkbox input:focus + .checkbox-wrapper .checkbox-bg {
  box-shadow: 0 0 0 4px var(--checkbox-bg);
}

.ios-checkbox.red {
  --checkbox-color: #4f8dff;
  --checkbox-bg: #fee2e2;
  --checkbox-border: #000000ab;
  z-index: 998;
}

/* Animation */
@keyframes bounce {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.ios-checkbox input:checked + .checkbox-wrapper {
  animation: bounce 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

</style>

<main>
	<div class="bt">
	<button class="btn" id="black-btn"   on:click={() => goto('/')}>منو</button>
	<button class="btn" on:click={() => showSave = true}>ذخیره</button>
    </div>
	<ALLtable
		{users}
		{sum}
		{today}
	/>

	{#if showSave}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="backdrop" transition:fade on:click={() => showSave = false}></div>
		<div transition:scale={{ duration: 200 }} style="z-index: 1000;">
			<Save
            
			on:close={() => showSave = false}
			on:done={async () => {
			const validData = collectValidRows();

			if (validData.length > 0) {
				const nameInput = document.getElementById('name') as HTMLInputElement;
				const name = nameInput?.value || 'نامشخص';

			const newId = await saveFactor({
			name,
			date: today,
			sum,
			items: validData
			});

			toast.success('فاکتور با موفقیت ذخیره شد ');
			setTimeout(() => {
			showSave = false;
			goto(`/print/${newId}`);
			}, 2000);

			} else {
				toast.error('فاکتور خالی است ');
				showSave = false;
			}
			}}

			/>

		</div>
	{/if}
	
<div class="checkbox-container">
 <!-- svelte-ignore a11y_label_has_associated_control -->
 <label class="to" for="n">تغییر به توکار</label>
  <label class="ios-checkbox red">
	
    <input type="checkbox" bind:checked={checked} name="n"/>
    <div class="checkbox-wrapper">
      <div class="checkbox-bg"></div>
      <svg class="checkbox-icon" viewBox="0 0 24 24" fill="none">
        <path
          class="check-path"
          d="M4 12L10 18L20 6"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </svg>
    </div>
  </label>
</div>

</main>

<Toaster />
