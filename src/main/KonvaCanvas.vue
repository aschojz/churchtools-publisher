<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import SimpleBar from 'simplebar';
import { useStore } from '../store';
import usePublisherPage from '../composables/usePublisherPage';
import { useEventListener } from '@vueuse/core';
import useKonva from '../composables/useKonva';

const store = useStore();
const currentPageId = computed(() => store.currentPage);
const { currentPage } = usePublisherPage(currentPageId);
const width = computed(() => currentPage.value?.width);
const height = computed(() => currentPage.value?.height);
const { initStage } = useKonva(width, height);

const canvasWrapperRef = ref<HTMLElement | null>(null);
const simplebar = ref<SimpleBar | null>(null);

const zoom = (event: WheelEvent) => {
    if (event.altKey) {
        event.preventDefault();
        store.scale += event.deltaY * -0.01;
        // Restrict scale
        store.scale = Math.min(Math.max(0.125, store.scale), 2);
        setSize();
    }
};

const setSize = () => {
    canvasWrapperRef.value!.style.setProperty(
        '--scale',
        store.scale.toString()
    );
    simplebar.value?.recalculate();
};
const calculateOptimalScale = () => {
    const mainWidth = document.getElementById('main')?.clientWidth;
    const mainHeight = document.getElementById('main')?.clientHeight;
    const widthScale = mainWidth ? mainWidth / (width.value + 200) : 0.5;
    const heightScale = mainHeight ? mainHeight / (height.value + 200) : 0.5;
    store.scale = Math.min(widthScale, heightScale);
    setSize();
};

onMounted(() => {
    nextTick(() => {
        const bar = document.querySelector('[data-simplebar]');
        if (bar) {
            simplebar.value = SimpleBar.instances.get(bar);
        }
        calculateOptimalScale();
        initStage();
    });
});

watch(currentPage, () => calculateOptimalScale);
useEventListener(canvasWrapperRef, 'wheel', zoom);
</script>
<template>
    <div id="main" :style="`--width: ${width}px; --height: ${height}px`">
        <div
            data-simplebar
            data-simplebar-auto-hide="false"
            data-simplebar-force-visible="true"
        >
            <div>
                <div
                    id="container"
                    ref="canvasWrapperRef"
                    class="bg-white m-10 inline-block"
                />
            </div>
        </div>
    </div>
</template>
<style scoped>
#main {
    display: flex;
    flex-direction: column;
}
#main > div {
    min-height: 100%;
    max-height: calc(100vh - var(--ct-navbar) - var(--header-height));
}
</style>
<style>
#container,
#container > div {
    width: calc(var(--width) * var(--scale));
    height: calc(var(--height) * var(--scale));
}
.simplebar-track {
    background-color: var(--gray-800) !important;
}
.simplebar-scrollbar::before {
    background-color: var(--gray-500) !important;
}
.simplebar-content-wrapper {
    height: 100% !important;
}
.simplebar-content {
    display: flex;
    height: 100% !important;
}
.konvajs-content {
    transform: scale(var(--scale));
    transform-origin: top left;
}
</style>
