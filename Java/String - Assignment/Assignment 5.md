# Assignment 05 – removeDuplicatesandSpaces

## 📝 Problem Statement

**Method Description:**

`removeDuplicatesandSpaces(String str)`

Remove all the duplicate characters and white spaces from the string passed to the method and return the modified string.

Test the functionality using the `main()` method of the `Tester` class.

---

## 🖼️ Sample Input and Output

<img width="441" height="124" alt="pfwjop159" src="https://github.com/user-attachments/assets/7df9b8df-9a19-4b73-a33d-b4b68208f503" />

---

## 💡 How It Works

Loop through each character of the string. Add it to the result **only if**:
- It is **not a space**
- It has **not appeared earlier** in the string

---

## ✅ Solution – `Tester.java`

```java
class Tester {

    public static String removeDuplicatesandSpaces(String str) {
        String result = "";

        for (int i = 0; i < str.length(); i++) {
            char current = str.charAt(i);

            if (current != ' ' && result.indexOf(current) == -1) {
                result += current;
            }
        }

        return result;
    }

    public static void main(String args[]) {
        String str = "object oriented programming";
        System.out.println(removeDuplicatesandSpaces(str));  // Output: objectrindpamag
    }
}
