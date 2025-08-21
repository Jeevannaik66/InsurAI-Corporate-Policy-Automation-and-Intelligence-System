# Question
Write a Java program that reads a number from the user and calculates the sum of its digits.

# Code
```java
import java.util.Scanner;
public class SumOfDigits {
    public static void main(String[] args) {
        Scanner sc=new Scanner(System.in);
        System.out.print("Enter a number: ");
        int n=sc.nextInt();
        int sum=0;
        while(n>0){
            sum+=n%10;
            n/=10;
        }
        System.out.println("Sum of digits = "+sum);
        sc.close();
    }
}
```

# Example Run 1
Quest:
```
Enter a number: 123
```
Output:
```
Sum of digits = 6
```

# Example Run 2
Quest:
```
Enter a number: 987
```
Output:
```
Sum of digits = 24
```

# Example Run 3
Quest:
```
Enter a number: 1005
```
Output:
```
Sum of digits = 6
```
