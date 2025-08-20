# Question
Write a Java program that reads a number from the user and checks whether it is an Armstrong number or not.  
(An Armstrong number is a number that is equal to the sum of the cubes of its digits, e.g., 153 = 1³ + 5³ + 3³)

# Code
```java
import java.util.Scanner;
public class ArmstrongNumber {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter a number: ");
        int n = sc.nextInt();
        int original = n;
        int sum = 0;
        while (n > 0) {
            int digit = n % 10;
            sum += digit * digit * digit;
            n /= 10;
        }
        if (original == sum) {
            System.out.println(original + " is an Armstrong number");
        } else {
            System.out.println(original + " is not an Armstrong number");
        }
        sc.close();
    }
}
```

# Example Run 1
Quest:
```
Enter a number: 153
```
Output:
```
153 is an Armstrong number
```

# Example Run 2
Quest:
```
Enter a number: 123
```
Output:
```
123 is not an Armstrong number
```

# Example Run 3
Quest:
```
Enter a number: 370
```
Output:
```
370 is an Armstrong number
```
