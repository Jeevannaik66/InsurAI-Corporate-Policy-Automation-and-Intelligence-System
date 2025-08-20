# Question
Write a Java program to generate the Fibonacci series up to N terms and print the sum of the series.

# Code
```java
import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int a = 0, b = 1, sum = 0;
        for (int i = 1; i <= n; i++) {
            System.out.print(a + " ");
            sum += a;
            int next = a + b;
            a = b;
            b = next;
        }
        System.out.println(sum);
    }
}
```

# Example Run 1
Quest:
```
5
```
Output:
```
0 1 1 2 3 7
```

# Example Run 2
Quest:
```
7
```
Output:
```
0 1 1 2 3 5 8 20
```

# Example Run 3
Quest:
```
10
```
Output:
```
0 1 1 2 3 5 8 13 21 34 88
```
