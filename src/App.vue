<script setup lang="ts">
import { computed } from 'vue';
import { InfoMessageContainer } from '@churchtools/styleguide';
import { useToasts } from '@churchtools/utils';
import Publisher from './Publisher.vue';

const { toasts, removeToast } = useToasts();

const removeInfoMessage = (infoMessage: (typeof toasts.value)[0]) =>
    removeToast(infoMessage.id);

const isDev = computed(() => import.meta.env.MODE === 'development');
</script>

<template>
    <!-- is removed in build-mode -->
    <div v-if="isDev" class="navbar"></div>
    <Publisher />
    <div v-if="isDev">
        <InfoMessageContainer
            :messages="toasts"
            @close-info-message="removeInfoMessage"
        />
    </div>
</template>
<style scoped>
.navbar {
    height: 56px;
    background: #0e204b;
}
</style>
