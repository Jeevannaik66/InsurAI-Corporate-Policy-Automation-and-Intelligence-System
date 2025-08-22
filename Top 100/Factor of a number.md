# Question
Write a Java program that reads a number from the user and prints all its factors.

# Code
```java
import java.util.Scanner;
public class FactorsOfNumber {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter a number: ");
        int n = sc.nextInt();
        System.out.println("Factors of " + n + " are:");
        for (int i = 1; i <= n; i++) {
            if (n % i == 0) {
                System.out.print(i + " ");
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
Factors of 12 are:
1 2 3 4 6 12
```

# Example Run 2
Quest:
```
Enter a number: 7
```
Output:
```
Factors of 7 are:
1 7
```

# Example Run 3
Quest:
```
Enter a number: 20
```
Output:
```
Factors of 20 are:
1 2 4 5 10 20
```
