# Question
Write a Java program that reads two numbers from the user (start and end of a range) and calculates the sum of all natural numbers in that range.

# Code
```java
import java.util.Scanner;
public class SumInRange {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter the starting number: ");
        int start = sc.nextInt();
        System.out.print("Enter the ending number: ");
        int end = sc.nextInt();
        int sum = 0;
        for (int i = start; i <= end; i++) {
            sum += i;
        }
        System.out.println("The sum of numbers from " + start + " to " + end + " is: " + sum);
        sc.close();
    }
}
```

# Example Run 1
Quest:
```
Enter the starting number: 1
Enter the ending number: 5
```
Output:
```
The sum of numbers from 1 to 5 is: 15
```

# Example Run 2
Quest:
```
Enter the starting number: 3
Enter the ending number: 7
```
Output:
```
The sum of numbers from 3 to 7 is: 25
```

# Example Run 3
Quest:
```
Enter the starting number: 10
Enter the ending number: 15
```
Output:
```
The sum of numbers from 10 to 15 is: 75
```
