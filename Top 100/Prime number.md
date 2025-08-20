# Question
Write a Java program that reads a number from the user and checks whether it is a prime number or not.

# Code
```java
import java.util.Scanner;
public class PrimeCheck {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter a number: ");
        int n = sc.nextInt();
        boolean isPrime = true;
        if (n <= 1) {
            isPrime = false;
        } else {
            for (int i = 2; i <= n / 2; i++) {
                if (n % i == 0) {
                    isPrime = false;
                    break;
                }
            }
        }
        if (isPrime) {
            System.out.println(n + " is a prime number");
        } else {
            System.out.println(n + " is not a prime number");
        }
        sc.close();
    }
}
```

# Example Run 1
Quest:
```
Enter a number: 7
```
Output:
```
7 is a prime number
```

# Example Run 2
Quest:
```
Enter a number: 10
```
Output:
```
10 is not a prime number
```

# Example Run 3
Quest:
```
Enter a number: 1
```
Output:
```
1 is not a prime number
```
