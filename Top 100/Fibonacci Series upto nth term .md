# Question
Write a Java program that reads a number from the user and prints the Fibonacci series up to that many terms.

# Code
```java
import java.util.Scanner;
public class FibonacciSeries {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter number of terms: ");
        int n = sc.nextInt();
        int a = 0, b = 1;
        System.out.print("Fibonacci Series: ");
        for (int i = 1; i <= n; i++) {
            System.out.print(a + " ");
            int next = a + b;
            a = b;
            b = next;
        }
        sc.close();
    }
}
```

# Example Run 1
Quest:
```
Enter number of terms: 5
```
Output:
```
Fibonacci Series: 0 1 1 2 3
```

# Example Run 2
Quest:
```
Enter number of terms: 8
```
Output:
```
Fibonacci Series: 0 1 1 2 3 5 8 13
```

# Example Run 3
Quest:
```
Enter number of terms: 1
```
Output:
```
Fibonacci Series: 0
```
