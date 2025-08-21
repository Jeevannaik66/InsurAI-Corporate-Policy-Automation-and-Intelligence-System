# Question
Write a Java program that reads a number `n` from the user and prints the Nth term of the Fibonacci series.

# Code
```java
import java.util.Scanner;
public class FibonacciNthTerm {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter the term (n): ");
        int n = sc.nextInt();
        if (n == 1) {
            System.out.println("Nth Fibonacci term = 0");
        } else if (n == 2) {
            System.out.println("Nth Fibonacci term = 1");
        } else {
            int a = 0, b = 1, fib = 0;
            for (int i = 3; i <= n; i++) {
                fib = a + b;
                a = b;
                b = fib;
            }
            System.out.println("Nth Fibonacci term = " + fib);
        }
        sc.close();
    }
}
```

# Example Run 1
Quest:
```
Enter the term (n): 5
```
Output:
```
Nth Fibonacci term = 3
```

# Example Run 2
Quest:
```
Enter the term (n): 10
```
Output:
```
Nth Fibonacci term = 34
```

# Example Run 3
Quest:
```
Enter the term (n): 1
```
Output:
```
Nth Fibonacci t
