<script>
  import { userData, products } from "../../lib/stores";
  import { roundWithTwoDecimals } from "../../lib/functions";
  import { tools } from "../../lib/utils";

  let productsData = [...$products];
  let searchTerm = "";

  $: filteredProducts = productsData.filter((product) => {
    const term = searchTerm.toLowerCase();
    const byName = product.label.toLowerCase();
    const byId = `${product.price}`.toLowerCase();

    return byName.indexOf(term) !== -1 || byId.indexOf(term) !== -1;
  });

  function clearFilters() {
    searchTerm = "";
  }
</script>

<svelte:head>
  <title>Productos y servicios | Facturas gratis</title>
  <meta property="og:title" content="Productos y servicios | Facturas gratis" />
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
  <section class="header col fcenter xfill">
    <img src="/productos-servicios.svg" alt="Productos y servicios" />
    <h1>{tools[4].title}</h1>
    <p>{tools[4].desc}</p>
  </section>

  {#if $userData.legal_name !== undefined}
    <div class="list-filter col acenter xfill">
      {#if productsData.length <= 0}
        <a class="btn succ semi" href="/productos-servicios/nueva">CREA TU PRIMER PRODUCTO</a>
      {:else}
        <a class="new-btn btn succ semi" href="/productos-servicios/nueva">NUEVO PRODUCTO</a>

        <div class="filter-wrapper row xfill">
          <input type="text" class="out grow" bind:value={searchTerm} placeholder="Buscar por nombre o precio" />
          <div class="clear-btn row acenter" on:click={clearFilters}>LIMPIAR FILTROS</div>
        </div>
      {/if}
    </div>

    <ul class="bill-list col acenter xfill">
      {#if filteredProducts.length <= 0 && productsData.length > 0}
        <p>No hay coincidencias</p>
      {/if}

      {#each filteredProducts as product}
        <li class="box round row xfill">
          <a href="/productos-servicios/{product._id}" class="row xfill">
            <div class="col grow">
              <h4>{product.label}</h4>
            </div>
            <p>{roundWithTwoDecimals(product.price).toFixed(2)}€</p>
          </a>
        </li>
      {/each}
      <div class="fix-bottom row xfill" />
    </ul>
  {:else}
    <div class="first col acenter xfill">
      <h2>Primeros pasos</h2>
      <p>Para poder empezar a generar productos, primero tienes que rellenar tus datos</p>
      <br />
      <a href="/ajustes" class="btn pri semi">RELLENAR DATOS</a>
    </div>
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
      margin-bottom: 20px;

      @media (max-width: $mobile) {
        margin-bottom: 20px;
      }
    }

    p {
      max-width: 900px;
      font-size: 18px;
      color: $sec;

      @media (max-width: $mobile) {
        font-size: 14px;
      }
    }
  }

  .new-btn {
    margin-bottom: 40px;
  }

  .list-filter,
  .bill-list {
    max-width: 900px;
    margin: 0 auto;
    padding: 40px;
    padding-bottom: 0px;

    @media (max-width: $mobile) {
      padding: 20px;
    }
  }

  .list-filter {
    .filter-wrapper {
      align-items: stretch;

      select {
        @media (max-width: $mobile) {
          width: 50%;
        }
      }
    }

    .clear-btn {
      cursor: pointer;
      background: $border;
      font-size: 12px;
      font-weight: bold;
      color: $base;
      border: 1px solid $border;
      padding: 1em 2em;
      user-select: none;
      -webkit-user-drag: none;
    }
  }

  .first {
    text-align: center;
    padding: 40px;

    a.btn.pri {
      color: $white !important;
    }
  }

  .bill-list {
    li {
      padding: 0;
      margin-bottom: 5px;
      transition: 200ms;

      &:nth-of-type(even) {
        background: $bg;
      }

      &:hover {
        background: $border;
      }

      a {
        padding: 1em;

        .title {
          margin-bottom: 20px;
        }

        .info {
          border-top: 1px solid $border;
          padding-top: 10px;

          a {
            padding: 0;
          }
        }
      }
    }

    .fix-bottom {
      height: 40px;
      pointer-events: none;
      user-select: none;
    }
  }
</style>
