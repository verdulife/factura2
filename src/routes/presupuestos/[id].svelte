<script>
  import { fade } from "svelte/transition";
  import { stores, goto } from "@sapper/app";
  import { budgets, userData, bills } from "../../lib/stores";
  import { POST } from "../../lib/functions";

  const { page } = stores();
  let budgetData = $budgets.filter(
    (budget) => budget._id === $page.params.id
  )[0];
  let lineData = {};
  let loading = false;

  async function downloadBudget() {
    loading = true;
    try {
      const data = { ...budgetData };
      data.user = $userData;

      const req = await fetch("/print/budget", POST(data));
      if (!req.ok) throw await req.text();

      const res = await req.blob();
      const blob = URL.createObjectURL(res);

      /* const frame = document.createElement("iframe");
      frame.src = blob;
      frame.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 40%;
        height: 100%;
      `;
      document.body.appendChild(frame); */

      const link = document.createElement("a");
      link.href = blob;
      link.download = `Factura_${data.number}_${data.client.legal_id}.pdf`;
      link.click();

      setTimeout(() => {
        loading = false;
      }, 1000);
    } catch (error) {
      loading = false;

      console.log(error);
      alert("Algo ha salido mal. Vuelve a intentarlo");
      alert(error);
    }
  }

  function generateBill() {
    const check = confirm(
      "¿Quieres crear una facturar a partir de este presupuesto?"
    );

    if (!check) return;

    const number = $bills.length + 1;
    const bill = { ...budgetData };
    const billExists = $bills.some((b) => b._id === bill._id);

    if (billExists) {
      const check = confirm(
        "Ya se ha creado factura a partir de este presupuesto\n\n¿Quieres abrirla?"
      );
      
      if (!check) return;

      return goto(`/facturas/${bill._id}`);
    }

    bill.number = number;

    $bills = [...$bills, bill];
    goto("/facturas");
  }

  function deleteBudget() {
    const check = comfirm(
      "La numeracion de los otros presupuestos no se modificara. Recuerda usar la numeracion de este presupuesto en otro.\n\n¿Borrar definitivamente?"
    );

    if (check) {
      $budgets.splice($budgets.indexOf(budgetData), 1);
      $budgets = $budgets;
      goto("/presupuestos");
    }
  }

  function pushLine() {
    if (Object.keys(lineData).length === 4) {
      budgetData.items = [...budgetData.items, lineData];
      lineData = {};
    }
  }

  function removeLine(i) {
    budgetData.items.splice(i, 1);
    budgetData.items = budgetData.items;
  }

  $: base_total = () => {
    const result = budgetData.items.reduce((acc, curr) => {
      const amount_price = curr.price * curr.amount;

      if (curr.dto > 0) {
        let dto_price = amount_price - (amount_price * curr.dto) / 100;
        return acc + dto_price;
      }

      return acc + amount_price;
    }, 0);

    return result;
  };

  $: iva_total = () => {
    const result = (base_total() * $userData.iva) / 100;
    return result;
  };

  $: ret_total = () => {
    if (!$userData.ret) return 0;

    const result = (base_total() * $userData.ret) / 100;
    return result;
  };

  $: budget_total = () => {
    const result = base_total() + iva_total() - ret_total();
    return result;
  };

  function pushBudget() {
    if (budgetData.items.length > 0) {
      budgetData.totals = {
        base: base_total(),
        iva: iva_total(),
        ret: ret_total(),
        total: budget_total(),
      };

      $budgets = $budgets.map((budget) => {
        if (budget._id === budgetData._id) return (budget = budgetData);
        else return budget;
      });

      goto("/presupuestos");
    } else alert("⚠ No has añadido ningun concepto ⚠");
  }
</script>

