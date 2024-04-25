<script setup lang="ts">
import Header from './header/Header.vue';
import Tools from './tools/Tools.vue';
import PanelLeft from './panelLeft/PanelLeft.vue';
import PanelRight from './panelRight/PanelRight.vue';
import Main from './main/KonvaCanvas.vue';
import { onMounted } from 'vue';
import { useStore } from './store';

const store = useStore();
onMounted(() => {
    store.currentPage = store.pages[0].id;
});
</script>
<template>
    <div id="publisher" class="flex-grow">
        <Header />
        <Tools />
        <PanelLeft />
        <PanelRight />
        <Main />
    </div>
</template>
<style scoped>
#publisher {
    --panel-width: 300px;
    --forground: var(--gray-800);
    --background: var(--gray-900);
    --border: var(--gray-950);
    --border-width: 2px;
    --header-height: 40px;
    --ct-navbar: var(--menu-height, 56px);
    display: grid;
    grid-template-columns: 36px 240px 1fr var(--panel-width);
    grid-template-rows: var(--header-height) 1fr;
    grid-template-areas:
        'header header header header'
        'tools left-panel main right-panel';
    color: white;
    max-height: calc(100vh - var(--ct-navbar));
}
#header {
    grid-area: header;
    background: var(--forground);
    border-bottom: var(--border-width) solid var(--border);
}
#tools {
    grid-area: tools;
    border-right: var(--border-width) solid var(--border);
    background: var(--forground);
}
#panel-left {
    grid-area: left-panel;
    border-right: var(--border-width) solid var(--border);
    background: var(--forground);
}
#panel-right {
    grid-area: right-panel;
    border-left: var(--border-width) solid var(--border);
    background: var(--forground);
}
#main {
    grid-area: main;
    background: var(--background);
}
</style>
