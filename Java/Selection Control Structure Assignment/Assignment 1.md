# Assignment – Selection Control Structure 01

## 📝 Problem Statement

Implement a program to display the **sum of two given numbers** if the numbers are the **same**.  
If the numbers are **not the same**, display **double the sum**.

Test the functionality using the `main()` method of the `Tester` class.

---

## 🖼️ Sample Input and Output

<img width="408" height="118" alt="selectioncext1" src="https://github.com/user-attachments/assets/edbb44f9-ac4c-4b4f-90f8-a24a9d046b7d" />

---

## 💡 How It Works

- If both numbers are equal → print `sum`  
- Else → print `2 × sum`

---

## ✅ Solution – `Tester.java`

```java
class Tester {
    public static void main(String[] args) {
        int num1 = 10;
        int num2 = 20;

        if (num1 == num2) {
            System.out.println(num1 + num2);
        } else {
            System.out.println(2 * (num1 + num2));
        }
    }
}
