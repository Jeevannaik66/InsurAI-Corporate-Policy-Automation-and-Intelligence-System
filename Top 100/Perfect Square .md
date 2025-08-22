# Question
Write a Java program that reads a number from the user and checks whether it is a perfect square or not.  
(A perfect square is a number whose square root is an integer, e.g., 16 = 4 × 4)

# Code
```java
import java.util.Scanner;
public class PerfectSquare {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter a number: ");
        int n = sc.nextInt();
        int sqrt = (int)Math.sqrt(n);
        if (sqrt * sqrt == n) {
            System.out.println(n + " is a Perfect Square");
        } else {
            System.out.println(n + " is not a Perfect Square");
        }
        sc.close();
    }
}
```

# Example Run 1
Quest:
```
Enter a number: 16
```
Output:
```
16 is a Perfect Square
```

# Example Run 2
Quest:
```
Enter a number: 20
```
Output:
```
20 is not a Perfect Square
```

# Example Run 3
Quest:
```
Enter a number: 25
```
Output:
```
25 is a Perfect Square
```
