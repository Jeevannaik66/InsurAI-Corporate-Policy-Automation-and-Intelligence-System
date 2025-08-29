# Question
Write a Java program that reads an octal number from the user and converts it to its decimal equivalent.

# Code
```java
import java.util.Scanner;
public class OctalToDecimal {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter an octal number: ");
        int octal = sc.nextInt();
        int decimal = 0, base = 1;
        int temp = octal;
        while (temp > 0) {
            int lastDigit = temp % 10;
            decimal += lastDigit * base;
            base *= 8;
            temp /= 10;
        }
        System.out.println("Decimal equivalent = " + decimal);
        sc.close();
    }
}
```
