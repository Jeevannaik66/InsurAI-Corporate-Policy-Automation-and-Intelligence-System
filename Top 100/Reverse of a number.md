# Question
Write a Java program that reads a number from the user and prints its reverse.

# Code
```java
import java.util.Scanner;
public class ReverseNumber {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter a number: ");
        int n = sc.nextInt();
        int rev = 0;
        while (n > 0) {
            rev = rev * 10 + n % 10;
            n /= 10;
        }
        System.out.println("The reverse of the number is: " + rev);
        sc.close();
    }
}
```

# Example Run 1
Quest:
```
Enter a number: 1234
```
Output:
```
The reverse of the number is: 4321
```

# Example Run 2
Quest:
```
Enter a number: 1005
```
Output:
```
The reverse of the number is: 5001
```

# Example Run 3
Quest:
```
Enter a number: 7
```
Output:
```
The reverse of the number is: 7
```
