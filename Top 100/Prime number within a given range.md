# Question
Write a Java program that reads two numbers from the user (start and end of a range) and prints all prime numbers within that range.

# Code
```java
import java.util.Scanner;
public class PrimeInRange {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter the starting number: ");
        int start = sc.nextInt();
        System.out.print("Enter the ending number: ");
        int end = sc.nextInt();
        System.out.println("Prime numbers between " + start + " and " + end + " are:");
        for (int n = start; n <= end; n++) {
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
                System.out.print(n + " ");
            }
        }
        sc.close();
    }
}
```

# Example Run 1
Quest:
```
Enter the starting number: 1
Enter the ending number: 10
```
Output:
```
Prime numbers between 1 and 10 are:
2 3 5 7
```

# Example Run 2
Quest:
```
Enter the starting number: 10
Enter the ending number: 20
```
Output:
```
Prime numbers between 10 and 20 are:
11 13 17 19
```

# Example Run 3
Quest:
```
Enter the starting number: 20
Enter the ending number: 30
```
Output:
```
Prime numbers between 20 and 30 are:
23 29
```
