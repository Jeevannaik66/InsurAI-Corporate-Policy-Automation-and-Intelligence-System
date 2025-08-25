# Question
Write a Java program that reads a base `a` and exponent `b` from the user and calculates `a^b` using recursion.

# Code
```java
import java.util.Scanner;
public class PowerRecursive {
    public static int power(int a, int b) {
        if (b == 0) return 1;
        return a * power(a, b - 1);
    }
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter base (a): ");
        int a = sc.nextInt();
        System.out.print("Enter exponent (b): ");
        int b = sc.nextInt();
        int result = power(a, b);
        System.out.println(a + " raised to the power " + b + " = " + result);
        sc.close();
    }
}
```

# Example Run 1
Quest:
```
Enter base (a): 2
Enter exponent (b): 5
```
Output:
```
2 raised to the power 5 = 32
```

# Example Run 2
Quest:
```
Enter base (a):
