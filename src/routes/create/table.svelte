<script lang="ts">
  export let users = [];
  export let sum = 0;
  export let today: string;

  // svelte-ignore export_let_unused
    export let name = '';


</script>
<style>
	table{
    width: 100%;
		border-collapse: 0;
		overflow: hidden;
		border-collapse: collapse;
        background-color: white;
        border-radius: 5px;
        border-top-left-radius: 0px;
        border-top-right-radius: 0px;
        

	}
	.b{
		border: 1px rgba(0, 0, 0, 0.144) solid;
	}
	.a{
		border-left: 1px rgba(0, 0, 0, 0.194) solid;
	}
	.table{
		display: inline-block;
		border: 1px rgba(0, 0, 0, 0.753) solid;
		border-radius: 7px;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        border-top: 0;
        width: 100%;
	}
	#q{
		border-bottom: 0;
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
    gap: 65px;
	}
	
    .qq{
        height: 25px;
		background-color: white;
		border: 1px black solid;
		display: flex;
		align-items: center;
        justify-content: start;
        padding-right: 5px;
		width: 100.5%;
    position: relative;
    left: 1px;
    width: 100.4%;
		

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
    .all{
        position: relative;
        box-shadow: 0 0 5px #00000048;
        border-radius: 5px;
        z-index: 100;
    }

    	.input-def {
		position: absolute;
		right: 7px;
		top: 50%;
		transform: translateY(-50%);
		color: #373737;
		pointer-events: none;
		font-size: 12px;
    z-index: 999;
	}
  th{
    width: 10px;
  }
  @media screen and (max-width: 400px) {
  .qq {
    gap: 5px !important;
    padding: 10px;
  }

  #name,
  #date {
    height: 20px;

    font-size: 13px;
  }
  .qq p {
    margin: 5px 0 0 0;
  }

  table {
    font-size: 12px;
  }

  th, :global(td) {
    padding: 6px 4px;
  }

  .input-def {
    right: 15px;
    top: 5px;
    transform: none;
    font-size: 11px;
  }

  .f {
    font-size: 14px;
  }
}
  td {
    border: 1px rgba(0, 0, 0, 0.13) solid;
    height: 50px;
  }
  .quantity-input, .price-input {
    height: 95%;
    border-radius: 5px;
    text-align: center;
  }
  input {
    border: 0 transparent;
    align-items: center;
    text-align: center;
    vertical-align: middle; 
    background-color: white;
    font-size: 16px;
    width: 100px;
    transition: border-color 0.3s ease;
    direction: ltr;
  }
  input:hover {
    box-shadow: 0 0 2px #000;
  }
  input:focus {
    animation: border-glow 0.4s ease;
    outline: none;
    border: 1px solid #0066ff99;
  }

</style>
<div class="all">
  <div class="table">
    <div class="qq" id="q">
      <input id="name" class="input" type="text" bind:value={name}/>
      <span class="input-def"> مالک: </span>
      <p class="f">فاکتور فروش</p>
      <input type="text" id="date" class="input" bind:value={today}  />
    </div>

    <div class="qq">
      <div class="add-bk"></div>
      <p id="sum-all">جمع نهایی: <span>{sum} تومان</span></p>
    </div>

    <table id="myTable">
      <thead>
        <tr>
          <th class="a">ردیف</th>
          <th class="a">شرح</th>
          <th class="a">تعداد</th>
          <th class="a">قیمت واحد (تومن)</th>
          <th class="b">جمع <span id="t">(تومان)</span></th>
        </tr>
      </thead>
      <tbody>
        {#each users as item, i}
          <tr>
            <td class="description-cell">{i + 1}</td>
            <td class="description-cell">{item.name} {@html item.hr}</td>
            <td><input type="number" class="quantity-input"  min="0"></td>
            <td><input type="number" class="price-input" id={"price" + (i + 1)}  min="0"/></td>
            <td class="sum-cell">0</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
