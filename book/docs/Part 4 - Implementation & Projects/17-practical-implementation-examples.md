# Chapter 17: Practical Implementation Examples

## Introduction

Theory is essential, but true understanding in Physical AI comes from hands-on practice. This chapter dives into practical examples, guiding you through step-by-step experiments and coding exercises. We'll focus on building foundational robotic capabilities, illustrating how theoretical concepts translate into working systems. These examples will primarily use accessible educational platforms, reinforcing the hybrid learning approach.

## Setting Up a Basic Robotic Platform

Before we can implement complex AI, we need a functional robot. For our examples, we'll consider a simple mobile robot, often built with components like a Raspberry Pi (or Arduino), motor drivers, and a chassis with wheels.

### Key Components:
- **Microcontroller/SBC (Single Board Computer):** (e.g., Arduino, Raspberry Pi) - The "brain" that executes code.
- **Motor Driver:** An electronic circuit that allows the microcontroller to control the speed and direction of motors.
- **DC Motors:** For locomotion (moving the wheels).
- **Power Supply:** Batteries to power the motors and the microcontroller.
- **Chassis & Wheels:** The physical structure of the robot.

### Conceptual Control Flow:

```mermaid
graph TD
    subgraph Robot System
        A[Code (Python/C++)] --> B[Microcontroller (e.g., Raspberry Pi)];
        B -- PWM Signals --> C[Motor Driver];
        C -- Electrical Power --> D[DC Motors];
        D -- Mechanical Force --> E[Wheels/Robot Movement];
        F[Sensors (e.g., Ultrasonic, Camera)] -- Data --> B;
    end
    style B fill:#f9f,stroke:#333,stroke-width:2px
```

## Example 1: Basic Motor Control (Move Forward, Turn)

This is the "Hello World" of mobile robotics. We'll program the robot to move forward and turn.

### Objective:
Make a two-wheeled robot move forward for a set duration, then turn in place.

### Components Needed:
- Raspberry Pi (or Arduino)
- L298N Motor Driver
- 2 DC Gear Motors with wheels
- Battery pack (e.g., 9V or 12V)
- Breadboard and jumper wires

### Step-by-Step Breakdown:
1.  **Hardware Connection:** Connect motors to the motor driver, and the motor driver to the Raspberry Pi's GPIO pins. Power the motor driver from the battery pack.
2.  **Motor Driver Library:** Use or write a simple Python class (for Raspberry Pi) to interface with the motor driver (e.g., `GPIO.output(pin, GPIO.HIGH)`).
3.  **Basic Functions:** Implement `move_forward()`, `turn_left()`, `turn_right()`, `stop()`.

## Comparison of Microcontrollers for Robotics

| Feature | Arduino Uno | Raspberry Pi 4 |
| :--- | :--- | :--- |
| **Type** | Microcontroller | Single Board Computer |
| **OS** | None (Bare Metal) | Linux (Raspberry Pi OS) |
| **Processing Power**| Low | High (Quad-core CPU) |
| **RAM** | 2KB | 2GB / 4GB / 8GB |
| **Connectivity** | USB, Serial | USB, Ethernet, Wi-Fi, Bluetooth |
| **Programming** | C++ (Arduino IDE) | Python, C++, Node.js, etc. |
| **Best For** | Real-time control, simple sensors/actuators | Complex AI, vision, high-level control, networking |

## Code Example: Simple Motor Control in Python (Conceptual)

This pseudo-code demonstrates controlling two motors using a conceptual `MotorDriver` class, simulating commands to Raspberry Pi's GPIO.

```python
import time

# --- Conceptual Motor Driver Class ---
# In a real RPi project, you'd use a library like RPi.GPIO
class Motor:
    def __init__(self, in1_pin, in2_pin, pwm_pin, name="Motor"):
        self.name = name
        self.in1 = in1_pin
        self.in2 = in2_pin
        self.pwm = pwm_pin
        # GPIO.setmode(GPIO.BCM) # This would be called once at the start of the program
        # GPIO.setup(in1_pin, GPIO.OUT)
        # GPIO.setup(in2_pin, GPIO.OUT)
        # GPIO.setup(pwm_pin, GPIO.OUT)
        # self.pwm_instance = GPIO.PWM(pwm_pin, 100) # 100 Hz PWM frequency
        # self.pwm_instance.start(0) # Start with 0% duty cycle (motor off)
        print(f"Initialized {self.name} on pins IN1:{in1_pin}, IN2:{in2_pin}, PWM:{pwm_pin}")

    def set_speed(self, speed): # speed from -100 (full reverse) to 100 (full forward)
        if speed > 0: # Forward
            # GPIO.output(self.in1, GPIO.HIGH)
            # GPIO.output(self.in2, GPIO.LOW)
            # self.pwm_instance.ChangeDutyCycle(abs(speed))
            print(f"{self.name}: Moving FORWARD at {abs(speed)}%")
        elif speed < 0: # Reverse
            # GPIO.output(self.in1, GPIO.LOW)
            # GPIO.output(self.in2, GPIO.HIGH)
            # self.pwm_instance.ChangeDutyCycle(abs(speed))
            print(f"{self.name}: Moving REVERSE at {abs(speed)}%")
        else: # Stop
            # GPIO.output(self.in1, GPIO.LOW)
            # GPIO.output(self.in2, GPIO.LOW)
            # self.pwm_instance.ChangeDutyCycle(0)
            print(f"{self.name}: STOPPED")

class RobotController:
    def __init__(self):
        # GPIO.setmode(GPIO.BCM) # Use Broadcom pin-numbering scheme - called once before any GPIO setup
        self.left_motor = Motor(in1_pin=17, in2_pin=18, pwm_pin=27, name="Left Motor")
        self.right_motor = Motor(in1_pin=23, in2_pin=24, pwm_pin=22, name="Right Motor")
        print("Robot controller initialized.")

    def move_forward(self, speed=50, duration=1.0):
        print(f"\nCommand: Move Forward at {speed}% for {duration}s")
        self.left_motor.set_speed(speed)
        self.right_motor.set_speed(speed)
        time.sleep(duration)
        self.stop()

    def turn_left(self, speed=50, duration=0.5):
        print(f"\nCommand: Turn Left at {speed}% for {duration}s")
        self.left_motor.set_speed(-speed) # Left motor reverse
        self.right_motor.set_speed(speed) # Right motor forward
        time.sleep(duration)
        self.stop()

    def stop(self):
        print("\nCommand: STOP")
        self.left_motor.set_speed(0)
        self.right_motor.set_speed(0)

# --- Main Program Execution ---
if __name__ == "__main__":
    robot = RobotController()
    
    try:
        robot.move_forward(speed=60, duration=2.0)
        robot.turn_left(speed=40, duration=1.5)
        robot.move_forward(speed=70, duration=1.0)
    except KeyboardInterrupt:
        print("Program interrupted by user.")
    finally:
        robot.stop()
        # GPIO.cleanup() # Clean up GPIO settings after use

```

## Conclusion

Practical implementation is where theoretical knowledge truly comes alive. By starting with basic control examples, you can build a strong foundation for understanding more complex robotic behaviors and AI integration. Educational kits provide a safe and effective environment to experiment, debug, and iterate, transforming abstract concepts into tangible results.
---
