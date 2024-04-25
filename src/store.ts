import { defineStore } from 'pinia';
import { ref } from 'vue';
import { PublisherPage } from './types';
import Konva from 'konva';

export const useStore = defineStore('publisher', () => {
    const currentPage = ref('');

    const pages = ref<PublisherPage[]>([
        {
            id: 'slide',
            sortKey: 0,
            label: 'Folie',
            width: 1920,
            height: 1080,
            layers: {
                background: {
                    type: 'rect',
                    label: 'Hintergrund',
                    config: {
                        width: 1920,
                        height: 1080,
                        fill: '#bd7100',
                    },
                },
                title: {
                    type: 'text',
                    label: 'Titel',
                    config: {
                        x: 960,
                        y: 540,
                        fill: '#ffffff',
                        fontSize: 100,
                        fontFamily: 'Arial',
                        text: 'Meine Präsentation',
                        align: 'center',
                        verticalAlign: 'middle',
                    },
                },
                group: {
                    type: 'group',
                    label: 'Gruppe',
                    config: {},
                    children: {
                        tit: {
                            type: 'text',
                            config: {
                                text: 'Titel',
                            },
                        },
                        sub: {
                            type: 'text',
                            config: {
                                text: 'sub',
                            },
                        },
                    },
                },
            },
        },
        {
            id: 'instagram',
            sortKey: 1,
            label: 'Instagram',
            width: 1080,
            height: 1920,
        },
    ]);

    const expandedLayers = ref<string[]>([]);
    const hiddenLayers = ref<string[]>([]);
    const currentLayer = ref('');
    const scale = ref(0.5);

    const stage = ref<Konva.Stage>();
    const layer = ref<Konva.Layer>();
    const transformer = ref<Konva.Transformer>();

    return {
        currentPage,
        pages,
        scale,
        expandedLayers,
        hiddenLayers,
        currentLayer,
        stage,
        layer,
        transformer,
    };
});
