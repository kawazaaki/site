<script lang="ts">
  import jsPDF from 'jspdf';
  import { onMount, tick } from 'svelte';
  import { page } from '$app/stores';
  import { getDB, getAllFactors, getAllRunners } from '$lib/db';
  import { faktors } from '$lib/stores';
  import '../../../app.css';
  import { toPng } from 'html-to-image';
  import { currency } from '../../create/stores';
  import { selectedv } from '../../create/stores';
  import { FKtype } from '../../create/stores';
  import  '../../create/save.svelte';
  import { goto } from '$app/navigation';
  let runnerName = '';
  
  onMount(async () => {
  const runners = await getAllRunners();
  if (runners.length > 0) {

    runnerName = runners[runners.length - 1].name;
  }
});

  let sum = 0;
  let today = '';
  let factor;
  export let name;

  type UserItem = {
    name: string;
    hr?: string;
    quantity?: string;
    price?: string;
    total?: number;
  };

  let users: UserItem[] = [
    { name: "لوله 2" },
    { name: "لوله 1⁄1 اینچ" },
    { name: "لوله 1⁄2 اینچ" },
    { name: "لوله 1" },
    { name: "لوله ¾" },
    { name: "لوله 1⁄2" },
    { name: "دستمزد لوله 1⁄1" },
    { name: "دستمزد لوله 1⁄2" },
    { name: "دستمزد لوله 2" },
    { name: "دستمزد لوله 1" },
    { name: "اتصالات 1⁄1" },
    { name: "اتصالات 1" },
    { name: "ایجاد کلکتور" },
    { name: " قفل شونده 1 اینچ" },
    { name: " قفل شونده 1⁄2 اینچ" },
    { name: "شیر فرعی در مسیر" },
    { name: "رنگ" },
    { name: "نقشه G4" },
    { name: "نقشه G4 تجاری" },
    { name: "نقشه G6" },
    { name: "نقشه G6 تجاری" },
    { name: "نقشه G6 دو واحده" },
    { name: "نقشه G10" },
    { name: "نقشه G10 تجاری" },
    { name: "نقشه G10 سه واحده" },
    { name: "نقشه G25" },
    { name: "نقشه G40" },
    { name: "نقشه G65" },
    { name: "خدمات ثبت" },
    { name: "گردش پرونده شهری" },
    { name: "گردش پرونده روستایی" },
    { name: "مراجعات ناظر شهری" },
    { name: "مراجعات ناظر روستایی" },
    { name: "برشکاری 4" },
    { name: "برشکاری 3" },
    { name: "برشکاری 1⁄2" },
    { name: "برشکاری 2" },
    { name: "برشکاری 1⁄2" },
    { name: "برشکاری 1⁄1" },
    { name: "برشکاری 1" },
    { name: "جا به جایی کنتور" },
    { name: "نصب کنتور موجود" },
    { name: "نصب رگولاتور موجود" },
    { name: "پایین آوردن سیستم", hr: "برای هر واحد" },
    { name: "لوله کشی گاز  تجاری زیر 20 متر" },
    { name: "حمل وسایل" }
  ];

  function hideEmptyRows() {
    const rows = document.querySelectorAll<HTMLTableRowElement>('#myTable tbody tr');
    rows.forEach(row => {
      const qtyInput = row.querySelector<HTMLInputElement>('.quantity-input');
      const priceInput = row.querySelector<HTMLInputElement>('.price-input');
      const qty = parseFloat(qtyInput?.value || '0');
      const price = parseFloat(priceInput?.value || '0');
      if (qty <= 0 || price <= 0) {
        row.style.display = 'none';
      } else {
        row.style.display = '';
      }
    });
  }


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
      if (sumCell) sumCell.textContent = rowSum.toString();
      total += rowSum;
    });
    sum = total;
    const sumDisplay = document.querySelector<HTMLElement>('.sumAll');
    if (sumDisplay) sumDisplay.textContent = `جمع کل: ${sum} ${$currency}`;
  }



  async function captureAsPNG() {
    const node = document.documentElement;
    try {
      const dataUrl = await toPng(node, {
        width: node.scrollWidth,
        height: node.scrollHeight,
        backgroundColor: 'white',
        style: { transform: 'none', overflow: 'visible' }
      });
      const link = document.createElement('a');
      link.download = 'factur.png';
      link.href = dataUrl;
      link.click();
      goto ("/")
    } catch (error) {
      console.error('Failed to capture PNG', error);
    }
  }
  


  async function captureAsPDF() {
    const node = document.documentElement;
    try {
      const dataUrl = await toPng(node, {
        width: node.scrollWidth,
        height: node.scrollHeight,
        backgroundColor: 'white',
        style: { transform: 'none', overflow: 'visible' }
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('factur.pdf');
      goto ("/")
    } catch (error) {
      console.error('Failed to capture PDF', error);
    }
  }

onMount(async () => {
  const id = +$page.params.id;
  const db = await getDB();
  const f = await db.get('factors', id);
  const saved = await getAllFactors();
  faktors.set(saved);

  if (!f) return;
  factor = { ...f };
  name = f.name || '';
  today = f.date || '';

  users = users.map(u => {
    const found = f.items.find((item) => item.name === u.name);
    return found
      ? { ...u, ...found }
      : { ...u, quantity: '', price: '', total: 0 };
  });

  await tick();

  const rows = document.querySelectorAll<HTMLTableRowElement>('#myTable tbody tr');
  f.items.forEach((item, index) => {
    const row = rows[index];
    if (!row) return;
    const qtyInput = row.querySelector<HTMLInputElement>('.quantity-input');
    const priceInput = row.querySelector<HTMLInputElement>('.price-input');
    const sumCell = row.querySelector<HTMLElement>('.sum-cell');
    if (qtyInput) qtyInput.value = item.quantity || '';
    if (priceInput) priceInput.value = item.price || '';
    if (sumCell) sumCell.textContent = (parseFloat(item.quantity) * parseFloat(item.price)).toLocaleString('en-US');
  });

  calculateSums();
  hideEmptyRows();
  await tick();


  await handleCapture($selectedv);
});

async function handleCapture(value: string) {
  if (value === "1") {
    await captureAsPNG();
  } else if (value === "2") {
    await captureAsPDF();
  }
}



  window.addEventListener('message', async (event) => {
    if (event.data.action === 'capture') {
      const node = document.documentElement;
      try {
        const dataUrl = await toPng(node, {
          width: node.scrollWidth,
          height: node.scrollHeight,
          backgroundColor: 'white',
          style: {
            transform: 'none',
            overflow: 'visible',
          }
        });

        window.parent.postMessage({ action: 'captured', dataUrl }, '*');
      } catch (err) {
        window.parent.postMessage({ action: 'error', error: err.message }, '*');
      }
    }
  });
</script>





<style>

main  {
  width: 1907px;
  height: 2713px;

}

  table{
    width: 100%;
		border-collapse: 0;
		overflow: hidden;
		border-collapse: collapse;
    background-color: white;
    border-radius: 5px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    
        
        

	}
	.b{
		border: 1px rgba(0, 0, 0, 0.144) solid;
	}
	.a{
		border-left: 1px rgba(0, 0, 0, 0.194) solid;
	}
	.table{
		display: inline-block;
		border: 1px rgb(0, 0, 0) solid;
		border-radius: 7px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
       
    width: 1400px;
    display: flex;
    justify-content: center;
    position: absolute;
    top: 290px;
    


	}
	#q{
		border-bottom: 0;
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
    gap: 65px;
	}
	

	#date{
        width: 100px;
		z-index: 100;
		font-size: 14px;
		height: 20px;
		border: #00000046 solid 1px;
		border-radius: 8px;

	}
	#name{
		border: 1px rgba(0, 0, 0, 0.356) solid;
		width: 120px;
        border-radius: 5px;
		height: 15px;
		font-size: 12px;
		z-index: 100;
    padding-right: px;

  }
  th{
    font-size: 30px;
  }

  td {
    border: 1px rgba(0, 0, 0, 0.347) solid;
    height: 50px;
    font-size: 30px;
  }
  .quantity-input, .price-input {
    height: 95%;
    border-radius: 5px;
    text-align: center;
  }
  table input {
    border: 0 transparent;
    align-items: center;
    text-align: center;
    vertical-align: middle; 
    background-color: white;
    font-size: 40px;
    width: 100px;
    direction: ltr;
    position: relative;
    bottom: 1px;
  }
    main{
        direction: rtl;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-family: system-ui, sans-serif;
		padding: 1rem;
		text-align: center;
    min-height: 100%;
    }

    .p{
        position: relative;
        top: -1140px;
        left: 580px;
        display: flex;
		flex-direction:column-reverse;
		align-items:start;
        gap: 10px;


    }
    .p p{
        font-size: 40px;
    }
    .be{
      position: absolute;
      top: 10px;
      font-size: 50px;
      transform: translateX(100px);

    }

    .sumAll{
      width: 72%;
      height: 60px;
      position: absolute;
      top: 2230px;
      border: 1px black solid;
      border-radius:  8px;
      font-size: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-bottom: 15px;

      
    }
    .sumAll2{
      width: 72%;
      height: 60px;
      position: absolute;
      top: 1820px;
    }
    .description-cell{
      text-align: start;
      padding-right: 20px;
    }
    .sum-cell{
      width: 300px ;

      
      
    }
    .type{
      position: absolute;
      top: 0;
      right: 510px;
      z-index: 999;
      width: 300px;
      font-size: 30px;
    }
    .date{
      position: absolute;
      right: 1150px;
    }

</style>
<main>
  <div>
<p class="be">به نام خدا</p></div>
    <div class="p"> 
      
    <p >مجری: {runnerName}</p>
    <p  >مالک: {name}</p>
    <p class="date"> {today}</p>
    <h1 class="type">فاکتور فروش {$FKtype}</h1>
  
  </div>
    <div class="table"> 
    <div class="sumAll"> جمع کل: {sum} {$currency}</div>
    <div class="sumAll2"></div>
    <table id="myTable">
     
      <thead>
        <tr>
        </tr>
        
        <tr>
          <th class="a">ردیف</th>
          <th class="a">شرح</th>
          <th class="a">تعداد</th>
          <th class="a">قیمت واحد {$currency}</th>
          <th class="b">جمع <span id="t">{$currency}</span></th>
        </tr>
      </thead>
      <tbody>
        {#each users as item, i}

          <tr>
            <td class="description-cell">{i + 1}</td>
            <td class="description-cell">{item.name} {@html item.hr}</td>
            <td><input type="number" class="quantity-input"  min="0"></td>
            <td><input type="number" class="price-input" id={"price" + (i + 1)}  min="0"></td>
            <td class="sum-cell">0</td>
          </tr>
        {/each}</tbody>
      
    </table>
    </div>


    
</main>