# Question
Write a Java program that reads an integer from the user and checks whether the number is **positive**, **negative**, or **zero** using conditional statements.

# Code
```java
import java.util.Scanner;

public class BruteForceCheck {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter a number: ");
        int num = sc.nextInt();
        if (num > 0)
            System.out.println("The number is positive");
        else if (num < 0)
            System.out.println("The number is negative");
        else
            System.out.println("The number is zero");
        sc.close();
    }
}
```

# Example Run 1
```
Enter a number: 5
The number is positive
```

# Example Run 2
```
Enter a number: -3
The number is negative
```

# Example Run 3
```
Enter a number: 0
The number is zero
```
