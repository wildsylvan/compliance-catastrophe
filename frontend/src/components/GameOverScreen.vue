<template>
  <div class="gameover-screen">
    <div v-if="isVictory" class="message victory">
      <h1>Victory!</h1>
      <p>You finished the game with {{ resources }}% resources remaining.</p>
    </div>
    <div v-else class="message defeat">
      <h1>Defeat</h1>
      <p>You have run out of resources. Better luck next time!</p>
      <div class="ai-request-area">
        <!-- Show button if no analysis done and not loading -->
        <button v-if="!analysisDone && !isLoading" @click="analyzeGame" class="ai-analyze-button">
          Ask AI for Suggestions
        </button>
        <!-- Show spinner when loading -->
        <div v-else-if="isLoading" class="spinner-container">
          <div class="spinner"></div>
        </div>
      </div>
      <div v-if="analysisResult" class="ai-analysis">
        <h2>AI Analysis</h2>
        <vue-markdown class="prose" :source="analysisResult" />
      </div>
    </div>
    <button @click="playNewGame" class="new-game-button">
      Play New Game
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import VueMarkdown from 'vue-markdown-render'

const props = defineProps({
  vendors: Array,
  resources: Number,
  eventLog: Array
});

const emit = defineEmits(['newGame']);

// Determine if the player achieved victory (resources > 0) or defeat
const isVictory = computed(() => props.resources > 0);
const analysisResult = ref('');
const isLoading = ref(false);

// Computed flag to determine if an analysis has been performed
const analysisDone = computed(() => analysisResult.value !== '');

const playNewGame = () => {
  emit('newGame');
};

const analyzeGame = async () => {
  if (analysisDone.value) return; // Prevent multiple requests
  isLoading.value = true;
  try {
    const response = await fetch('http://localhost:3001/analyze-game', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        vendors: props.vendors,
        eventLog: props.eventLog
      })
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    analysisResult.value = (await response.text()).replace(/\\n/g, '\n');
  } catch (error) {
    analysisResult.value = 'Error fetching AI analysis: ' + error.message;
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.gameover-screen {
  text-align: center;
  padding: 3rem;
  background: linear-gradient(135deg, #fefefe, #e0e0e0);
  border: 4px solid #000;
  border-radius: 0;
  max-width: 800px;
  margin: 2rem auto;
  font-family: 'Roboto Mono', monospace;
  box-shadow: 5px 5px 0 #000;
  position: relative;
}

/* Decorative dashed border */
.gameover-screen::before {
  content: "";
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border: 2px dashed #000;
  pointer-events: none;
}

.message {
  margin-bottom: 2rem;
  padding: 2rem;
  border: 3px solid #000;
  background: #fff;
  box-shadow: 3px 3px 0 #000;
  position: relative;
  overflow: hidden;
}

.message:hover {
  background: #f0f0f0;
  transition: background 0.3s ease;
}

.victory h1,
.defeat h1 {
  margin: 0;
  font-size: 3rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  position: relative;
}

.victory h1 {
  color: #00aaff;
}

.defeat h1 {
  color: #ff3366;
}

.victory p,
.defeat p {
  font-size: 1.5rem;
  margin-top: 1rem;
}

.ai-request-area {
  margin: 1rem 0;
}

/* Neo Brutalist Button */
.new-game-button,
.ai-analyze-button {
  padding: 1rem 2rem;
  font-size: 1.25rem;
  border: 3px solid #000;
  background-color: #fff;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 3px 3px 0 #000;
  transition: all 0.1s ease-in-out;
  margin: 0.5rem;
  position: relative;
  overflow: hidden;
}

.new-game-button:active,
.ai-analyze-button:active {
  box-shadow: 1px 1px 0 #000;
  transform: translate(2px, 2px);
}

.new-game-button {
  color: #00aaff;
  border-color: #00aaff;
}

.ai-analyze-button {
  color: #ff3366;
  border-color: #ff3366;
}

/* AI Analysis Box */
.ai-analysis {
  margin-top: 2rem;
  padding: 1.5rem;
  border: 2px dashed #000;
  background: #fafafa;
  box-shadow: 2px 2px 0 #000;
  font-size: 1.25rem;
  text-align: left;
}

/* Spinner container to center the spinner */
.spinner-container {
  display: inline-block;
  vertical-align: middle;
  margin: 0.5rem;
}

/* Neo Brutalist Spinner - a rotating dual square */
.spinner {
  display: inline-block;
  position: relative;
  width: 30px;
  height: 30px;
  animation: spin 1s infinite linear;
}

.spinner::before,
.spinner::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 3px solid #ff3366;
  box-sizing: border-box;
}

.spinner::after {
  border-color: #00aaff;
  top: 6px;
  left: 6px;
  width: 18px;
  height: 18px;
  animation: spinReverse 1s infinite linear;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes spinReverse {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(-360deg);
  }
}
</style>