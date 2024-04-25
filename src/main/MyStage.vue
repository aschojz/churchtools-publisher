<script setup lang="ts">
import { ComponentPublicInstance, computed, ref, toRef } from 'vue';
import KanvaElement from './KanvaElement.vue';
import usePublisherPage from '../composables/usePublisherPage';
const props = defineProps<{
    pageId: string;
}>();

const { currentPage, layers } = usePublisherPage(toRef(() => props.pageId));

const width = computed(() => currentPage.value.width);
const height = computed(() => currentPage.value.height);

const transformerRef = ref<ComponentPublicInstance | null>(null);
const selectedShapeName = ref('');
const handleStageMouseDown = (e: MouseEvent) => {
    if (e.target === e.target.getStage()) {
        selectedShapeName.value = '';
        updateTransformer();
        return;
    }
    const clickedOnTransformer =
        e.target.getParent().className === 'Transformer';
    if (clickedOnTransformer) {
        return;
    }
    const name = e.target.name();
    const rect = layers.value.find((r) => r.name === name);
    if (rect) {
        selectedShapeName.value = name;
    } else {
        selectedShapeName.value = '';
    }
    updateTransformer();
};

const updateTransformer = () => {
    // here we need to manually attach or detach Transformer node
    const transformerNode = transformerRef.value.getNode();
    const stage = transformerNode.getStage();

    const selectedNode = stage.findOne('.' + selectedShapeName.value);
    // do nothing if selected node is already attached
    if (selectedNode === transformerNode.node()) {
        return;
    }

    if (selectedNode) {
        // attach to another node
        transformerNode.nodes([selectedNode]);
    } else {
        // remove transformer
        transformerNode.nodes([]);
    }
};
</script>
<template>
    <div v-if="!currentPage"></div>
    <div
        v-else
        class="canvas-wrapper outline-2 outline-gray-700 outline"
        :style="`--width: ${width}px; --height: ${height}px`"
    >
        <div class="bg-white w-full h-full">
            <v-stage
                ref="stageRef"
                style="
                    transform: scale(var(--scale));
                    transform-origin: top left;
                "
                :config="{ width, height }"
                @mousedown="handleStageMouseDown"
            >
                <v-layer>
                    <template
                        v-for="(layer, layerIndex) in layers"
                        :key="`${currentPage?.id}-${layer.type}-${index}`"
                    >
                        <KanvaElement :layer="layer" :index="layerIndex" />
                    </template>
                    <v-transformer ref="transformerRef" />
                </v-layer>
            </v-stage>
        </div>
    </div>
</template>
<style scoped>
.canvas-wrapper {
    width: calc(var(--width) * var(--scale));
    height: calc(var(--height) * var(--scale));
}
</style>
