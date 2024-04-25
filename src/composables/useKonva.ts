import Konva from 'konva';
import { useStore } from '../store';
import { ComputedRef, ref } from 'vue';
export default function useKonva(
    width: ComputedRef<number>,
    height: ComputedRef<number>
) {
    const store = useStore();

    const initStage = () => {
        store.stage = new Konva.Stage({
            container: 'container',
            width: width.value,
            height: height.value,
        });

        store.layer = new Konva.Layer();
        store.transformer = new Konva.Transformer({
            rotationSnaps: [
                0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300,
            ],
            anchorStroke: 'red',
            anchorFill: 'red',
            borderStroke: 'red',
        });

        const rect1 = new Konva.Rect({
            x: 60,
            y: 60,
            width: 100,
            height: 90,
            fill: 'red',
            name: 'rect',
            draggable: true,
        });
        store.layer.add(rect1);
        const rect2 = new Konva.Rect({
            x: 250,
            y: 100,
            width: 150,
            height: 90,
            fill: 'green',
            name: 'rect',
            draggable: true,
        });
        store.layer.add(rect2);
        store.transformer.nodes([rect1, rect2]);

        store.layer.add(selectionRectangle);

        store.layer.add(store.transformer);
        store.stage.add(store.layer);

        // event-listeners
        store.stage.on('mousedown touchstart', (e) => {
            // do nothing if we mousedown on any shape
            if (e.target._id !== store.stage._id) {
                return;
            }
            e.evt.preventDefault();
            x1 = store.stage.getPointerPosition()!.x;
            y1 = store.stage.getPointerPosition()!.y;
            x2 = store.stage.getPointerPosition()!.x;
            y2 = store.stage.getPointerPosition()!.y;

            selectionRectangle.width(0);
            selectionRectangle.height(0);
            console.log('sss');
            selecting.value = true;
        });

        store.stage.on('mousemove touchmove', (e) => {
            // do nothing if we didn't start selection
            if (!selecting.value || !store.stage) {
                return;
            }
            e.evt.preventDefault();
            x2 = store.stage.getPointerPosition()!.x;
            y2 = store.stage.getPointerPosition()!.y;

            selectionRectangle.setAttrs({
                visible: true,
                x: Math.min(x1, x2),
                y: Math.min(y1, y2),
                width: Math.abs(x2 - x1),
                height: Math.abs(y2 - y1),
            });
        });
        store.stage.on('mouseup touchend', (e) => {
            console.log('mouseup touchend');
            // do nothing if we didn't start selection
            selecting.value = false;
            if (!selectionRectangle.visible() || !store.stage) {
                return;
            }
            e.evt.preventDefault();
            // update visibility in timeout, so we can check it in click event
            selectionRectangle.visible(false);
            const shapes = store.stage.find('.rect');
            const box = selectionRectangle.getClientRect();
            const selected = shapes.filter((shape) =>
                Konva.Util.haveIntersection(box, shape.getClientRect())
            );
            store.transformer.nodes(selected);
        });
        // clicks should select/deselect shapes
        store.stage.on('click tap', (e) => {
            // if we are selecting with rect, do nothing
            if (selectionRectangle.visible()) {
                return;
            }

            // if click on empty area - remove all selections
            if (e.target._id === store.stage._id) {
                store.transformer.nodes([]);
                return;
            }

            // do nothing if clicked NOT on our rectangles
            if (!e.target.hasName('rect')) {
                return;
            }

            // do we pressed shift or ctrl?
            const metaPressed =
                e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
            const isSelected = store.transformer.nodes().indexOf(e.target) >= 0;

            if (!metaPressed && !isSelected) {
                // if no key pressed and the node is not selected
                // select just one
                store.transformer.nodes([e.target]);
            } else if (metaPressed && isSelected) {
                // if we pressed keys and node was selected
                // we need to remove it from selection:
                const nodes = store.transformer.nodes().slice(); // use slice to have new copy of array
                // remove node from array
                nodes.splice(nodes.indexOf(e.target), 1);
                store.transformer.nodes(nodes);
            } else if (metaPressed && !isSelected) {
                // add the node into selection
                const nodes = store.transformer.nodes().concat([e.target]);
                store.transformer.nodes(nodes);
            }
        });
    };

    const selectionRectangle = new Konva.Rect({
        fill: 'rgba(0,0,255,0.5)',
        visible: false,
    });

    const addRect = (props: Konva.RectConfig) => {
        const rect = new Konva.Rect({
            x: width.value / 2 - (props.width ?? 0) / 2,
            y: height.value / 2 - (props.height ?? 0) / 2,
            ...props,
            draggable: true,
        });
        store.layer?.add(rect);
    };

    let x1: number, y1: number, x2: number, y2: number;
    const selecting = ref(false);

    const selectedShapeName = ref('');
    const handleTransformEnd = (e) => {
        // shape is transformed, let us save new attrs back to the node
        // find element in our state
        const rect = this.rectangles.find(
            (r) => r.name === selectedShapeName.value
        );
        // update the state
        rect.x = e.target.x();
        rect.y = e.target.y();
        rect.rotation = e.target.rotation();
        rect.scaleX = e.target.scaleX();
        rect.scaleY = e.target.scaleY();

        // change fill
        rect.fill = Konva.Util.getRandomColor();
    };

    const handleStageMouseDown = (e) => {
        // clicked on stage - clear selection
        if (e.target === e.target.getStage()) {
            selectedShapeName.value = '';
            updateTransformer();
            return;
        }

        // clicked on transformer - do nothing
        const clickedOnTransformer =
            e.target.getParent().className === 'Transformer';
        if (clickedOnTransformer) {
            return;
        }

        // find clicked rect by its name
        const name = e.target.name();
        const rect = this.rectangles.find((r) => r.name === name);
        if (rect) {
            selectedShapeName.value = name;
        } else {
            selectedShapeName.value = '';
        }
        updateTransformer();
    };
    const updateTransformer = () => {
        // here we need to manually attach or detach Transformer node
        const transformerNode = this.$refs.transformer.getNode();
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
    return {
        initStage,
        addRect,
        handleTransformEnd,
        handleStageMouseDown,
        updateTransformer,
    };
}
