<script>
  import { l } from "../lib/stores";
  import { content } from "./_content";

  export let status, error;

  const dev = process.env.NODE_ENV === "development";
  const ui = content[$l];
</script>

<svelte:head>
  <title>{status} | facturasgratis</title>
</svelte:head>

<div class="col fcenter fill">
  <div class="error row jbetween aend">
    <div class="number">4</div>
    <div class="illustration">
      <div class="circle" />
      <div class="clip">
        <div class="paper">
          <div class="face">
            <div class="eyes">
              <div class="eye eye-left" />
              <div class="eye eye-right" />
            </div>
            <div class="rosyCheeks rosyCheeks-left" />
            <div class="rosyCheeks rosyCheeks-right" />
            <div class="mouth" />
          </div>
        </div>
      </div>
    </div>
    <div class="number">4</div>
  </div>

  {#if dev && error.stack}
    <pre class="xfill">{error.stack}</pre>
  {/if}
</div>

<style lang="scss">
  .error {
    box-sizing: unset !important;

    * {
      box-sizing: unset !important;
    }
  }

  .number {
    color: $pri;
    font-weight: bold;
    font-size: 15rem;
    line-height: 1;
  }

  .illustration {
    position: relative;
    width: 12.2rem;
    margin: 0 2.1rem;
  }

  .circle {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 12.2rem;
    height: 11.4rem;
    border-radius: 50%;
    background: $pri;
  }

  .clip {
    position: absolute;
    bottom: 0.3rem;
    left: 50%;
    transform: translateX(-50%);
    overflow: hidden;
    width: 12.5rem;
    height: 13rem;
    border-radius: 0 0 50% 50%;
  }

  .paper {
    position: absolute;
    bottom: -0.3rem;
    left: 50%;
    transform: translateX(-50%);
    width: 9.2rem;
    height: 12.4rem;
    border: 0.3rem solid $pri;
    background-color: $white;
    border-radius: 0.8rem;

    &::before {
      content: "";
      position: absolute;
      top: -0.7rem;
      right: -0.7rem;
      width: 1.4rem;
      height: 1rem;
      background-color: $white;
      border-bottom: 0.3rem solid $pri;
      transform: rotate(45deg);
    }
  }

  .face {
    position: relative;
    margin-top: 2.3rem;
  }

  .eyes {
    position: absolute;
    top: 0;
    left: 2.4rem;
    width: 4.6rem;
    height: 0.8rem;
  }

  .eye {
    position: absolute;
    bottom: 0;
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 50%;
    background-color: $pri;
    animation-name: eye;
    animation-duration: 4s;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
  }

  .eye-left {
    left: 0;
  }

  .eye-right {
    right: 0;
  }

  @keyframes eye {
    0% {
      height: 0.8rem;
    }
    50% {
      height: 0.8rem;
    }
    52% {
      height: 0.1rem;
    }
    54% {
      height: 0.8rem;
    }
    100% {
      height: 0.8rem;
    }
  }

  .rosyCheeks {
    position: absolute;
    top: 1.6rem;
    width: 1rem;
    height: 0.2rem;
    border-radius: 50%;
    background-color: $error;
  }

  .rosyCheeks-left {
    left: 1.4rem;
  }

  .rosyCheeks-right {
    right: 1.4rem;
  }

  .mouth {
    position: absolute;
    top: 3.1rem;
    left: 50%;
    width: 1.6rem;
    height: 0.2rem;
    border-radius: 0.1rem;
    transform: translateX(-50%);
    background-color: $pri;
  }

  a.btn {
    color: $white;
    text-transform: uppercase;
    font-size: 12px;
    margin: 3em 0;
  }
</style>
