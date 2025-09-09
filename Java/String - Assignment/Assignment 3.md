# Assignment 03 – reverseEachWord

## 📝 Problem Statement

**Method Description:**

`reverseEachWord(String str)`

Reverse each word in the string passed to the method **without changing the order of the words**, and return the modified string.

> 🔸 *Note:* There should not be any extra blank/white space(s) in the output string.

Test the functionality using the `main()` method of the `Tester` class.

---

## ✅ Sample Input and Output

<img width="437" height="119" alt="stringext5" src="https://github.com/user-attachments/assets/f004c4dc-a9d7-44a8-8d79-9669b469a5cb" />


---

## 💡 How It Works

1. Split the input string by spaces to extract individual words.
2. Reverse each word individually using a character loop (no `StringBuilder` used).
3. Join the reversed words with a **single space** between them and return the final result.

---

## ✅ Solution – `Tester.java`

```java
class Tester {

    public static String reverseEachWord(String str) {
        String[] words = str.trim().split("\\s+");
        String reverseString = "";

        for (int i = 0; i < words.length; i++) {
            String word = words[i];
            String reversedWord = "";

            for (int j = word.length() - 1; j >= 0; j--) {
                reversedWord += word.charAt(j);
            }

            reverseString += reversedWord;

            if (i < words.length - 1) {
                reverseString += " ";
            }
        }

        return reverseString;
    }

    public static void main(String args[]) {
        String str = "all cows eat grass";
        System.out.println(reverseEachWord(str));  // Output: lla swoc tae ssarg
    }
}

