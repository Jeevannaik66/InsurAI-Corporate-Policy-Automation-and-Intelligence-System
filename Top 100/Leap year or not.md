# Question
Write a Java program that reads a year from the user and checks whether it is a leap year or not.

# Code
```java
import java.util.Scanner;
public class LeapYearCheck {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter a year: ");
        int year = sc.nextInt();
        if ((year % 400 == 0) || (year % 4 == 0 && year % 100 != 0)) {
            System.out.println(year + " is a leap year");
        } else {
            System.out.println(year + " is not a leap year");
        }
        sc.close();
    }
}
```

# Example Run 1
Quest:
```
Enter a year: 2020
```
Output:
```
2020 is a leap year
```

# Example Run 2
Quest:
```
Enter a year: 1900
```
Output:
```
1900 is not a leap year
```

# Example Run 3
Quest:
```
Enter a year: 2000
```
Output:
```
2000 is a leap year
```
