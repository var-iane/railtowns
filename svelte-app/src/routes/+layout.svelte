<script>
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/stores';
	import { base } from '$app/paths';

  $: path = $page.url.pathname;

  $: theme =
    path.startsWith('${base}/1-gridtowns') ? 'night' :
    path.startsWith('${base}/2-railtowns') ? 'synthwave' :
    path.startsWith('${base}/3-ghosttowns') ? 'night' :
    'night';
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Railroad towns</title>
</svelte:head>


<div data-theme={theme} class="min-h-screen">
	<header class="navbar bg-base-200 border-b border-base-300 mb-4">
	<div class="flex-1 px-4 text-xl font-bold">
		<a href="${base}/" class="btn btn-ghost normal-case text-xl">Intro</a>
		<a href="${base}/1-gridtowns" class="btn btn-soft btn-primary normal-case text-xl">Grid towns</a>
		<a href="${base}/2-railtowns" class="btn btn-soft btn-secondary normal-case text-xl">Rail towns</a>
		<a href="${base}/3-ghosttowns" class="btn btn-soft btn-neutral normal-case text-xl">Ghost towns</a>
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