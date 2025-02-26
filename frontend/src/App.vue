<template>
  <div class=" bg-white text-black flex flex-col items-center p-8 font-sans border-8 border-black gap-10">
    <!-- Header -->
    <div class="text-6xl font-extrabold uppercase tracking-wide p-4 relative ">
      <span class="-rotate-3 inline-block underline " :class="{ 'animate-wiggle': !isGameStarted }">Compliance</span>
      <span class="-rotate-3 inline-block text-gray-400 line-through "
        :class="{ 'animate-glitch': !isGameStarted }">Catastrophe</span>
    </div>

    <template v-if="isGameStarted">
      <GameOverScreen v-if="gameOverData" :vendors="gameOverData.vendors" :resources="gameOverData.resources"
        :eventLog="gameOverData.eventLog" @newGame="startGame" />
      <LoadingScreen v-else-if="!vendors" />
      <GameScreen v-else :vendors="vendors" @game-over="handleGameOver" />
    </template>
    <div v-else class="flex flex-1 justify-center items-center gap-10 animate-fade-in mt-10">
      <div class="text-2xl font-bold max-w-xl w-full animate-float">
        In <span class="italic">Compliance Catastrophe</span>, you manage supply chain approvals while balancing risks.
        Each turn, you <span class="text-green-300 bg-black px-1">Approve</span>, <span
          class="text-yellow-300 bg-black px-1">Audit</span>,
        or <span class="text-red-300 bg-black px-1">Reject</span> vendors. Vendors have compliance ratings and risks,
        and
        their reps defend them. Make strategic choices to keep resources above 0% until the last turn! 🚀
      </div>

      <button
        class="bg-purple-400 hover:bg-purple-500 px-6 py-4 rounded-full border-4 border-black text-3xl font-bold shadow-brutal transform hover:scale-110 transition-all cursor-pointer not-hover:animate-pulse"
        @click="startGame">
        New Game
      </button>
    </div>
  </div>
</template>

<script setup>
import GameScreen from './components/GameScreen.vue';
import LoadingScreen from './components/LoadingScreen.vue';
import GameOverScreen from './components/GameOverScreen.vue';
import { ref } from 'vue';

const isGameStarted = ref(false);
const gameOverData = ref(null);
const vendors = ref(null);

const startGame = () => {
  gameOverData.value = null;
  isGameStarted.value = true;
};

async function generateVendors() {
  vendors.value = null;

  const data = await (await fetch('http://localhost:3001/generate-vendors', {
    method: 'POST',
  })).json()

  if (data?.error) {
    alert(data.error);
    return;
  }

  vendors.value = data.vendors;
}

// not awaited on-purpose
generateVendors();

function handleGameOver(data) {
  // not awaited on-purpose
  generateVendors();
  gameOverData.value = data;
}
</script>

<style scoped>
@keyframes wiggle {

  0%,
  100% {
    transform: rotate(-3deg);
  }

  50% {
    transform: rotate(3deg);
  }
}

.animate-wiggle {
  display: inline-block;
  animation: wiggle 0.8s ease-in-out infinite alternate;
}

@keyframes glitch {
  0% {
    transform: translate(0, 0);
  }

  20% {
    transform: translate(-2px, 2px);
  }

  40% {
    transform: translate(2px, -2px);
  }

  60% {
    transform: translate(-2px, -2px);
  }

  80% {
    transform: translate(2px, 2px);
  }

  100% {
    transform: translate(0, 0);
  }
}

.animate-glitch {
  display: inline-block;
  animation: glitch 0.2s infinite;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out;
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-5px);
  }
}

.animate-float {
  animation: float 1.5s ease-in-out infinite;
}
</style>