<script setup>
import { ref, computed } from "vue";
import { setTarget } from "@/api/Data";

// users = [{id: int, grade_id: int, name: string}, {}...]
const props = defineProps({
  users: {
    type: Array,
    required: true,
  },
})

// Emit 정의
// -> 부모(@select:user="") -> user.id 반환
const emit = defineEmits(["select:user"]);

const isOpen = ref(false);
const searchQuery = ref(""); // 검색어

// 대상 선택
const selectedUser = ref(null);

// 검색 필터링
const filteredUsers = computed(() =>
  props.users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

// 사용자 선택 후 초기화 및 반환
const selectUser = (user) => {
  selectedUser.value = user;
  isOpen.value = false;
  searchQuery.value = "";
  // 부모에 id값 반환
  emit("select:user", user.id);
};

</script>


<template>
  <div>
    <div @click="isOpen = !isOpen">
      {{ selectedUser ? selectedUser.name : "-- 사용자 선택하세요 --" }}
      <span>▼</span>
    </div>

    <!-- 내용 -->
    <div v-if="isOpen">
      <!-- 검색 -->
      <div>
        <input v-model="searchQuery" placeholder="검색" />
      </div>
      <!-- 학생 명담 -->
      <ul>
        <li
          v-for="user in filteredUsers"
          :key="user.id"
          @click="selectUser(user)"
        >
          {{ user.name }} : {{ setTarget(user.grade_id) }}
        </li>
      </ul>
    </div>
  </div>
</template>
