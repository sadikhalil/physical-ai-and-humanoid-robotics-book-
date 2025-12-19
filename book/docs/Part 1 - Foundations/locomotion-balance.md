---
id: locomotion-balance
---

# Chapter 5: Locomotion & Balance



Locomotion in humanoid robots refers to their ability to move from one place to another. This is a complex challenge, as it involves coordinating multiple joints, maintaining balance, and adapting to various terrains. Unlike wheeled or tracked robots, humanoid robots aim to emulate human-like movement, which offers versatility in navigating environments designed for humans.

## Walking Techniques

Walking is the primary mode of locomotion for humanoid robots. It involves a repetitive sequence of steps where the robot shifts its weight and moves its legs to propel itself forward. Various control strategies and gaits are employed to achieve stable and efficient walking:

### Zero Moment Point (ZMP)
The Zero Moment Point (ZMP) is a fundamental concept in humanoid robot walking. It represents the point on the ground where the net moment of all forces (gravity, inertia, and ground reaction forces) is zero. For stable walking, the ZMP must remain within the robot's support polygon (the area defined by the contact points of the feet with the ground). Controllers often compute desired joint trajectories to keep the ZMP within this stable region.

```mermaid
graph TD
    subgraph ZMP for Stability
        A[Center of Gravity (CoG)] -- Projects to --> B(Zero Moment Point - ZMP);
        C[Support Polygon (Foot/Feet)]
        B -- Must be within --> C;
        C -- Ensures --> D{Stable Walking};
    end
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#ccf,stroke:#333,stroke-width:2px
    style D fill:#9c9,stroke:#333,stroke-width:2px
```

### Pattern Generators
Walking patterns can be generated offline or in real-time. Offline pattern generators pre-calculate joint angles and trajectories, while real-time generators adapt the walking pattern based on sensor feedback. Common gaits include:
- **Static Walking:** The robot's center of gravity (CoG) always stays within the support polygon, making it inherently stable but slow.
- **Dynamic Walking:** The robot's CoG moves outside the support polygon for brief periods, requiring active balance control but allowing for faster and more natural movement.

| Feature | Static Walking | Dynamic Walking |
| :--- | :--- | :--- |
| **Speed** | Slow and deliberate | Fast and more natural |
| **CoG Position** | Always inside support polygon | Can move outside support polygon |
| **Stability** | Inherently stable | Requires active balance control |
| **Energy Efficiency**| Generally lower | Can be more efficient |
| **Example** | Early humanoid prototypes | Modern robots like Atlas |

### Inverse Kinematics and Dynamics
- **Inverse Kinematics:** Used to calculate the joint angles required to achieve a desired end-effector (foot) position and orientation.
- **Inverse Dynamics:** Used to calculate the joint torques required to achieve a desired motion, considering the robot's mass, inertia, and external forces.

## Balancing Techniques

Maintaining balance is crucial for humanoid robots, both during static postures and dynamic movements like walking. It involves continuously sensing the robot's orientation and position and making real-time adjustments to joint angles and body posture.

### Static Balance
Static balance is achieved when the robot's center of gravity (CoG) is projected onto a point within its support polygon. Techniques for maintaining static balance include:
- **Center of Gravity (CoG) Control:** Adjusting joint angles to shift the CoG over the support base.
- **Ankle and Hip Strategies:** Small adjustments in ankle and hip joints to counteract disturbances and maintain an upright posture.

### Dynamic Balance
Dynamic balance is more complex and involves controlling the robot's momentum and angular velocity. This is essential for walking, running, and interacting with the environment.
- **Feedback Control:** Using sensor data (IMUs, force sensors) to detect deviations from desired balance and apply corrective actions.
- **Model Predictive Control (MPC):** Predicting future robot behavior and optimizing control inputs to maintain stability over a time horizon.
- **Whole-Body Control:** Coordinating all robot joints to achieve a desired task (e.g., walking) while simultaneously maintaining balance and avoiding obstacles.

### Sensors for Balance
- **Inertial Measurement Units (IMUs):** Provide data on orientation, angular velocity, and linear acceleration, crucial for detecting changes in balance.
- **Force/Torque Sensors:** Located in the feet, they measure ground reaction forces, which are vital for ZMP calculation and weight distribution.
- **Vision Systems:** Can be used to detect changes in the environment or the robot's posture relative to its surroundings.

The combination of sophisticated walking gaits and robust balancing techniques allows humanoid robots to perform complex tasks and navigate diverse environments, bringing them closer to mimicking human capabilities.

## Code Example: Simple Balance Controller

The following pseudo-code illustrates a simplified balance controller that uses an ankle and hip strategy to maintain an upright posture. It reads from a mock IMU and applies corrective actions to the joints.

```python
# Simple pseudo-code for a balance controller

class BalanceController:
    def __init__(self):
        # Mock IMU and joint controller
        self.imu = "IMU_SENSOR"
        self.ankle_joint = "ANKLE_JOINT_CONTROLLER"
        self.hip_joint = "HIP_JOINT_CONTROLLER"
        self.desired_pitch = 0.0 # Upright stance

    def get_imu_pitch(self):
        """Reads the current pitch angle from the IMU."""
        # In a real robot, this would read from the sensor
        import random
        # Simulate some random disturbance
        disturbance = random.uniform(-2.0, 2.0)
        # Mock a reading that's slightly off from desired
        return self.desired_pitch + disturbance

    def correct_balance(self):
        """Reads sensor data and applies corrections to joints."""
        current_pitch = self.get_imu_pitch()
        error = self.desired_pitch - current_pitch
        
        print(f"Balance Check: Current Pitch = {current_pitch:.2f}°, Error = {error:.2f}°")

        # This is a very simple Proportional (P) controller
        # A real controller would be a more complex PID or LQR controller
        
        # Ankle Strategy for small errors
        if abs(error) < 1.0:
            ankle_correction = error * 1.5 # Gain for ankle
            print(f"  -> Ankle Strategy: Applying {ankle_correction:.2f}° correction to ankle.")
            # self.ankle_joint.adjust_angle(ankle_correction)
        # Hip Strategy for larger errors
        else:
            hip_correction = error * 1.2 # Gain for hip
            print(f"  -> Hip Strategy: Applying {hip_correction:.2f}° correction to hip.")
            # self.hip_joint.adjust_angle(hip_correction)

# --- Main Program ---
if __name__ == "__main__":
    balance_controller = BalanceController()
    
    print("Starting balance control loop...\n")
    # Run the balance loop for a few cycles
    for _ in range(5):
        balance_controller.correct_balance()
        import time
        time.sleep(1)
    
    print("\nBalance control loop finished.")

```
---
