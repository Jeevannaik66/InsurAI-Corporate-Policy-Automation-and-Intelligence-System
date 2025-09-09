# Assignment – Selection Control Structure 02

## 📝 Problem Statement

A quadratic equation is of the form: **ax² + bx + c = 0**, where *a, b,* and *c* are coefficients.

Write a program to solve the equation using the discriminant formula:

- **discriminant = b² - 4ac**

### Based on the value of the discriminant:
- If it's **0**, both roots are equal → display the root
- If it's **greater than 0**, the roots are **real and unequal** → display both roots
- If it's **less than 0**, there are **no real roots** → display "The equation has no real root"

Use the formula:  
**x = (-b ± √discriminant) / 2a**

---

## 🖼️ Sample Input and Output

<img width="451" height="118" alt="selectioncext4" src="https://github.com/user-attachments/assets/495a0836-9279-475f-b175-69785be260b7" />

---

## 💡 How It Works

The discriminant determines the nature of the roots.  
Math.sqrt() is used to calculate the square root.

---

## ✅ Solution – `Tester.java`

```java
class Tester {
    public static void main(String[] args) {
        double a = 1;
        double b = -3;
        double c = 2;

        double discriminant = b * b - 4 * a * c;

        if (discriminant == 0) {
            double root = -b / (2 * a);
            System.out.println("Root: " + root);
        } else if (discriminant > 0) {
            double root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
            double root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
            System.out.println("Roots: " + root1 + " and " + root2);
        } else {
            System.out.println("The equation has no real root");
        }
    }
}
