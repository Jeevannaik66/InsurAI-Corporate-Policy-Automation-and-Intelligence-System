# Question
Write a Java program that reads an integer from the user and checks whether the number is **Even** or **Odd**.

# Code
```java
import java.util.Scanner;

public class EvenOddCheck {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter a number: ");
        int num = sc.nextInt();

        if (num % 2 == 0)
            System.out.println("The number is Even");
        else
            System.out.println("The number is Odd");

        sc.close();
    }
}
```

# Example Run 1
```
Enter a number: 10
The number is Even
```

# Example Run 2
```
Enter a number: 7
The number is Odd
```

# Example Run 3
```
Enter a number: 0
The number is Even
```
