# Question
Write a Java program that reads a lower and upper bound from the user and prints all Armstrong numbers within that range.

# Code
```java
import java.util.Scanner;
public class ArmstrongRange {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter lower bound: ");
        int low = sc.nextInt();
        System.out.print("Enter upper bound: ");
        int high = sc.nextInt();
        System.out.println("Armstrong numbers between " + low + " and " + high + ":");
        for (int num = low; num <= high; num++) {
            int digits = countDigits(num);
            int sum = 0, temp = num;
            while (temp > 0) {
                int digit = temp % 10;
                sum += Math.pow(digit, digits);
                temp /= 10;
            }
            if (sum == num) {
                System.out.println(num);
            }
        }
        sc.close();
    }
    static int countDigits(int n) {
        int count = 0;
        while (n > 0) {
            count++;
            n /= 10;
        }
        return count;
    }
}
```

# Example Run 1
Quest:
```
Enter lower bound: 1
Enter upper bound: 200
```
Output:
```
Armstrong numbers between 1 and 200:
1
2
3
4
5
6
7
8
9
153
```

# Example Run 2
Quest:
```
Enter lower bound: 100
Enter upper bound: 500
```
Output:
```
Armstrong numbers between 100 and 500:
153
370
371
407
```

# Example Run 3
Quest:
```
Enter lower bound: 1
Enter upper bound: 1000
```
