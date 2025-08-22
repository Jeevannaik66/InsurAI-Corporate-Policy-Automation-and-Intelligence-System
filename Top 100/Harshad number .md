# Question
Write a Java program that reads a number from the user and checks whether it is a Harshad number or not.  
(A Harshad number is a number that is divisible by the sum of its digits, e.g., 18 → 1 + 8 = 9 and 18 % 9 == 0)

# Code
```java
import java.util.Scanner;
public class HarshadNumber {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter a number: ");
        int n = sc.nextInt();
        int sum = 0, temp = n;
        while (temp > 0) {
            sum += temp % 10;
            temp /= 10;
        }
        if (n % sum == 0) {
            System.out.println(n + " is a Harshad number");
        } else {
            System.out.println(n + " is not a Harshad number");
        }
        sc.close();
    }
}
```

# Example Run 1
Quest:
```
Enter a number: 18
```
Output:
```
18 is a Harshad number
```

# Example Run 2
Quest:
```
Enter a number: 19
```
Output:
```
19 is not a Harshad number
```

# Example Run 3
Quest:
```
Enter a number: 21
```
Output:
```
21 is a Harshad number
```
