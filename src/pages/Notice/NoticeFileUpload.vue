<template>
  <div class="file-upload">
    <input type="file" multiple hidden ref="fileInput" @change="handleFiles" />
    <button class="fileSelect-btn" type="button" @click="fileInput.click()"> 파일 선택 </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
});
const emit = defineEmits(["update:modelValue"]);

const fileInput = ref(null);
const files = ref([...props.modelValue]);

watch(
  () => props.modelValue,
  (newVal) => (files.value = [...newVal])
);

const handleFiles = (e) => {
  const selected = Array.from(e.target.files);
  files.value = [...files.value, ...selected];
  emit("update:modelValue", files.value)
}

</script>

<style>
.fileSelect-btn {
  background-color: brown;
}
</style>
