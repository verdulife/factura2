<script context="module">
  export async function preload(page, session) {
    const { locale } = session;
    const def = "en";

    if (locale !== "es") return { locale: def };
    else return { locale: "es" };
  }
</script>

<script>
  import { stores } from "@sapper/app";
  import { l } from "../lib/stores";
  import Nav from "../components/Nav.svelte";

  export let segment, locale;
  $l = locale;
</script>

<svelte:head>
  <html lang={$l} />
</svelte:head>

<main>
  <Nav {segment} />

  <div class="view fill">
    <slot />
  </div>

  <footer class="row fcenter xfill">
    <p>Made with ♥ by verdu on 2021</p>
  </footer>
</main>

<style lang="scss" global>
  @import "../reset";
  @import "../../node_modules/verdu/verdu";

  .view {
    height: calc(100% - 90px);
  }

  footer {
    height: 25px;
    background: $pri;
    color: $white;
    font-size: 12px;
    margin-top: auto;
  }

  .autocomplete {
    width: 100% !important;
    height: auto !important;
  }

  .autocomplete-input {
    width: 100% !important;
    background: transparent !important;
    color: $base !important;
    font-size: 16px !important;
    border: 1px solid $border !important;
    padding: 0.9em 1em !important;
    transition: 200ms !important;
  }

  .autocomplete-list {
    top: unset !important;
    width: 100% !important;
  }

  .autocomplete-list-item {
    width: 100% !important;
  }
</style>
