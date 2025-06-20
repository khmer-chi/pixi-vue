<script setup lang="ts">
import { LayoutOptions, NumberValue } from "@pixi/layout";
import { LayoutContainer } from "@pixi/layout/components";
import { onMounted, onUnmounted, ref } from "vue";
const { width, height, layout } = defineProps<{
  appLayout?: Omit<LayoutOptions, "target">;
  layout?: Omit<LayoutOptions, "target">;
  width: number;
  height: number;
}>();
const scale = ref(1);
const layoutContainerRef = ref<LayoutContainer>();
const controller = new AbortController();
onMounted(() => {
  const signal = controller.signal;
  if (!layoutContainerRef.value) return;
  const layoutContainer = layoutContainerRef.value;
  layoutContainer.on(
    "layout",
    () => {
      const _scaleX = layoutContainer.width / width;
      scale.value = _scaleX > 1 ? 1 : _scaleX;
    },
    { signal }
  );
});
onUnmounted(() => {
  controller.abort();
});
</script>
<template>
  <layout-container
    :layout="{ height: '100%', aspectRatio: width / height, ...layout }"
    ref="layoutContainerRef"
    :scaleEffect="scale"
  >
    <slot />
  </layout-container>
</template>
