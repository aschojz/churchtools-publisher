<script setup lang="ts">
import { computed } from 'vue';
import { PageLayer } from '../types';
import usePageLayer from '../composables/usePageLayer';
import { useStore } from '../store';

const props = defineProps<{
    layer: PageLayer & { id: string };
    index: number;
}>();

const components = {
    layer: 'v-layer',
    image: 'v-image',
    text: 'v-text',
    rect: 'v-rect',
    circle: 'v-circle',
    group: 'v-group',
};
const type = computed(() => components[props.layer.type]);

const store = useStore();
const { children, isHidden } = usePageLayer(props.layer);

const handleTransformEnd = (e) => {
    const config = store.pages.find((p) => p.id === store.currentPage).layers[
        e.target.attrs.name
    ].config;
    config.x = e.target.attrs.x;
    config.y = e.target.attrs.y;
    config.rotation = e.target.attrs.rotation;
    config.width = e.target.attrs.scaleX * e.target.attrs.width;
    config.height = e.target.attrs.scaleY * e.target.attrs.height;
};
</script>
<template>
    <component
        :is="type"
        v-if="!isHidden"
        ref="elementRef"
        v-bind="{ ...layer, config: { ...layer.config, zIndex: index } }"
        @transformend="handleTransformEnd"
    >
        <KanvaElement
            v-for="(child, childIndex) in children"
            :key="child.type"
            :layer="child"
            :index="childIndex"
        />
    </component>
</template>
