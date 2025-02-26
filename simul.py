import random

# Simulation Parameters
NUM_SIMULATIONS = 10000  # Number of games to simulate
NUM_TURNS = 10  # Each game lasts 10 turns

# Game Mechanics (Adjusted Percentages)
APPROVE_GOOD = 10  # +10% if vendor is good
APPROVE_BAD = -25  # -25% if vendor is bad
AUDIT = -8         # -8% always
REJECT = -12       # -12% always

# Probability of a good vendor appearing
GOOD_VENDOR_PROB = 0.20  # 50% chance a vendor is good

# Track results
final_resources = []

for _ in range(NUM_SIMULATIONS):
    resource = 100  # Start at 100%

    for _ in range(NUM_TURNS):
        action = random.choice(["approve", "audit", "reject"])
        is_good_vendor = random.random() < GOOD_VENDOR_PROB

        if action == "approve":
            resource += APPROVE_GOOD if is_good_vendor else APPROVE_BAD
        elif action == "audit":
            resource += AUDIT
        elif action == "reject":
            resource += REJECT

        # Game over condition (resource drops to 0 or below)
        if resource <= 0:
            break

    final_resources.append(resource)

# Calculate stats
average_final_resource = sum(final_resources) / NUM_SIMULATIONS
games_lost = sum(1 for r in final_resources if r <= 0)
loss_rate = games_lost / NUM_SIMULATIONS * 100

# Output results
print(f"Average Final Resource: {average_final_resource:.2f}%")
print(f"Loss Rate: {loss_rate:.2f}% of games end in failure")