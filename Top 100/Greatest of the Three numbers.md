# Question
Write a Java program that reads three numbers from the user and prints the greatest of the three numbers.

# Code
```java
import java.util.Scanner;
public class GreatestOfThree {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter the first number: ");
        int a = sc.nextInt();
        System.out.print("Enter the second number: ");
        int b = sc.nextInt();
        System.out.print("Enter the third number: ");
        int c = sc.nextInt();
        if (a >= b && a >= c) {
            System.out.println("The greatest number is: " + a);
        } else if (b >= a && b >= c) {
            System.out.println("The greatest number is: " + b);
        } else {
            System.out.println("The greatest number is: " + c);
        }
        sc.close();
    }
}
```

# Example Run 1
Quest:
```
Enter the first number: 10
Enter the second number: 25
Enter the third number: 15
```
Output:
```
The greatest number is: 25
```

# Example Run 2
Quest:
```
Enter the first number: 50
Enter the second number: 20
Enter the third number: 50
```
Output:
```
The greatest number is: 50
```

# Example Run 3
Quest:
```
Enter the first number: 30
Enter the second number: 30
Enter the third number: 30
```
Output:
```
The greatest number is: 30
```
