<script setup lang="ts"></script>

<template>
  <PixiApplication
    :layout="{
      justifyContent: 'center',
      alignItems: 'center',
    }"
    @appResize="
      (...args) => {
        //console.log(args);
      }
    "
  >
    <PixiRwdContainer
      :width="200"
      :height="200"
      :layout="{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1099bb',
      }"
    >
      <PixiGraphics
        :layout="{ width: 437, height: 437 }"
        :draw="
          (graphics) => {
            graphics.clear();
            graphics.rect(0, 0, 437, 437).fill({ color: 0x1099bb });
          }
        "
      />
      <!-- <PixiText
        text="12123243"
        :layout="{
          width: 100,
          height: 100,
          justifyContent: 'flex-start',
          alignItems: 'center',
          backgroundColor: '#000fff',
        }"
        :style="{
          fill: '#fff000',
        }"
      /> -->
      <!-- <PixiText
        text="12123243"
        :layout="{
          width: 100,
          height: 100,
          justifyContent: 'flex-start',
          alignItems: 'center',
          backgroundColor: '#000fff',
        }"
        :style="{
          fill: '#fff000',
        }"
      /> -->

      <!-- <PixiLayoutText
        text="12123243"
        :layout="{ width: 250, height: 100, backgroundColor: '#000fff' }"
        :style="{
          fill: '#fff000',
        }"
      /> -->
      <!-- <PixiGraphics
        :layout="{ width: 200, height: 200 }"
        :draw="
          (graphics) => {
            graphics.clear();
            graphics.rect(0, 0, 200, 200).fill({ color: 0xff0000 });
          }
        "
      /> -->
    </PixiRwdContainer>
  </PixiApplication>
</template>
