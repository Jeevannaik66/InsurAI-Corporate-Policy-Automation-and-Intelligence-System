# Question
Write a Java program that reads a number from the user and checks whether it is a Strong number or not.  
(A Strong number is a number whose sum of the factorials of its digits is equal to the number itself, e.g., 145 = 1! + 4! + 5!)

# Code
```java
import java.util.Scanner;
public class StrongNumber {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter a number: ");
        int n = sc.nextInt();
        int original = n, sum = 0;
        while (n > 0) {
            int digit = n % 10;
            int fact = 1;
            for (int i = 1; i <= digit; i++) {
                fact *= i;
            }
            sum += fact;
            n /= 10;
        }
        if (sum == original) {
            System.out.println(original + " is a Strong number");
        } else {
            System.out.println(original + " is not a Strong number");
        }
        sc.close();
    }
}
```

# Example Run 1
Quest:
```
Enter a number: 145
```
Output:
```
145 is a Strong number
```

# Example Run 2
Quest:
```
Enter a number: 123
```
Output:
```
123 is not a Strong number
```

# Example Run 3
Quest:
```
Enter a number: 1
```
Output:
```
1 is a Strong number
```
