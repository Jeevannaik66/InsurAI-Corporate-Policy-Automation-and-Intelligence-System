# Question
Write a Java program that reads two numbers from the user and calculates their HCF (Highest Common Factor).

# Code
```java
import java.util.Scanner;
public class HCF {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter first number: ");
        int a = sc.nextInt();
        System.out.print("Enter second number: ");
        int b = sc.nextInt();
        while (a != b) {
            if (a > b) a = a - b;
            else b = b - a;
        }
        System.out.println("HCF = " + a);
        sc.close();
    }
}
```
