<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { getDB, getAllFactors, saveFactor, deleteFactor } from '$lib/db';
  import { goto } from '$app/navigation';
  import { faktors } from '$lib/stores';
  import ALLtable from './../../create/table.svelte';
  import Save from './../../create/save.svelte';
  import toast, { Toaster } from 'svelte-5-french-toast';
  import { fade, scale } from 'svelte/transition';
  import '../../../app.css';

  // مقدار id از load function میاد
  export let id: number;

  let sum = 0;
  let today = '';
  let name = '';
  let factor: any;
  let showSave = false;
  let isSaving = false;
  let hasChanges = false;

  type UserItem = {
    name: string;
    hr?: string;
    quantity: number | string;
    price: number | string;
    total: number;
  };

  const baseUsers = [
    { name: "لوله 2" }, { name: 'لوله 1⁄1 اینچ' }, { name: "لوله 1⁄2 اینچ" },
    { name: 'لوله 1' }, { name: 'لوله ¾' }, { name: 'لوله 1⁄2' },
    { name: "دستمزد لوله 1⁄1" }, { name: "دستمزد لوله 1⁄2" }, { name: "دستمزد لوله 2" },
    { name: 'دستمزد لوله 1' }, { name: 'اتصالات 1⁄1' }, { name: 'اتصالات 1' },
    { name: 'ایجاد کلکتور' }, { name: 'قفل شونده 1 اینچ' }, { name: 'قفل شونده 1⁄2 اینچ' },
    { name: 'شیر فرعی در مسیر' }, { name: 'رنگ' }, { name: 'نقشه G4' }, { name: "نقشه G4 تجاری" },
    { name: "نقشه G6" }, { name: "نقشه G6 تجاری" }, { name: "نقشه G6 دو واحده" },
    { name: "نقشه G10" }, { name: "نقشه G10 تجاری" }, { name: "نقشه G10 سه واحده" },
    { name: "نقشه G25" }, { name: "نقشه G40" }, { name: "نقشه G65" },
    { name: 'خدمات ثبت' }, { name: 'گردش پرونده شهری' }, { name: "گردش پرونده روستایی" },
    { name: 'مراجعات ناظر شهری' }, { name: "مراجعات ناظر روستایی" },
    { name: "برشکاری 4" }, { name: "برشکاری 3" }, { name: "برشکاری 1⁄2" },
    { name: "برشکاری 2" }, { name: 'برشکاری 1⁄1' }, { name: 'برشکاری 1' },
    { name: 'جا به جایی کنتور' }, { name: 'نصب کنتور موجود' },
    { name: 'نصب رگولاتور موجود' }, { name: 'پایین آوردن سیستم', hr: 'برای هر واحد' },
    { name: "لوله کشی گاز تجاری زیر 20 متر" }, { name: 'حمل وسایل' }
  ];

  let users: UserItem[] = baseUsers.map(u => ({ ...u, quantity: '', price: '', total: 0 }));

  let initialState = { name: '', date: '', items: [] as { name: string; quantity: number; price: number; total: number }[] };

  onMount(async () => {
    const db = await getDB();
    const f = await db.get('factors', id);
    const saved = await getAllFactors();
    faktors.set(saved);

    document.addEventListener('input', handleInput);
    document.addEventListener('keydown', handleKeyDown);

    if (!f) return;

    factor = { ...f };
    today = f.date || '';
    name = f.name || '';

    users = users.map(u => {
      const found = f.items.find(item => item.name === u.name);
      return found ? { ...u, ...found } : { ...u, quantity: '', price: '', total: 0 };
    });

    initialState = {
      name,
      date: today,
      items: users.map(u => ({
        name: u.name,
        quantity: +u.quantity || 0,
        price: +u.price || 0,
        total: +u.total || 0
      }))
    };

    await tick();

    const rows = document.querySelectorAll<HTMLTableRowElement>('#myTable tbody tr');
    f.items.forEach((item, index) => {
      const row = rows[index];
      if (!row) return;
      row.querySelector<HTMLInputElement>('.quantity-input')!.value = item.quantity;
      row.querySelector<HTMLInputElement>('.price-input')!.value = item.price;
      row.querySelector<HTMLElement>('.sum-cell')!.textContent = (item.quantity * item.price).toLocaleString('en-US');
    });

    calculateSums();
    hasChanges = checkChanges();
  });

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && document.activeElement instanceof HTMLInputElement) {
      const inputs = Array.from(document.querySelectorAll<HTMLInputElement>('.quantity-input, .price-input'));
      const index = inputs.indexOf(document.activeElement);
      if (index !== -1) {
        const next = inputs[index + 1];
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
  }

  function handleInput(e: Event) {
    const el = e.target as HTMLInputElement;
    if (el && (el.classList.contains('quantity-input') || el.classList.contains('price-input'))) {
      calculateSums();
      hasChanges = checkChanges();
    }
  }

  function calculateSums() {
    const rows = document.querySelectorAll<HTMLTableRowElement>('#myTable tbody tr');
    let total = 0;
    rows.forEach(row => {
      const qty = parseFloat(row.querySelector<HTMLInputElement>('.quantity-input')?.value || '0');
      const price = parseFloat(row.querySelector<HTMLInputElement>('.price-input')?.value || '0');
      const sumRow = qty * price;
      row.querySelector<HTMLElement>('.sum-cell')!.textContent = sumRow.toLocaleString('en-US');
      total += sumRow;
    });
    sum = total;
    document.querySelector<HTMLElement>('#sum-all span')!.textContent = `${sum.toLocaleString('en-US')} تومن`;
  }

  function collectValidRows() {
    const rows = document.querySelectorAll<HTMLTableRowElement>('#myTable tbody tr');
    const result: { name: string; quantity: number; price: number; total: number }[] = [];
    const invalids: string[] = [];

    rows.forEach(row => {
      const name = row.querySelectorAll('td')[1]?.textContent?.trim() || '';
      const qty = parseFloat(row.querySelector<HTMLInputElement>('.quantity-input')?.value || '0');
      const price = parseFloat(row.querySelector<HTMLInputElement>('.price-input')?.value || '0');

      if (qty > 0 && price > 0) {
        result.push({ name, quantity: qty, price, total: qty * price });
      } else if (qty > 0 || price > 0) {
        invalids.push(name);
      }
    });

    if (invalids.length) {
      toast.error(`ردیف ناقص: ${invalids.join(', ')}`);
    }

    return result;
  }

  function checkChanges(): boolean {
    const currentItems = users.map(u => ({
      name: u.name,
      quantity: +u.quantity || 0,
      price: +u.price || 0,
      total: +u.total || 0
    }));

    const currentState = {
      name,
      date: today,
      items: currentItems
    };

    return !isSameFactor(initialState, currentState);
  }

  $: hasChanges = checkChanges();

  function isSameFactor(f1: any, f2: any) {
    if (f1.name !== f2.name) return false;
    if (f1.date !== f2.date) return false;
    if (f1.items.length !== f2.items.length) return false;

    for (let i = 0; i < f1.items.length; i++) {
      const a = f1.items[i];
      const b = f2.items[i];
      if (a.name !== b.name || a.quantity !== b.quantity || a.price !== b.price || a.total !== b.total) {
        return false;
      }
    }
    return true;
  }
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
		position: relative;
		left: 100px;
		bottom: 16px;
		background-color: rgba(255, 160, 26, 0.998);
		color: rgb(0, 0, 0);
    transition: background-color 0.3s ease;
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
		position: relative;
		left: 180px;
		top: 19.5px;
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

  #black-btn {
    top: 45px !important;
    left: 120px !important;
    margin-bottom: 10px;
  }

  main {
    padding: 0.5rem;
  }
}
:global(.toast-error) {
  background-color: #f44336 !important;
  color: white;
}
</style>

<main>
  <button class="btn" id="black-btn" on:click={() => goto('/')}>بازگشت</button>
  <button class="btn" on:click={() => showSave = true}>ذخیره</button>

  {#if today}
    <ALLtable {users} {sum} bind:today bind:name={name}/>
  {/if}

  {#if showSave}
    <div class="backdrop" transition:fade></div>
    <div transition:scale={{ duration: 200 }} style="z-index: 1000;">
      <Save
        on:close={() => showSave = false}
        on:done={async () => {
          const validData = collectValidRows();

          if (validData.length > 0) {
            if (factor?.id) {
              await deleteFactor(factor.id);
            }

            const nameInput = document.getElementById('name') as HTMLInputElement;
            const nameValue = nameInput?.value || 'نامشخص';

            const newId = await saveFactor({
              name: nameValue,
              date: today,
              sum,
              items: validData
            });

            toast.success('فاکتور با موفقیت ذخیره شد');
            setTimeout(() => {
              showSave = false;
              goto(`/print/${newId}`);
            }, 2000);

          } else {
            toast.error('فاکتور خالی است');
            showSave = false;
          }
        }}
      />
    </div>
  {/if}

</main>

<Toaster />