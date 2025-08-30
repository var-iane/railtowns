<script>
	import { page } from '$app/stores';
	import { base } from '$app/paths';

  $: path = $page.url.pathname;

  $: theme =
  	path === `${base}/` ? 'abyss' :
    path.startsWith(`${base}/1-gridtowns`) ? 'abyss' :
    path.startsWith(`${base}/2-railtowns`) ? 'abyss' :
    path.startsWith(`${base}/3-ghosttowns`) ? 'abyss' :
    'abyss';

</script>

<svelte:head>
	<link rel="icon" href={`${base}/favicon.svg`} />
	<title>Railroad towns</title>
</svelte:head>

<style></style>

<div data-theme={theme} class="min-h-screen">
	<header class="navbar bg-base-200 border-b border-base-300 mb-4">
	<div class="flex-1 px-4 font-inconsolata">
		<a href={`${base}/`} class="btn btn-soft btn-secondary text-xl font-light">Intro</a>
		<a href={`${base}/1-gridtowns`} class="btn btn-soft btn-primary text-xl font-light">Template towns</a>
		<a href={`${base}/2-railtowns`} class="btn btn-soft btn-warning text-xl font-light">Rail towns</a>
		<a href={`${base}/3-ghosttowns`} class="btn btn-soft btn-error text-xl font-light">Ghost towns</a>
	</div>
	</header>

	<main class="pt-16 px-6 pb-20">
	<slot />
	</main>
</div>

<footer class="footer sm:footer-horizontal footer-center bg-base-200 text-base-content p-4">
  <aside>
    <p>See the code for this project on <a href="http://github.com/var-iane/railtowns">GitHub</a></p>
  </aside>
</footer>