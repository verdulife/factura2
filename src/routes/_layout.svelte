<script context="module">
  export async function preload(page, session) {
    const { locale } = session;
    const def = "en";

    if (locale !== "es") return { locale: def };
    else return { locale: "es" };
  }
</script>

<script>
  import { l } from "./_helpers/stores";
  import Nav from "../components/Nav.svelte";

  export let segment, locale;
  $l = locale;

  console.log(`User language is ${locale.toUpperCase()}`);
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
  }
</style>
