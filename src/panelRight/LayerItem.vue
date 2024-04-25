<script setup lang="ts">
import { useStore } from '../store';
import usePageLayer from '../composables/usePageLayer';
import { PageLayer } from '../types';
import { Button } from '@churchtools/styleguide';

const props = defineProps<{
    pageLayer: PageLayer & { id: string };
}>();
defineEmits<{
    (event: 'click', args: string[]): void;
    (event: 'open', args: string[]): void;
}>();

const store = useStore();
const {
    layer,
    isHidden,
    isExpanded,
    currentLayer,
    toggleLayerExpanded,
    toggleLayerHidden,
    children,
} = usePageLayer(props.pageLayer);

const families = {
    light: 'MyriadPro-Light',
    'light-condensed': 'MyriadPro-LightCond',
    regular: 'Myriad Pro',
    condensed: 'MyriadPro-Cond',
    bold: 'MyriadPro-Bold',
    'bold-condensed': 'MyriadPro-BoldCond',
};
const textAlign = ['left' as const, 'center' as const, 'right' as const];
</script>
<template>
    <div
        :class="{
            'border-0 border-b border-solid border-gray-950': !isExpanded,
            'bg-blue-900': currentLayer === layer.id,
        }"
        class="group flex w-full items-center text-left"
        @click="store.currentLayer = layer.id"
    >
        <div
            v-if="layer.type === 'group'"
            :class="{ 'cursor-pointer': layer.type === 'group' }"
            class="flex h-10 w-5 flex-shrink-0 items-center justify-center border-0 border-r border-solid border-gray-950"
            @click.stop="toggleLayerExpanded"
        >
            <i
                :class="[layer.icon, { 'fa-rotate-90': isExpanded }]"
                class="fa-fw fa-xs text-gray-500"
            ></i>
        </div>
        <div
            v-else
            class="flex h-10 w-5 flex-shrink-0 items-center justify-center border-0 border-r border-solid border-gray-950"
            @click.stop="toggleLayerExpanded"
        >
            <i :class="[layer.icon]" class="fa-fw fa-xs text-gray-500"></i>
        </div>
        <div
            class="flex h-10 w-10 flex-shrink-0 items-center justify-center border-0 border-r border-solid border-gray-950"
            :style="`background: ${layer.config.fill}`"
            @click.stop="layer.type === 'group' && toggleLayerExpanded"
        ></div>
        <div class="flex flex-grow items-center gap-2 overflow-hidden px-2">
            <div
                class="flex-grow overflow-hidden text-ellipsis whitespace-nowrap text-sm"
            >
                {{ layer.config.text ?? layer.id }}
            </div>
            <i
                v-if="layer.type !== 'group'"
                :class="[isExpanded ? 'fas fa-angle-up' : 'fas fa-angle-down']"
                class="fa-fw flex-shrink-0 text-gray-500 cursor-pointer"
                @click="toggleLayerExpanded"
            />
            <i
                class="cursor-pointer fa-fw"
                :class="[
                    isHidden
                        ? 'fas fa-eye-slash text-gray-700'
                        : 'fas fa-eye text-gray-500',
                ]"
                @click.stop="toggleLayerHidden"
            />
        </div>
    </div>
    <div
        v-if="isExpanded && layer.type !== 'group'"
        class="border-y-2 border-l-8 border-solid border-gray-950"
    >
        <div class="flex flex-col gap-4 bg-gray-800 px-4 py-3">
            <textarea
                v-if="layer.type === 'text'"
                v-model="layer.config.text"
                row="2"
            />
            <div class="flex gap-2">
                <input
                    v-if="layer.type === 'text'"
                    v-model="layer.config.fontSize"
                    class="w-16 rounded px-2"
                    type="number"
                />
                <input v-model="layer.config.fill" type="color" />
                <div v-if="layer.type === 'text'" class="cts-buttongroup">
                    <Button
                        v-for="(align, index) in textAlign"
                        :key="index"
                        outlined
                        :color="
                            layer.config.align === align ? 'primary' : 'gray'
                        "
                        size="S"
                        :icon="`fas fa-align-${align}`"
                        @click="layer.config.align = align"
                    ></Button>
                </div>
            </div>
            <select
                v-if="layer.type === 'text'"
                v-model="layer.config.fontFamily"
            >
                <option
                    v-for="[style, family] in Object.entries(families)"
                    :key="style"
                    :value="family"
                >
                    {{ style }}
                </option>
            </select>
        </div>
    </div>
    <div
        v-if="children.length && isExpanded"
        class="border-b border-r-0 border-l-8 border-t-2 border-solid border-gray-950"
    >
        <LayerItem
            v-for="(child, index) in [...children]"
            :id="`${layer.id}-${child.id}`"
            :key="index"
            :page-layer="child"
        />
    </div>
</template>
