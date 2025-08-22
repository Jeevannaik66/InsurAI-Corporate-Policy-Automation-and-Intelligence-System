# Question
Write a Java program that reads a number from the user and prints all its prime factors.

# Code
```java
import java.util.Scanner;
public class PrimeFactors {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter a number: ");
        int n = sc.nextInt();
        System.out.println("Prime factors of " + n + " are:");
        for (int i = 2; i <= n; i++) {
            while (n % i == 0) {
                System.out.print(i + " ");
                n /= i;
            }
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
Prime factors of 12 are:
2 2 3
```

# Example Run 2
Quest:
```
Enter a number: 28
```
Output:
```
Prime factors of 28 are:
2 2 7
```

# Example Run 3
Quest:
```
Enter a number: 17
```
Output:
```
Prime factors of 17 are:
17
```
