<script setup lang="ts">
// import { Page } from "ui";
// import { name } from "../package.json";
import { ref } from 'vue'

const inputValue = ref('inputValue')
</script>

<template>
  <div>
    <div>
      <h3>Input</h3>
      <vi-input
        v-model="inputValue"
        :styleProps="{
          wrapper: {
            bg: '#2b2b2b',
            border: {
              color: '#e4e7ed'
            }
          },
          text: {
            disabled: {
              color: '#b0b3ba'
            }
          }
        }"
      />
    </div>
  </div>
</template>
