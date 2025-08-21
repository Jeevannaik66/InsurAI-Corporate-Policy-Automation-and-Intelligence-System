# Question
Write a Java program that reads a base `a` and an exponent `b` from the user and calculates `a^b`.

# Code
```java
import java.util.Scanner;
public class PowerCalculator {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter base (a): ");
        int a = sc.nextInt();
        System.out.print("Enter exponent (b): ");
        int b = sc.nextInt();
        long result = 1;
        for (int i = 1; i <= b; i++) {
            result *= a;
        }
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
Enter base (a): 3
Enter exponent (b): 4
```
Output:
```
3 raised to the power 4 = 81
```

# Example Run 3
Quest:
```
Enter bas
