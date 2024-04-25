<script setup lang="ts">
import {
    ComponentPublicInstance,
    computed,
    nextTick,
    onMounted,
    ref,
    watch,
} from 'vue';
import SimpleBar from 'simplebar';
import MyStage from './MyStage.vue';
import usePublisherPage from '../composables/usePublisherPage';
import { useEventListener } from '@vueuse/core';
import { useStore } from '../store';

const store = useStore();
const currentPageId = computed(() => store.currentPage);
const { currentPage } = usePublisherPage(currentPageId);

const canvasWrapperRef = ref<ComponentPublicInstance | null>(null);

const simplebar = ref<SimpleBar | null>(null);
const scale = ref(0.5);
const width = computed(() => currentPage.value?.width);
const height = computed(() => currentPage.value?.height);

const zoom = (event: WheelEvent) => {
    if (event.altKey) {
        event.preventDefault();
        scale.value += event.deltaY * -0.01;
        // Restrict scale
        scale.value = Math.min(Math.max(0.125, scale.value), 2);
        setSize();
    }
};

const setSize = () => {
    canvasWrapperRef.value!.$el.style.setProperty(
        '--scale',
        scale.value.toString()
    );
    simplebar.value?.recalculate();
};
const calculateOptimalScale = () => {
    const mainWidth = document.getElementById('main')?.clientWidth;
    const mainHeight = document.getElementById('main')?.clientHeight;
    const widthScale = mainWidth ? mainWidth / (width.value + 200) : 0.5;
    const heightScale = mainHeight ? mainHeight / (height.value + 200) : 0.5;
    scale.value = Math.min(widthScale, heightScale);
    setSize();
};

onMounted(() => {
    nextTick(() => {
        const bar = document.querySelector('[data-simplebar]');
        if (bar) {
            simplebar.value = SimpleBar.instances.get(bar);
        }
        calculateOptimalScale();
    });
});

watch(currentPage, () => calculateOptimalScale);
useEventListener(canvasWrapperRef, 'wheel', zoom);
</script>
<template>
    <div id="main">
        <div
            data-simplebar
            data-simplebar-auto-hide="false"
            data-simplebar-force-visible="true"
        >
            <div>
                <MyStage
                    ref="canvasWrapperRef"
                    class="m-10"
                    :page-id="store.currentPage"
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
