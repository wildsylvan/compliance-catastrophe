<template>
  <div class="flex gap-8 w-full max-w-5xl">
    <!-- Vendor Info Section -->
    <div class="flex flex-col gap-6 flex-1 bg-purple-400 p-6 rounded-lg border-4 border-black shadow-brutal">
      <!-- Top Info: Resources and Turn -->
      <div class="flex gap-6">
        <div class="bg-white p-4 rounded-lg border-4 border-black w-44 text-center shadow-brutal">
          <p class="text-lg font-bold">💰 Resources</p>
          <p class="text-4xl font-extrabold">{{ resource }}%</p>
        </div>
        <div class="bg-white p-4 rounded-lg border-4 border-black w-44 text-center shadow-brutal">
          <p class="text-lg font-bold">📅 Turn</p>
          <p class="text-4xl font-extrabold">{{ turn }}/{{ maxTurns }}</p>
        </div>
      </div>

      <!-- Vendor Info with Fast Transition -->
      <transition name="vendor-fade" mode="out-in">
        <!-- Using a key that changes with the turn -->
        <div :key="vendorKey"
          class="bg-white p-6 rounded-lg border-4 border-black text-center shadow-brutal flex flex-col items-center gap-5">
          <div class="flex flex-row gap-5 justify-between w-full">
            <div>
              <div class="flex items-center gap-2">
                <div class="text-3xl font-extrabold underline">{{ vendor.name }}</div>
                <img :src="`https://api.dicebear.com/9.x/shapes/svg?seed=${vendor.name}`" alt="Vendor"
                  class="w-10 h-10 border-4 border-black bg-gray-200" />
              </div>
              <p class="text-lg text-gray-700 font-bold">{{ vendor.industry }} - {{ vendor.country }}</p>
            </div>
            <div class="bg-black text-white p-2 -skew-4">
              <p class="text-2xl font-black">
                <span v-for="n in vendor.compliance_rating" :key="n" class="text-yellow-200">⭐</span>
              </p>
              <div class="uppercase text-xs font-black">Compliance Rating</div>
            </div>
          </div>
          <!-- Representative or Audit Result -->
          <div class="flex items-center gap-4 p-4 border-4 border-black rounded-lg shadow-brutal"
            :class="{ 'bg-white': !vendor.didAudit, 'bg-yellow-200': vendor.didAudit }">
            <img v-if="!vendor.didAudit"
              :src="`https://api.dicebear.com/9.x/avataaars/svg?clothing=blazerAndShirt&mouth=smile&eyes=squint&seed=${vendor.name}`"
              alt="Representative" class="w-20 h-20 border-4 border-black bg-gray-200 rounded-full" />
            <div class="p-3 text-lg font-bold">
              {{ vendor.didAudit ? vendor.audit_result : `"${vendor.vendor_defense}"` }}
            </div>
          </div>
        </div>
      </transition>

      <!-- Action Buttons -->
      <div class="flex gap-4 justify-center">
        <button
          class="bg-green-400 w-1/3 px-6 py-4 rounded-full border-4 border-black text-xl font-bold shadow-brutal transform hover:scale-110 transition-all"
          @click="approveVendor">
          ✅ Approve
        </button>
        <button
          class="bg-yellow-400 w-1/3 px-6 py-4 rounded-full border-4 border-black text-xl font-bold shadow-brutal disabled:opacity-50 transform hover:not-disabled:scale-110 transition-all"
          :disabled="vendor.didAudit" @click="auditVendor">
          🔍 Audit
        </button>
        <button
          class="bg-red-400 w-1/3 px-6 py-4 rounded-full border-4 border-black text-xl font-bold shadow-brutal transform hover:scale-110 transition-all"
          @click="rejectVendor">
          ❌ Reject
        </button>
      </div>
    </div>

    <!-- Compliance Log Section -->
    <div class="bg-blue-400 p-6 w-80 rounded-lg border-4 border-black shadow-brutal h-96 overflow-y-auto">
      <h2 class="text-2xl font-extrabold text-black text-center mb-2 underline">📂 Compliance Log</h2>
      <transition-group name="log" tag="div">
        <div v-for="(event, index) in eventLog" :key="event.id"
          class="flex flex-col justify-between items-center text-lg bg-white p-3 border-2 border-black font-bold shadow-brutal">
          <span>{{ event.action }}</span>
          <span :class="{ 'text-green-500': event.cost.includes('+'), 'text-red-500': event.cost.includes('-') }"
            class="font-extrabold">
            {{ event.cost }}
          </span>
        </div>
      </transition-group>
    </div>
  </div>

  <!-- Action Popup -->
  <div v-if="popupVisible" class="popup-overlay">
    <div class="audit-popup animate-popup max-w-150">
      <div class="audit-popup-content bg-white border-4 border-black shadow-brutal p-6 rounded-lg">
        <h2 class="text-3xl font-bold mb-4">{{ popupTitle }}</h2>
        <p class="text-xl font-mono">{{ popupMessage }}</p>
        <!-- Display the action cost/bonus -->
        <p :class="['text-lg font-bold mt-2', popupCostClass]">{{ popupCost }}</p>
        <button
          class="mt-4 bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-full border-4 border-black shadow-brutal"
          @click="closePopup">Close</button>
      </div>
    </div>
  </div>

  <!-- Full Screen Action Animation -->
  <div v-if="actionAnimation" class="action-animation">
    <span class="action-text"
      :class="{ 'text-green-400': actionAnimation === 'approve', 'text-red-400': actionAnimation === 'reject', 'text-yellow-400': actionAnimation === 'audit' }">
      {{ actionAnimation === 'approve' ? 'Approved' : actionAnimation === 'audit' ? 'Audited' : 'Rejected' }}!
    </span>
  </div>