<svelte:head>
  <title>Editar presupuesto | Facturas gratis</title>
  <meta property="og:title" content="Editar presupuesto | Facturas gratis" />
  <meta property="og:site_name" content="Facturas gratis" />

  <meta
    name="description"
    content="Herramientas online gratuitas para generar, enviar, rectificar y listar facturas, presupuestos, albaranes,
  clientes, proveedores y productos/servicios."
  />
  <meta
    property="og:description"
    content="Herramientas online gratuitas para generar, enviar, rectificar y listar facturas, presupuestos, albaranes,
  clientes, proveedores y productos/servicios."
  />
</svelte:head>

<div class="scroll">
  {#if budgetData}
    <section class="header col fcenter xfill">
      <img src="/presupuestos.svg" alt="Presupuestos" />
      <h1>Presupuesto nº {budgetData.number}</h1>
      <p>
        Con fecha {budgetData.date.day}/{budgetData.date.month}/{budgetData.date
          .year}
      </p>

      <div class="io-wrapper row jcenter xfill">
        <button class="succ semi" on:click={downloadBudget}
          >DESCARGAR PRESUPUESTO</button
        >
        <button class="link semi" on:click={generateBill}
          >GENERAR FACTURA</button
        >
        <button class="err semi" on:click={deleteBudget}
          >ELIMINAR PRESUPUESTO</button
        >
      </div>

      {#if loading}
        <div
          class="outer-loader col fcenter fill"
          transition:fade={{ duration: 100 }}
        >
          <img src="/loader.svg" alt="Generando PDF" />
          <h3>Genarando PDF</h3>
        </div>
      {/if}
    </section>

    <form
      class="budget-data col acenter xfill"
      on:submit|preventDefault={pushBudget}
    >
      <div class="box round col xfill">
        <h2>Datos del presupuesto</h2>
        <p class="notice">
          La numeración y fecha del presupuesto se rellenan automatiamente, pero
          puedes modificarlos.
        </p>

        <div class="row xfill">
          <div class="input-wrapper col grow">
            <label for="legal_name">Número</label>
            <input
              type="number"
              id="legal_name"
              class="xfill"
              bind:value={budgetData.number}
              required
            />
          </div>

          <div class="date-row row xhalf">
            <div class="input-wrapper date col">
              <label for="day">Día</label>
              <input
                type="number"
                id="day"
                min="1"
                max="31"
                class="xfill"
                bind:value={budgetData.date.day}
                required
              />
            </div>
            <div class="input-wrapper date col">
              <label for="month">Mes</label>
              <input
                type="number"
                id="month"
                min="1"
                max="12"
                class="xfill"
                bind:value={budgetData.date.month}
                required
              />
            </div>
            <div class="input-wrapper date col">
              <label for="year">Año</label>
              <input
                type="number"
                id="year"
                class="xfill"
                bind:value={budgetData.date.year}
                required
              />
            </div>
          </div>
        </div>
      </div>

      <div class="box round col xfill">
        <h2>Datos del cliente</h2>
        <p class="notice">
          Cada vez que añadas un cliente nuevo, este se guardara automatiamente.
        </p>

        <div class="input-wrapper col xfill">
          <label for="legal_name">NOMBRE FISCAL</label>
          <input
            type="text"
            id="leagal_name"
            bind:value={budgetData.client.legal_name}
            class="xfill"
            required
          />
        </div>

        <div class="row xfill">
          <div class="input-wrapper col xhalf">
            <label for="legal_id">CIF/NIF</label>
            <input
              type="text"
              id="leagal_id"
              bind:value={budgetData.client.legal_id}
              class="xfill"
              required
            />
          </div>

          <div class="input-wrapper col xhalf">
            <label for="contact">Conacto</label>
            <input
              type="text"
              id="contact"
              bind:value={budgetData.client.contact}
              class="xfill"
              required
            />
          </div>
        </div>

        <div class="row xfill">
          <div class="input-wrapper col xhalf">
            <label for="address">DIRECCION FISCAL</label>
            <input
              type="text"
              id="address"
              bind:value={budgetData.client.address}
              class="xfill"
              required
            />
          </div>

          <div class="col xhalf">
            <label for="cp">Código postal</label>
            <input
              type="text"
              id="cp"
              bind:value={budgetData.client.cp}
              class="xfill"
              required
            />
          </div>
        </div>

        <div class="row xfill">
          <div class="input-wrapper col xhalf">
            <label for="city">POBLACIÓN</label>
            <input
              type="text"
              id="city"
              bind:value={budgetData.client.city}
              class="xfill"
              required
            />
          </div>

          <div class="input-wrapper col xhalf">
            <label for="country">País</label>
            <input
              type="text"
              id="country"
              bind:value={budgetData.client.country}
              class="xfill"
              required
            />
          </div>
        </div>
      </div>

      <div class="box round col xfill">
        <h2>Conceptos</h2>
        <p class="notice">
          Cada vez que añadas un producto/servicio nuevo, este se guardara
          automatiamente.
        </p>

        {#if budgetData.items.length > 0}
          <ul class="budget-items col acenter xfill">
            {#each budgetData.items as item, i}
              <li class="line row xfill">
                <input
                  type="number"
                  id="amount"
                  bind:value={item.amount}
                  min="1"
                  class="out"
                  placeholder="CANT"
                />
                <input
                  type="text"
                  id="label"
                  bind:value={item.label}
                  class="out grow"
                  placeholder="CONCEPTO"
                />
                <input
                  type="number"
                  id="dto"
                  bind:value={item.dto}
                  min="0"
                  max="100"
                  class="out"
                  placeholder="DTO %"
                />
                <input
                  type="number"
                  id="price"
                  bind:value={item.price}
                  step="0.01"
                  class="out"
                  placeholder="UNIDAD €"
                />
                <input
                  type="text"
                  value="x"
                  class="out"
                  on:click={() => removeLine(i)}
                />
              </li>
            {/each}
          </ul>

          <h-div />

          <ul class="total-wrapper row jaround xfill">
            <li class="col acenter">
              <p class="label">Base imponible</p>
              <h3>{base_total().toFixed(2)}€</h3>
            </li>

            <li class="col acenter">
              <p class="label">IVA {$userData.iva}%</p>
              <h3>{iva_total().toFixed(2)}€</h3>
            </li>

            {#if $userData.ret}
              <li class="col acenter">
                <p class="label">IRPF {$userData.ret}%</p>
                <h3>-{ret_total().toFixed(2)}€</h3>
              </li>
            {/if}

            <li class="col acenter">
              <p class="label">Total</p>
              <h3>{budget_total().toFixed(2)}€</h3>
            </li>
          </ul>

          <h-div />
        {/if}

        <div class="new-line row xfill">
          <input
            type="number"
            id="amount"
            bind:value={lineData.amount}
            min="1"
            class="out"
            placeholder="CANT"
          />
          <input
            type="text"
            id="label"
            bind:value={lineData.label}
            class="out grow"
            placeholder="CONCEPTO"
          />
          <input
            type="number"
            id="dto"
            bind:value={lineData.dto}
            min="0"
            max="100"
            class="out"
            placeholder="DTO %"
          />
          <input
            type="number"
            id="price"
            bind:value={lineData.price}
            step="0.01"
            class="out"
            placeholder="UNIDAD €"
          />
        </div>

        <div class="line-btn pri xfill" on:click={pushLine}>
          AÑADIR PRODUCTO/SERVICIO
        </div>
      </div>

      <div class="box round col xfill">
        <h2>Notas</h2>
        <p class="notice">Si tienes que añadir o modificar la nota, este es el lugar.</p>
  
        <div class="input-wrapper col xfill">
          <label for="note">Notas</label>
          <textarea id="note" bind:value={budgetData.note} class="xfill" placeholder="Ej. Transporte no incluido" />
        </div>
      </div>

      <div class="row jcenter xfill">
        <button class="succ semi">GUARDAR CAMBIOS</button>
        <a href="/presupuestos" class="btn out semi">CANCELAR</a>
      </div>
    </form>
  {/if}
</div>

<style lang="scss">
  .header {
    background: linear-gradient(45deg, $pri 50%, $sec);
    text-align: center;
    color: $white;
    padding: 60px;

    @media (max-width: $mobile) {
      padding: 40px;
    }

    img {
      width: 100px;
      margin-bottom: 20px;
    }

    h1 {
      max-width: 900px;
      font-size: 5vh;
      line-height: 1;
      margin-bottom: 10px;
    }

    p {
      max-width: 900px;
      font-size: 18px;
      color: $sec;
      margin-bottom: 40px;

      @media (max-width: $mobile) {
        font-size: 14px;
      }
    }

    .io-wrapper {
      font-size: 12px;
    }

    .outer-loader {
      position: fixed;
      top: 0;
      left: 0;
      background: rgba($black, 0.7);
      backdrop-filter: blur(10px);
      pointer-events: none;

      img {
        width: 100px;
        margin-bottom: 20px;
      }
    }
  }

  .budget-data {
    padding: 60px;

    @media (max-width: $mobile) {
      padding: 20px 10px;
    }
  }

  .box {
    max-width: 900px;
    margin-bottom: 40px;
    padding: 20px;

    @media (max-width: $mobile) {
      margin-bottom: 10px;
    }

    .notice {
      font-size: 14px;
      margin-bottom: 40px;

      @media (max-width: $mobile) {
        font-size: 12px;
        margin-bottom: 30px;
      }
    }

    .input-wrapper {
      margin-bottom: 30px;

      @media (max-width: $mobile) {
        margin-bottom: 20px;
      }
    }

    label {
      text-transform: uppercase;
      color: $pri;
      font-size: 12px;
      padding: 0 15px;
    }

    input,
    select,
    textarea {
      font-size: 16px;
      border-bottom: 1px solid $sec;
      border-radius: 0;

      &:focus {
        border-color: $pri;
      }

      @media (max-width: $mobile) {
        font-size: 14px;
      }
    }

    textarea {
      border: 1px solid $border;
      resize: none;
    }

    .date {
      width: calc(100% / 3);
    }

    .date-row {
      @media (max-width: $mobile) {
        width: 100%;
      }
    }

    .line {
      &:nth-of-type(even) {
        background: lighten($border, 5%);
        border-top: 5px solid $white;
        border-bottom: 5px solid $white;
      }

      input:nth-of-type(1),
      input:nth-of-type(3),
      input:nth-of-type(4) {
        width: 15%;

        @media (max-width: $mobile) {
          width: 25%;
        }
      }

      input:nth-of-type(5) {
        cursor: pointer;
        width: 50px;
        background: $sec;
        text-align: center;
        color: $pri;
        font-weight: bold;

        &:hover {
          background: $pri;
          color: $sec;
        }
      }

      input:nth-of-type(3),
      input:nth-of-type(4),
      input:nth-of-type(5) {
        @media (max-width: $mobile) {
          width: calc(100% / 3);
        }
      }
    }

    h-div {
      margin: 40px 0;
    }

    .new-line {
      input:nth-of-type(1),
      input:nth-of-type(3),
      input:nth-of-type(4) {
        width: 15%;

        @media (max-width: $mobile) {
          width: 25%;
        }
      }

      input:nth-of-type(3),
      input:nth-of-type(4) {
        @media (max-width: $mobile) {
          width: calc(100% / 2);
        }
      }
    }

    .line-btn {
      cursor: pointer;
      background: $sec;
      text-align: center;
      font-size: 12px;
      padding: 1.3em;
      transition: 200ms;

      &:hover {
        background: $pri;
        color: $white;
      }
    }
  }

  .total-wrapper {
    li {
      margin: 10px;
    }
  }

  button {
    margin-right: 10px;

    @media (max-width: $mobile) {
      width: 70%;
      margin-right: 0;
      margin-bottom: 10px;
    }
  }

  a.btn {
    @media (max-width: $mobile) {
      width: 70%;
      text-align: center;
      margin-right: 0;
      margin-bottom: 10px;
    }
  }
</style>
