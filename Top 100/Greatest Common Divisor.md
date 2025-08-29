# Question
Write a Java program that reads two numbers from the user and calculates their Greatest Common Divisor (GCD).

# Code
```java
import java.util.Scanner;
public class GCD {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter first number: ");
        int a = sc.nextInt();
        System.out.print("Enter second number: ");
        int b = sc.nextInt();
        while (b != 0) {
            int temp = b;
            b = a % b;
            a = temp;
        }
        System.out.println("GCD = " + a);
        sc.close();
    }
}
```
