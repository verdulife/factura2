<script>
  import { goto } from "$app/navigation";
  import { storageSpace } from "../../lib/utils";
  import { userData, bills, budgets, deliveries, clients, products, providers } from "../../stores";

  $: user = $userData;
  let files;

  function exportData() {
    const localDb = {
      db_userData: $userData,
      db_bills: $bills,
      db_budgets: $budgets,
      db_deliveries: $deliveries,
      db_clients: $clients,
      db_products: $products,
      db_providers: $providers,
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(localDb));
    const link = document.createElement("a");

    link.href = dataStr;
    link.download = `${user.legal_name}.facturasgratis`;
    link.click();
  }

  function importData() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".facturasgratis";
    input.click();

    input.onchange = () => {
      let reader = new FileReader();

      reader.onload = (e) => {
        const { db_userData, db_bills, db_budgets, db_deliveries, db_clients, db_products, db_providers } = JSON.parse(
          e.target.result
        );

        $userData = db_userData;
        $bills = db_bills;
        $budgets = db_budgets;
        $deliveries = db_deliveries;
        $clients = db_clients;
        $products = db_products;
        $providers = db_providers;

        alert("Datos cargados correctamente ✔");
      };

      reader.readAsText(input.files[0]);
    };
  }

  function clearData() {
    localStorage.clear();

    $userData = {};
    $bills = [];
    $budgets = [];
    $deliveries = [];
    $clients = [];
    $products = [];
    $providers = [];

    alert("Datos borrados correctamente ✔");
  }

  function downloadData() {
    exportData();
    const check = confirm("¿Quieres borrar tambien tus datos?");

    if (check) {
      const check2 = prompt("Se borraran todos tus datos. Introduce tu CIF/NIF para confirmar.");

      if (check2 === $userData.legal_id) clearData();
    }
  }

  function uploadData() {
    if ($userData.legal_id) {
      const check = confirm("¿Quieres descargar tus datos antes de cargar unos nuevos?");

      if (check) exportData();

      const check2 = prompt("Se borraran todos tus datos. Introduce tu CIF/NIF para confirmar.");

      if (check2 === $userData.legal_id) {
        clearData();
        importData();
      }
    } else {
      importData();
    }
  }

  $: if (files) {
    let imageFile = files[0];
    let reader = new FileReader();

    reader.onload = (e) => {
      user.logo = e.target.result;
    };

    reader.readAsDataURL(imageFile);
  }

  function removeLogo() {
    files = undefined;
    delete user.logo;
    user = user;
  }

  function pushUser() {
    if (user.phone || user.email) {
      user._updated = new Date();
      $userData = user;
      goto("/");
    } else alert("⚠ No has añadido un método de contacto ⚠");
  }
</script>

<svelte:head>
  <title>Tus datos fiscales | Facturas gratis</title>
  <meta property="og:title" content="Tus datos fiscales | Facturas gratis" />
  <meta property="og:site_name" content="Facturas gratis" />

  <meta
    name="description"
    content="Herramientas online y completamente gratuitas para generar, enviar, rectificar y listar facturas, presupuestos, albaranes,
  clientes, proveedores y productos/servicios."
  />
  <meta
    property="og:description"
    content="Herramientas online y completamente gratuitas para generar, enviar, rectificar y listar facturas, presupuestos, albaranes,
  clientes, proveedores y productos/servicios."
  />
</svelte:head>

