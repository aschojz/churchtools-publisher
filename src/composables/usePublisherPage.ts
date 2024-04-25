import { ComputedRef, Ref, computed } from 'vue';
import { useStore } from '../store';

export default function usePublisherPage(
    pageId: ComputedRef<string> | Ref<string>
) {
    const store = useStore();

    const pages = computed(() => store.pages);
    const pagesById = computed(() =>
        Object.fromEntries(pages.value.map((page) => [page.id, page]))
    );
    const getPageById = (id: string) => pagesById.value[id];

    const currentPage = computed(() => getPageById(pageId.value));

    const layers = computed(() =>
        currentPage.value?.layers
            ? Object.entries(currentPage.value?.layers).map(([id, value]) => ({
                  ...value,
                  id,
                  name: id,
              }))
            : []
    );

    return { pages, pagesById, getPageById, currentPage, layers };
}