</template>

<style scoped>
/* Vendor Transition: Faster and Subtle */
.vendor-fade-enter-active,
.vendor-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.vendor-fade-enter-from,
.vendor-fade-leave-to {
  opacity: 0;
  transform: translateX(5px);
}

.vendor-fade-enter-to,
.vendor-fade-leave-from {
  opacity: 1;
  transform: translateX(0);
}

/* Compliance Log Transition: Subtle Slide-In */
.log-enter-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.log-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.log-enter-to {
  opacity: 1;
  transform: translateX(0);
}

/* Prevent existing entries from moving */
.log-move {
  transition: none;
}

/* Popup overlay for Action Popup */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  /* Semi-transparent black */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Audit Popup Styles */
.audit-popup {
  animation: popup 0.5s ease-out;
}

@keyframes popup {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Full Screen Action Animation */
.action-animation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  z-index: 1100;
}

.action-text {
  font-size: 5rem;
  font-weight: bold;
  text-transform: uppercase;
  animation: flash 1s ease-out;
}

@keyframes flash {
  0% {
    transform: scale(0);
    opacity: 0;
  }

  50% {
    transform: scale(1.2);
    opacity: 1;
  }

  100% {
    transform: scale(1);
    opacity: 0;
  }
}

/* Basic Button Styling */
button:not(:disabled) {
  cursor: pointer;
}
</style>

<script setup>
import { ref, computed } from 'vue';

// Declare event emitter for game over
const emit = defineEmits(['gameOver']);

// Props
const props = defineProps({
  vendors: Array,
});

// State variables
const resource = ref(100);
const turn = ref(1);
const eventLog = ref([]);

// Computed vendor key to trigger the transition
const vendorKey = computed(() => `vendor-${turn.value}`);

const maxTurns = props.vendors.length;
const vendor = computed(() => props.vendors[turn.value - 1] || {});

// Popup state for Audit, Approval, and Rejection
const popupVisible = ref(false);
const popupTitle = ref('');
const popupMessage = ref('');
const popupAction = ref('');
const popupCost = ref('');

// Computed class for popup cost text
const popupCostClass = computed(() => {
  if (popupCost.value.includes('+')) {
    return 'text-green-500';
  } else if (popupCost.value.includes('-')) {
    return 'text-red-500';
  }
  return '';
});

// Full Screen Action Animation state
const actionAnimation = ref(null);

// Unique ID generator for log events
let eventIdCounter = 0;
const addLogEvent = (action, cost) => {
  eventLog.value.unshift({ id: eventIdCounter++, action, cost });
};

// Function to check for game over and emit event if conditions are met.
const checkGameOver = () => {
  if (turn.value > maxTurns || resource.value <= 0) {
    addLogEvent(`📑 Compliance Review Complete!`, `Final Resources: ${resource.value}%`);
    // Emit the gameOver event with final resources and the event log
    emit('gameOver', JSON.parse(JSON.stringify({ vendors: props.vendors, resources: resource.value, eventLog: eventLog.value })));
    return true;
  }
  return false;
};

const nextTurn = () => {
  turn.value++;
  if (checkGameOver()) return;
};

const closePopup = () => {
  if (popupAction.value === 'audit') {
    vendor.value.didAudit = true;
  } else if (popupAction.value === 'approve' || popupAction.value === 'reject') {
    nextTurn();
  }
  popupVisible.value = false;
  popupAction.value = '';
  popupTitle.value = '';
  popupMessage.value = '';
  popupCost.value = '';
};

const showPopup = (action) => {
  popupAction.value = action;
  if (action === 'audit') {
    popupTitle.value = 'Audit Result';
    popupMessage.value = vendor.value.audit_result;
  } else if (action === 'approve') {
    popupTitle.value = 'Approval Consequence';
    popupMessage.value = vendor.value.approval_consequence;
  } else if (action === 'reject') {
    popupTitle.value = 'Rejection Consequence';
    popupMessage.value = vendor.value.rejection_consequence;
  }
  popupVisible.value = true;
};

const auditVendor = () => {
  if (vendor.value.didAudit) {
    return;
  }
  resource.value -= 8;
  if (checkGameOver()) return;
  actionAnimation.value = 'audit';
  setTimeout(() => {
    actionAnimation.value = null;
  }, 1000);
  addLogEvent(`🔍 Audited ${vendor.value.name}.`, `Action Cost: -8%`);
  popupCost.value = 'Action Cost: -8%';
  showPopup('audit');
};

const approveVendor = () => {
  const change = !vendor.value.has_violations ? 10 : -25;
  resource.value += change;
  if (checkGameOver()) return;
  const costText = change > 0 ? `+${change}%` : `${change}%`;
  addLogEvent(`✅ Approved ${vendor.value.name}.`, `Action ${change > 0 ? 'Bonus' : 'Cost'}: ${costText}`);
  popupCost.value = `Action ${change > 0 ? 'Bonus' : 'Cost'}: ${costText}`;
  actionAnimation.value = 'approve';
  setTimeout(() => {
    actionAnimation.value = null;
  }, 1000);
  showPopup('approve');
};

const rejectVendor = () => {
  resource.value -= 12;
  if (checkGameOver()) return;
  addLogEvent(`❌ Rejected ${vendor.value.name}.`, `Action Cost: -12%`);
  popupCost.value = 'Action Cost: -12%';
  actionAnimation.value = 'reject';
  setTimeout(() => {
    actionAnimation.value = null;
  }, 1000);
  showPopup('reject');
};
</script>