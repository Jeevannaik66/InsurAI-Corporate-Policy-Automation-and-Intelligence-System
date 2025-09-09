# Assignment 3  

This assignment focuses on implementing a Java class `Calculator` with an instance variable and a method to compute the sum of its digits. It is part of the Infosys Springboard course on Java – Methods.

## 📝 Problem Statement  
Create a class `Calculator` in the **SwiftFood** project with:  
- An instance variable `num` to store an integer  
- A method `sumOfDigits()` to calculate and return the sum of digits of `num`  
- A tester class to assign a value to `num`, invoke the method, and display the result  

## 🧩 Class Specification  

| Variable Name | Data Type | Description                     |
|---------------|-----------|---------------------------------|
| `num`         | `int`     | Number whose digits are summed  |

## 🔹 Method  

```java
int sumOfDigits()
````

Calculates and returns the sum of all digits in the `num` variable.

## 💻 Java Code

```java
// Calculator.java
public class Calculator {
    int num;
    int sumOfDigits() {
        int sum = 0, temp = num;
        while (temp > 0) {
            sum += temp % 10;
            temp /= 10;
        }
        return sum;
    }
}

// Tester.java
public class Tester {
    public static void main(String[] args) {
        Calculator calculator = new Calculator();
        calculator.num = 1234;

        int result = calculator.sumOfDigits();
        System.out.println("Sum of digits: " + result);
    }
}
```

## 📊 Expected Output

```
Sum of digits: 10
```

