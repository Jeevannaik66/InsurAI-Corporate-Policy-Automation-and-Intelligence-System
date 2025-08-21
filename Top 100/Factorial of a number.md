# Question
Write a Java program that reads a number from the user and prints its factorial.

# Code
```java
import java.util.Scanner;
public class Factorial {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter a number: ");
        int n = sc.nextInt();
        long fact = 1;
        for (int i = 1; i <= n; i++) {
            fact *= i;
        }
        System.out.println("Factorial of " + n + " = " + fact);
        sc.close();
    }
}
```

# Example Run 1
Quest:
```
Enter a number: 5
```
Output:
```
Factorial of 5 = 120
```

# Example Run 2
Quest:
```
Enter a number: 0
```
Output:
```
Factorial of 0 = 1
```

# Example Run 3
Quest:
```
Enter a number: 7
```
Output:
```
Factorial of 7 = 5040
```
