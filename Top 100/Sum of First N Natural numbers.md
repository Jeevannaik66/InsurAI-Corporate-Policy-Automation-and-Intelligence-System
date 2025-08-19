# Question
Write a Java program that reads a number **N** from the user and calculates the **sum of the first N natural numbers**.  
Formula: `sum = N * (N + 1) / 2`

# Code
```java
import java.util.Scanner;

public class SumOfNaturalNumbers {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter a number (N): ");
        int n = sc.nextInt();

        int sum = n * (n + 1) / 2;  // Formula-based approach

        System.out.println("The sum of first " + n + " natural numbers is: " + sum);
        sc.close();
    }
}
```

# Example Run 1
```
Enter a number (N): 5
The sum of first 5 natural numbers is: 15
```

# Example Run 2
```
Enter a number (N): 10
The sum of first 10 natural numbers is: 55
```

# Example Run 3
```
Enter a number (N): 1
The sum of first 1 natural numbers is: 1
```
