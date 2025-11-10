<script>
	import { page } from '$app/stores';
	import { base } from '$app/paths';

  $: path = $page.url.pathname;

  $: theme =
  	path === `${base}/` ? 'railtheme' :
    path.startsWith(`${base}/gridtowns`) ? 'railtheme' :
    path.startsWith(`${base}/railtowns`) ? 'railtheme' :
    path.startsWith(`${base}/ghosttowns`) ? 'railtheme' :
    'railtheme';

</script>

<svelte:head>
	<link rel="icon" href={`${base}/favicon.svg`} />
	<title>Railtowns</title>
</svelte:head>

<style></style>

<div data-theme={theme} class="min-h-screen">
	<header class="navbar bg-base-200 border-base-300 fixed top-0 left-0 right-0 z-50">
	<div class="flex-1 px-4 font-inconsolata">
		<a href={`${base}/`} class="btn btn-soft btn-primary text-lg font-light">Intro</a>
		<a href={`${base}/gridtowns`} class="btn btn-soft btn-primary text-lg font-light">Template towns</a>
		<a href={`${base}/arterytowns`} class="btn btn-soft btn-primary text-lg font-light">Artery towns</a>
		<a href={`${base}/ghosttowns`} class="btn btn-soft btn-primary text-lg font-light">Ghost towns</a>
	</div>
	</header>

	<main class="pt-16 px-6 pb-20">
	<slot />
	</main>
</div>

<footer data-theme={theme} class="footer sm:footer-horizontal bg-base-300 text-base-content p-4">
  <aside>
    <p>See the code for this project on <a href="http://github.com/var-iane/railtowns">GitHub</a></p>
  </aside>
</footer>