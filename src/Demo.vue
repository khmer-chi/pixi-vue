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
      <PixiText
        text="12123243"
        :layout="{
          width: 100,
          height: 100,
          backgroundColor: '#000fff',
        }"
        :style="{
          fill: '#fff000',
        }"
      />

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
            graphics
              .moveTo(0, 0)
              .lineTo(100, 100)
              .arc(100, 100, 100, 0, Math.PI)
              .closePath()
              .fill({ color: 0x00ff00, alpha: 0.5 }); // Fill the shape
          }
        "
      /> -->
    </PixiRwdContainer>
  </PixiApplication>
</template>
