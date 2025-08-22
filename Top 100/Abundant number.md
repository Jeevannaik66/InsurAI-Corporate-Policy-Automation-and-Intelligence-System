# Question
Write a Java program that reads a number from the user and checks whether it is an Abundant number or not.  
(An Abundant number is a number whose sum of proper divisors is greater than the number itself, e.g., 12 → 1 + 2 + 3 + 4 + 6 = 16 > 12)

# Code
```java
import java.util.Scanner;
public class AbundantNumber {
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
        if (sum > n) {
            System.out.println(n + " is an Abundant number");
        } else {
            System.out.println(n + " is not an Abundant number");
        }
        sc.close();
    }
}
```

# Example Run 1
Quest:
```
Enter a number: 12
```
Output:
```
12 is an Abundant number
```

# Example Run 2
Quest:
```
Enter a number: 18
```
Output:
```
18 is an Abundant number
```

# Example Run 3
Quest:
```
Enter a number: 10
```
Output:
```
10 is not an Abundant number
```
