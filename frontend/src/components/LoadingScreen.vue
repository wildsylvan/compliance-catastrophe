<template>
  <div class="w-100 flex items-center justify-center bg-gray-100 text-black border-4 border-black">
    <div
      class="relative text-center px-6 p-8 border-4 border-black bg-white shadow-[8px_8px_0px_rgba(0,0,0,1)] animate-wiggle w-full gap-10 flex flex-col">
      <div class="flex flex-col gap-5">
        <div class="flex justify-center ">
          <div
            class="w-20 h-20 border-4 border-black bg-red-500 flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,1)] animate-pop">
            <span class="text-4xl text-white">⚠️</span>
          </div>
        </div>
        <h1 class="text-4xl font-bold animate-text-pop">
          Managing <span class="text-gray-400 line-through">chaos</span><br>one <span class="underline">form</span> at a
          time
        </h1>
      </div>
      <div class="flex justify-center ">
        <div class="w-12 h-12 border-5 border-black rounded-full border-t-yellow-400 animate-spin-brutal"></div>
      </div>
      <div class="text-gray-800 text-lg font-bold animate-text-fade">
        {{ loadingMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const loadingMessages = [
  "📜 Reviewing compliance policies…",
  "🔍 Auditing vendor records…",
  "⚖️ Evaluating risk factors…",
  "💼 Preparing legal reports…."
];
const loadingMessage = ref(loadingMessages[0]);
let messageIndex = 0;
onMounted(() => {
  setInterval(() => {
    messageIndex = (messageIndex + 1) % loadingMessages.length;
    loadingMessage.value = loadingMessages[messageIndex];
  }, 2000);
});
</script>

<style scoped>
@keyframes wiggle {

  0%,
  100% {
    transform: rotate(0deg);
  }

  25% {
    transform: rotate(3deg);
  }

  75% {
    transform: rotate(-3deg);
  }
}

.animate-wiggle {
  animation: wiggle 1s infinite ease-in-out;
}

@keyframes pop {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-pop {
  animation: pop 0.5s ease-out;
}

@keyframes spin-brutal {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.animate-spin-brutal {
  animation: spin-brutal 0.8s linear infinite;
}

@keyframes text-pop {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-text-pop {
  animation: text-pop 0.6s ease-out;
}

@keyframes text-fade {
  0% {
    opacity: 0.2;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0.2;
  }
}

.animate-text-fade {
  animation: text-fade 3s infinite ease-in-out;
}
</style>