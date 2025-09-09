# Assignment 02 – checkPalindrome

## 📝 Problem Statement

**Method Description:**

`checkPalindrome(String str)`

Check whether the string passed to the method is a palindrome or not.

- Return `true` if the string is a palindrome
- Return `false` otherwise

Test the functionality using the `main()` method of the `Tester` class.

---

## ✅ Sample Input and Output

<img width="417" height="118" alt="stringext2" src="https://github.com/user-attachments/assets/1f895b66-8823-4ee7-87c3-f1299008f03a" />


---

## 💡 How It Works

The method compares the original string to its reverse. If both are equal, the string is a palindrome (reads the same forwards and backwards).

---

## ✅ Solution – `Tester.java`

```java
class Tester{
    public static boolean checkPalindrome(String str){
	    int left =0;
	    int right =str.length()-1;
	    
	    while(left<right){
	        if(str.charAt(left)!= str.charAt(right)){
	            return false;
	        }
	        left ++;
	        right --;
	    }
        return true;
	}
	
	public static void main(String args[]){
		String str = "radar";
		if(checkPalindrome(str))
			System.out.println("The string is a palindrome!");
		else
			System.out.println("The string is not a palindrome!");
	}
}