<div class="scroll">
  <section class="header col fcenter xfill">
    <h1>Tus datos de facturación</h1>
    <p>
      En <b>facturagratis</b>, usamos tu navegador como disco.
      <br /><br />
      Nuestra recomendacion es que descargues tus datos trimestalmente. Siempre podras volver a cargar tus datos y trabajar
      con ellos.
    </p>

    <!-- <div class="progress-bar col">
      <div class="bar" style="width: {storageSpace.percentage}%" />
    </div> -->

    <!-- {#if !storageSpace.percentage}
      <p>Calculando...</p>
    {:else}
      <p>
        <b>{storageSpace.percentage}%</b> del espacio de tu navegador usado
      </p>
      {/if} -->

    {#if user && user.legal_id}
      <p>
        Peso: <b>{storageSpace.usage}kb</b> | Ultima actualizacion:
        <b>{new Date($userData._updated).toLocaleDateString()}</b>
      </p>
    {/if}

    <div class="io-wrapper row jcenter xfill">
      {#if user && user.legal_id}
        <button class="succ semi" on:click={downloadData}>DESCARGAR DATOS</button>
      {/if}
      <button class="link semi" on:click={uploadData}>CARGAR DATOS</button>
    </div>
  </section>

  {#if user}
    <form class="info col acenter xfill" on:submit|preventDefault={pushUser}>
      <div class="box round col xfill">
        <h2>Logotipo</h2>
        <p class="notice">Si usas logotipo en tus facturas, presupuestos o albaranes, aqui es el sitio.</p>

        <div class="row xfill">
          <label for="logo" class="file-btn">SUBIR IMÁGEN</label>

          {#if user.logo}
            <div class="file-btn remove-btn" on:click={removeLogo}>BORRAR IMÁGEN</div>
          {/if}
        </div>

        <input type="file" id="logo" accept="image/png, image/jpeg" bind:files class="xfill" />

        {#if user.logo}
          <div class="logo-wrapper row fcenter xfill">
            <img src={user.logo} alt={user.legal_name || "Logotipo"} />
          </div>
        {/if}
      </div>

      <div class="box round col xfill">
        <h2>Datos legales</h2>
        <p class="notice">Los campos marcados con un 👈 son obligatorios.</p>

        <div class="input-wrapper col xfill">
          <label for="legal_name">Nombre fiscal 👈</label>
          <input
            type="text"
            id="legal_name"
            bind:value={user.legal_name}
            class="xfill"
            placeholder="Ej. Factura Gratis S.L."
            required
          />
        </div>

        <div class="input-wrapper col xfill">
          <label for="legal_id">CIF/NIF 👈</label>
          <input
            type="text"
            id="legal_id"
            bind:value={user.legal_id}
            class="xfill"
            placeholder="Ej. B00011100"
            required
          />
        </div>
      </div>

      <div class="box round col xfill">
        <h2>Dirección fiscal</h2>
        <p class="notice">Los campos marcados con un 👈 son obligatorios.</p>

        <div class="row xfill">
          <div class="input-wrapper col xhalf">
            <label for="street">Dirección fiscal 👈</label>
            <input
              type="text"
              id="street"
              bind:value={user.street}
              class="xfill"
              placeholder="Ej. Calle Mayor, 18"
              required
            />
          </div>

          <div class="input-wrapper col xhalf">
            <label for="cp">Código postal 👈</label>
            <input type="text" id="cp" bind:value={user.cp} class="xfill" placeholder="Ej. 08818" required />
          </div>
        </div>

        <div class="row xfill">
          <div class="input-wrapper col xhalf">
            <label for="city">Población 👈</label>
            <input type="text" id="city" bind:value={user.city} class="xfill" placeholder="Ej. Barcelona" required />
          </div>

          <div class="input-wrapper col xhalf">
            <label for="country">País 👈</label>
            <input type="text" id="country" bind:value={user.country} class="xfill" placeholder="Ej. España" required />
          </div>
        </div>
      </div>

      <div class="box round col xfill">
        <h2>Contacto</h2>
        <p class="notice">Puedes rellenar ambos campos, pero con uno es suficiente.</p>

        <div class="input-wrapper col xfill">
          <label for="phone">Teléfono</label>
          <input type="text" id="phone" bind:value={user.phone} class="xfill" placeholder="Ej. 600 600 600" />
        </div>

        <div class="input-wrapper col xfill">
          <label for="email">Correo electrónico</label>
          <input
            type="text"
            id="email"
            bind:value={user.email}
            class="xfill"
            placeholder="Ej. hola@facturagratis.com"
          />
        </div>
      </div>

      <div class="box round col xfill">
        <h2>Moneda e impuestos</h2>
        <p class="notice">Si no rellenas el campo del IRPF, no lo aplicaremos.</p>

        <div class="input-wrapper col xfill">
          <label for="currency">Moneda</label>
          <select id="currency" bind:value={user.currency} class="xfill" required>
            <option value="€">€</option>
            <option value="$">$</option>
            <option value="£">£</option>
            <option value="¥">¥</option>
            <option value="₹">₹</option>
          </select>
        </div>

        <div class="input-wrapper col xfill">
          <label for="iva">IVA %</label>
          <input type="number" id="iva" bind:value={user.iva} class="xfill" placeholder="Ej. 21" required />
        </div>

        <div class="input-wrapper col xfill">
          <label for="ret">IRPF %</label>
          <input type="number" id="ret" bind:value={user.ret} class="xfill" placeholder="Ej. 15" />
        </div>
      </div>

      <div class="box round col xfill">
        <h2>Notas</h2>
        <p class="notice">Añade notas a pie de tus facturas, presupuestos o albaranes.</p>

        <div class="input-wrapper col xfill">
          <label for="bill_note">Nota para facturas</label>
          <textarea id="bill_note" bind:value={user.bill_note} class="xfill" placeholder="Ej. Transporte no incluido" />
        </div>

        <div class="input-wrapper col xfill">
          <label for="budget_note">Nota para presupuestos</label>
          <textarea
            id="budget_note"
            bind:value={user.budget_note}
            class="xfill"
            placeholder="Ej. Transporte no incluido"
          />
        </div>

        <div class="input-wrapper col xfill">
          <label for="delivery_note">Nota para albarenes</label>
          <textarea
            id="delivery_note"
            bind:value={user.delivery_note}
            class="xfill"
            placeholder="Ej. Transporte no incluido"
          />
        </div>
      </div>

      <div class="row jcenter xfill">
        <button class="succ semi">GUARDAR DATOS</button>
        <a href="/" class="btn out semi">CANCELAR</a>
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

    h1 {
      max-width: 900px;
      font-size: 6vh;
      line-height: 1;
      margin-bottom: 40px;

      @media (max-width: $mobile) {
        margin-bottom: 20px;
      }
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

    .progress-bar {
      width: 80%;
      max-width: 300px;
      height: 10px;
      background: $sec;
      border: 1px solid $border;
      border-radius: 5px;
      margin-bottom: 10px;
      overflow: hidden;

      .bar {
        height: 100%;
        background: $success;
      }
    }

    .io-wrapper {
      font-size: 12px;

      button {
        color: $white;
      }
    }
  }

  .info {
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
      resize: none;

      &:focus {
        border-color: $pri;
      }

      @media (max-width: $mobile) {
        font-size: 14px;
      }
    }

    textarea {
      border: 1px solid $border;
    }

    input[type="file"] {
      display: none;
    }

    .logo-wrapper {
      background: $sec;
      border-radius: 0.5em;

      img {
        max-width: 100%;
        height: 250px;
        object-fit: contain;
        object-position: center;
      }
    }

    .file-btn {
      cursor: pointer;
      display: block;
      background-color: $pri;
      font-size: 12px;
      font-weight: bold;
      color: $white;
      border: 2px solid transparent;
      border-radius: 0.4em;
      padding: 0.9em 2em;
      margin: 0 10px 10px 0;
      user-select: none;
      -webkit-user-drag: none;
      transition: 200ms;

      &:hover {
        transform: scale(0.95);
      }
    }

    .remove-btn {
      background: transparent;
      color: $pri;
      border-color: $pri;
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
