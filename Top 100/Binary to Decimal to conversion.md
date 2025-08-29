# Question
Write a Java program that reads a binary number from the user and converts it to its decimal equivalent.

# Code
```java
import java.util.Scanner;
public class BinaryToDecimal {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter a binary number: ");
        int binary = sc.nextInt();
        int decimal = 0, base = 1;
        int temp = binary;
        while (temp > 0) {
            int lastDigit = temp % 10;
            decimal += lastDigit * base;
            base *= 2;
            temp /= 10;
        }
        System.out.println("Decimal equivalent = " + decimal);
        sc.close();
    }
}
```
