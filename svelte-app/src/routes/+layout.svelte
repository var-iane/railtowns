<script>
  import "../app.css";
  import { base } from "$app/paths";
  import favicon from "$lib/assets/favicon.svg";

  let { children } = $props();

  const theme = "railtheme";

  const links = [
    { href: "", label: "Intro", short: "Intro" },
    { href: "/templatetowns", label: "Template towns", short: "Templates" },
    { href: "/arterytowns", label: "Artery towns", short: "Arteries" },
    { href: "/ghosttowns", label: "Ghost towns", short: "Ghosts" },
  ];
</script>

<svelte:head>
  <title>Railtowns</title>
  <link rel="icon" href={favicon} />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:ital,wght@0,200..800;1,200..800&family=Zen+Kaku+Gothic+New&family=Epilogue:ital,wght@0,100..900;1,100..900&family=Victor+Mono:ital,wght@0,100..700;1,100..700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div data-theme={theme} class="site">
  <header>
    <nav class="nav">
      {#each links as { href, label, short }}
        <a href={`${base}${href}/`} class="btn btn-soft btn-primary nav-link">
          <span class="label-short">{short}</span>
          <span class="label-full">{label}</span>
        </a>
      {/each}
    </nav>
  </header>

  <main>
    {@render children()}
  </main>

  
</div>

<style>
  .site {
    --navbar-height: 2rem;
    min-height: 100dvh;
  }

  header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    height: var(--navbar-height);
    background-color: var(--color-base-200);
    font-family: var(--font-main);
  }

  main {
    padding: var(--navbar-height) 0;
  }

  .nav {
    display: flex;
    flex: 1;
    align-items: center;
    gap: 0.5rem;
    min-width: 0;
    padding-inline: 1rem;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .nav::-webkit-scrollbar {
    display: none;
  }

  .nav-link {
    height: 1.2rem;
    padding-inline: 0.7rem;
    font-size: 0.85rem;
    font-weight: 300;
    white-space: nowrap;
  }

  .label-full {
    display: none;
  }

  footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    font-family: var(--font-main);
    font-size: 0.7rem;
    padding: 0.5rem 1rem;
    background-color: var(--color-base-300);
    color: var(--color-base-content);
  }

  @media (min-width: 560px) {
    .site {
      --navbar-height: 3rem;
    }
    .nav-link {
      height: 2rem;
      font-size: 1rem;
    }
    .label-short {
      display: none;
    }
    .label-full {
      display: inline;
    }
  }
</style>
