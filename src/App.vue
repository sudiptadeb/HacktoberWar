<template>
	<div id="app" class="flex layout-row layout-align-start-stretch">
		<router-view class="flex"/>
	</div>
</template>

<style lang="scss">
	#app {
		font-family: "Roboto", Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
	}
</style>
<script>
    export default {
        name: "App",
        components: {},
        data() {
            return {}
        },
        methods: {}
    }
</script>
<style lang="scss">
	@import "./assets/css/includes.scss";
	@import "~vue-sidebar-menu/dist/vue-sidebar-menu.css";
</style>
