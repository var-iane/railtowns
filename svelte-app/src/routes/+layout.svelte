<script>
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/stores';

  $: path = $page.url.pathname;

  $: theme =
    path.startsWith('/theme1-gridtowns') ? 'night' :
    path.startsWith('/theme2-railtowns') ? 'abyss' :
    path.startsWith('/theme3-ghosttowns') ? 'sunset' :
    'abyss';
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div data-theme={theme} class="min-h-screen">
	<header class="navbar bg-base-200 border-b border-base-300 mb-4">
	<div class="flex-1 px-4 text-xl font-bold">
		<a href="/" class="btn btn-ghost normal-case text-xl">Intro</a>
		<a href="/theme1-gridtowns" class="btn btn-soft btn-primary normal-case text-xl">Grids</a>
		<a href="/theme2-railtowns" class="btn btn-soft btn-secondary normal-case text-xl">Grooves</a>
		<a href="/theme3-ghosttowns" class="btn btn-soft btn-neutral normal-case text-xl">Ghosts</a>
	</div>
	</header>

	<main class="px-6 pb-20">
	<slot />
	</main>
</div>

<footer class="footer sm:footer-horizontal footer-center bg-base-200 text-base-content p-4">
  <aside>
    <p>See the code for this project on <a href="http://github.com/ariantics/railtowns">GitHub</a></p>
  </aside>
</footer>