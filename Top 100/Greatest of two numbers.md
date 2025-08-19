# Question
Write a Java program that reads two numbers from the user and prints the greatest of the two numbers.

# Code
```java
import java.util.Scanner;
public class GreatestOfTwo {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter the first number: ");
        int a = sc.nextInt();
        System.out.print("Enter the second number: ");
        int b = sc.nextInt();
        if (a > b) {
            System.out.println("The greatest number is: " + a);
        } else if (b > a) {
            System.out.println("The greatest number is: " + b);
        } else {
            System.out.println("Both numbers are equal");
        }
        sc.close();
    }
}
```

# Example Run 1
Quest:
```
Enter the first number: 10
Enter the second number: 20
```
Output:
```
The greatest number is: 20
```

# Example Run 2
Quest:
```
Enter the first number: 50
Enter the second number: 25
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
```
Output:
```
Both numbers are equal
```
