<script>
  import { l } from "../lib/stores";
  import { content } from "./_content";

  export let status, error;

  const dev = process.env.NODE_ENV === "development";
  const ui = content[$l];
</script>

<svelte:head>
  <title>{status}</title>
</svelte:head>

<div class="col fcenter fill">
  <img src="door.svg" alt={error} />
  <h1>{status}</h1>
  <a href="." class="btn pri semi">{ui.error}</a>

  {#if dev && error.stack}
    <pre class="xfill">{error.stack}</pre>
  {/if}
</div>

<style lang="scss">
  img {
    width: 100%;
    max-width: 100px;
    margin-bottom: 2em;
  }

  h1 {
    font-size: 10vw;
  }

  a.btn {
    color: $white;
    text-transform: uppercase;
    font-size: 12px;
    margin: 3em 0;
  }
</style>
