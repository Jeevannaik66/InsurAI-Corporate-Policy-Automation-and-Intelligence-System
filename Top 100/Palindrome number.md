# Question
Write a Java program that reads a number from the user and checks whether it is a palindrome or not.

# Code
```java
import java.util.Scanner;
public class PalindromeNumber {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter a number: ");
        int n = sc.nextInt();
        int original = n;
        int rev = 0;
        while (n > 0) {
            rev = rev * 10 + n % 10;
            n /= 10;
        }
        if (original == rev) {
            System.out.println(original + " is a palindrome number");
        } else {
            System.out.println(original + " is not a palindrome number");
        }
        sc.close();
    }
}
```

# Example Run 1
Quest:
```
Enter a number: 121
```
Output:
```
121 is a palindrome number
```

# Example Run 2
Quest:
```
Enter a number: 123
```
Output:
```
123 is not a palindrome number
```

# Example Run 3
Quest:
```
Enter a number: 7
```
Output:
```
7 is a palindrome number
```

