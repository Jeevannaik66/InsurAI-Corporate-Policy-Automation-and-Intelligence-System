# Question
Write a Java program that reads a number from the user and checks whether it is a Perfect number or not.  
(A Perfect number is a number whose sum of proper divisors equals the number itself, e.g., 6 = 1 + 2 + 3)

# Code
```java
import java.util.Scanner;
public class PerfectNumber {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter a number: ");
        int n = sc.nextInt();
        int sum = 0;
        for (int i = 1; i <= n / 2; i++) {
            if (n % i == 0) {
                sum += i;
            }
        }
        if (sum == n) {
            System.out.println(n + " is a Perfect number");
        } else {
            System.out.println(n + " is not a Perfect number");
        }
        sc.close();
    }
}
```

# Example Run 1
Quest:
```
Enter a number: 6
```
Output:
```
6 is a Perfect number
```

# Example Run 2
Quest:
```
Enter a number: 28
```
Output:
```
28 is a Perfect number
```

# Example Run 3
Quest:
```
Enter a number: 12
```
Output:
```
12 is not a Perfect number
```
