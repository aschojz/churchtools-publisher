<script setup lang="ts">
import { computed } from 'vue';
import usePublisherPage from '../composables/usePublisherPage';
import { useStore } from '../store';
import LayerItem from './LayerItem.vue';

const store = useStore();
const currentPageId = computed(() => store.currentPage);
const { layers } = usePublisherPage(currentPageId);
</script>
<template>
    <div id="panel-right">
        <LayerItem
            v-for="layer in layers"
            :key="layer.id"
            :page-layer="layer"
        />
    </div>
</template>
