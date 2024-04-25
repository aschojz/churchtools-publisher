<script setup lang="ts">
import { Button } from '@churchtools/styleguide';
import { useStore } from '../store';
import { useToasts } from '@churchtools/utils';

const { successToast } = useToasts();

const store = useStore();

const onCreatePage = () => {
    successToast('TODO: create page');
};
const onEditPage = () => {
    successToast('TODO: edit page');
};
const onCopyPage = () => {
    successToast('TODO: copy page');
};
const onSortPages = () => {
    successToast('TODO: sort pages');
};
const onDeletePage = () => {
    successToast('TODO: delete page');
};
</script>
<template>
    <div id="panel-left">
        <div class="bg-gray-900 pl-2 pr-1 justify-between flex items-center">
            <span class="text-body-xs">Seiten</span>
            <div class="flex">
                <Button
                    icon="fas fa-file-plus"
                    text
                    size="S"
                    color="gray"
                    @click="onCreatePage"
                />
                <Button
                    icon="fas fa-pen"
                    text
                    size="S"
                    color="gray"
                    @click="onEditPage"
                />
                <Button
                    icon="fas fa-copy"
                    text
                    size="S"
                    color="gray"
                    @click="onCopyPage"
                />
                <Button
                    icon="fas fa-sort"
                    text
                    size="S"
                    color="gray"
                    @click="onSortPages"
                />
                <Button
                    icon="fas fa-trash-alt"
                    text
                    size="S"
                    color="gray"
                    @click="onDeletePage"
                />
            </div>
        </div>
        <div data-simplebar style="max-height: 800px">
            <div class="py-4 w-full">
                <div class="flex flex-col gap-2 items-center w-full">
                    <button
                        v-for="page in store.pages"
                        :key="page.id"
                        :class="{
                            'outline-2 outline-blue-500 outline':
                                store.currentPage === page.id,
                        }"
                        class="border-0 bg-transparent transition hover:bg-gray-600 flex flex-col px-4 py-2 rounded-lg items-center gap-2 text-white cursor-pointer"
                        @click="store.currentPage = page.id"
                    >
                        <span>{{ page.label }}</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
