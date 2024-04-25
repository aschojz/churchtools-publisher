import { computed } from 'vue';
import { useStore } from '../store';
import { PageLayer } from '../types';

export default function usePageLayer(layer: PageLayer & { id: string }) {
    const store = useStore();

    const icons = {
        rect: 'fas fa-square',
        circle: 'fas fa-circle',
        image: 'fas fa-image',
        text: 'fas fa-font',
        group: 'fas fa-angle-right',
    };
    const l = computed(() => ({
        ...layer,
        icon: icons[layer.type] ?? 'fas fa-question',
    }));

    const isExpanded = computed(() => store.expandedLayers.includes(layer.id));
    const toggleLayerExpanded = () => {
        if (store.expandedLayers.includes(layer.id)) {
            store.expandedLayers = store.expandedLayers.filter(
                (i) => i !== layer.id
            );
        } else {
            store.expandedLayers = [...store.expandedLayers, layer.id];
        }
    };

    const isHidden = computed(() => store.hiddenLayers.includes(layer.id));
    const toggleLayerHidden = () => {
        if (store.hiddenLayers.includes(layer.id)) {
            store.hiddenLayers = store.hiddenLayers.filter(
                (i) => i !== layer.id
            );
        } else {
            store.hiddenLayers = [...store.hiddenLayers, layer.id];
        }
    };

    const currentLayer = computed(() => store.currentLayer);

    const children = computed(() =>
        Object.entries(layer.children ?? {}).map(([id, value]) => ({
            ...value,
            id,
            name: id,
        }))
    );

    return {
        children,
        layer: l,
        isExpanded,
        currentLayer,
        isHidden,
        toggleLayerExpanded,
        toggleLayerHidden,
    };
}
