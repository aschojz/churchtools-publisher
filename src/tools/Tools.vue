<script setup lang="ts">
import { Button } from '@churchtools/styleguide';
import { useStore } from '../store';
import useKonva from '../composables/useKonva';
import { computed } from 'vue';
import usePublisherPage from '../composables/usePublisherPage';

const store = useStore();
const currentPageId = computed(() => store.currentPage);
const { currentPage } = usePublisherPage(currentPageId);
const width = computed(() => currentPage.value?.width);
const height = computed(() => currentPage.value?.height);
const { addRect } = useKonva(width, height);
</script>
<template>
    <div id="tools" class="flex flex-col items-center gap-1 py-1">
        <Button size="S" icon="fas fa-plus" text color="gray" />
        <Button size="S" icon="fas fa-text" text color="gray" />
        <Button size="S" icon="far fa-circle" text color="gray" />
        <Button
            size="S"
            icon="far fa-square"
            text
            color="gray"
            @click="
                addRect({
                    width: 200,
                    height: 200,
                    fill: 'gray',
                })
            "
        />
        <Button size="S" icon="far fa-image" text color="gray" />
    </div>
</template>
