# Assignment 01 – moveSpecialCharacters

## 📝 Problem Statement (Text)

**Method Description:**

`moveSpecialCharacters(String str)`

Move all the special characters present in the string passed to the method to the end of the string and return the modified string.

> 🔸 *Note:* Assume that the input string does not have any space.

Test the functionalities using the `main()` method of the `Tester` class.

---

## 🖼️ Problem Statement (Image Format)

<img width="437" height="119" alt="image" src="https://github.com/user-attachments/assets/29f302c5-aaa3-4c6b-aa85-7dfc1530a095" />

---

## ✅ Sample Input and Output

**Input:**  
`He@#$llo!*&`

**Output:**  
`Hello@#$!*&`

---

## 💡 How It Works

The method loops through each character in the string. If the character is a letter or digit, it is added to one part; if it's a special character, it goes to another. Finally, both parts are combined — placing all letters/digits first, followed by special characters.

---

## ✅ Solution – `Tester.java`

```java
class Tester {
    public static String moveSpecialCharacters(String str) {
        String letters = "";
        String specials = "";

        for (int i = 0; i < str.length(); i++) {
            char ch = str.charAt(i);
            if (Character.isLetterOrDigit(ch)) {
                letters += ch;
            } else {
                specials += ch;
            }
        }

        return letters + specials;
    }

    public static void main(String args[]) {
        String str = "He@#$llo!*&";
        String result = moveSpecialCharacters(str);
        System.out.println("Output: " + result);  // Output: Hello@#$!*&
    }
}

