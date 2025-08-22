# Question
Write a Java program that reads a number from the user and checks whether it is an Automorphic number or not.  
(An Automorphic number is a number whose square ends with the number itself, e.g., 25 → 25² = 625)

# Code
```java
import java.util.Scanner;
public class AutomorphicNumber {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter a number: ");
        int n = sc.nextInt();
        int square = n * n;
        int temp = n;
        boolean automorphic = true;
        while (temp > 0) {
            if (temp % 10 != square % 10) {
                automorphic = false;
                break;
            }
            temp /= 10;
            square /= 10;
        }
        if (automorphic) {
            System.out.println(n + " is an Automorphic number");
        } else {
            System.out.println(n + " is not an Automorphic number");
        }
        sc.close();
    }
}
```

# Example Run 1
Quest:
```
Enter a number: 5
```
Output:
```
5 is an Automorphic number
```

# Example Run 2
Quest:
```
Enter a number: 6
```
Output:
```
6 is an Automorphic number
```

# Example Run 3
Quest:
```
Enter a number: 7
```
Output:
```
7 is not an Automorphic number
```
