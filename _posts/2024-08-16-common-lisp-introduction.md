---
layout: post
title:	"a first look at common lisp"
date:	2024-08-16 12:32:35
comments: true
categories:
    - programming
tags:
    - common-lisp
---

I have no idea how to program in Common Lisp, so I decided to learn for a number of reasons, the main of which being the potential to expand my methodology in respect to writing effective computer programs. *And let me just say, this has not been an easy process.*

I started with the basics: looking up simple youtube videos and StackOverFlow threads on what the most efficient means of learning Lisp would be. Simple enough, right? WRONG! I couldn't figure out how to get the Steel Bank Common Lisp compiler to work correctly (alongside additional tools like QuickLisp), and after slightly more than an hour of attempting to fix my installation and wrap my head around how SBCL actually works, I eventually just gave up and installed GNU CLISP, which, FYI, worked like a complete charm.

From there, I just did the standard "Hello, World!" program.

{% highlight common_lisp %}
(format t "Hello, World!")
{% endhighlight %}

And it seemed simple enough, but my peril with the language would only go downhill from this point onwards, as simply playing around with the absolute core basics without attempting to do any hacking would do me absolutely no good. Therefore, I immediately opted to try learning to write in Lisp via solving the easiest possible problem out of a year of [Advent of Code](adventofcode.com).

## Hacking Advent of Code in Lisp

### Part 1: Planning 

I started by picking the [Day 1 problem from last year](https://adventofcode.com/2023/day/1), a problem that I've solved in as little as four lines in Java, so I was certain that there was no way it could be too overly complicated in Lisp. I was terribly, terribly wrong.

I first had to begin by deciding on the structure of my program, and I opted to go for the kind of strictly-scoped layout that I tend to use for languages like Python or Javascript that allow for code to be run outside of functions in the global scope, which looks somewhat like the following:

{% highlight plaintext %}
function SOLVE-PROBLEM()
  include all core functionality of solving the problem here
end function

function RUN-TESTS()
  include all functionality for running tests of individual functions here
end function

read argument
if argument is TEST-MODE:
  call RUN-TESTS()
else
  call SOLVE-PROBLEM()
{% endhighlight %}

*Note that if this were a language that didn't allow code at the global scope, such as C or Java, then I would simply make all of the root code from `read argument` downward my `main` method/function.*

I wasn't exactly certain how I would begin going about trying to solve this problem in Lisp, so I thought first about how I would try solving this problem in a language like C.

{% highlight plaintext %}
function CONVERT-LINE-TO-NUMBER(line-string)
  first-number and second-number := 0

  loop through the string
    if current-position is a number
      convert current-position to integer
      if first-number := 0
        first-number := current-position
      second-number := current-position

  return first-number * 10 + second-number
end function

function SOLVE-PROBLEM()
  counter := 0

  open input file
  loop through each line of the input file
    file-number-value := CONVERT-LINE-TO-NUMBER( line-string )
    add/append file-number-value to counter

  print counter
end function
{% endhighlight %}

### Part 2: Failure

From there, I started on the main function of my Lisp program:

{% highlight common_lisp %}
; This function serves as the key solving algorithm to the
; problem.
(defun solve () (progn
  ; This is our input file
  (defparameter *input_file* "./test.txt")

  ; This will be our final counter
  (setq total 0)

  ; Loop through lines in file/process input 
  (let ((file (open *input_file*)))
  (when file
    (loop for line = (read-line file nil)
      while line
      ; Generate the line number
      do (let ((generated_number (strip_line_to_number line))) 
        (progn
          ; Set the value of the total to itself plus 
          ; the generated number
          (setq total (+ total generated_number))
          ; Print the original line and the generated number
          (format t "~A -> ~d~%" line generated_number)))))
  (close file))

  ; Print final number
  (format t "Total: ~d~%" total)))
{% endhighlight %}

At this point, I looked like I was steadily on track to solving the problem effecitvely, correct? Wrong. I kept running into prolems when attempting to develop the `strip_line_to_number` function by unnecessarily overcomplicating the program.

{% highlight common_lisp %}
; Converts a string into the number value that
; the string is worth
;
; Example: "pqr3stu8vwx" -> 38
(defun strip_line_to_number (line)
  (let ((first_last_number (get_first_last_number line)))
    ; Parse the resulting integer
    (parse-integer 
      ; Concatenate the first and last characters
      (concatenate 'string 
        ; First character of the line
        (nth 0 first_last_number)
        ; Second character of the line
        (nth 1 first_last_number)))))
{% endhighlight %}

The reason why this function layout sucks so badly is that unlike the intended imperative solution, this functional solution has to obtain the first and last characters separately as strings and then concatenate them before parsing them to a string rather than converting each character to an integer immediately then doing a simple math operation to make the final number, and the reason why this is so counterproductive can be seen in the next set of functions:

{% highlight common_lisp %}
; Removes all non-numerical characters from a
; string. Returns the remaining string.
;
; Example: "treb7uchet" -> "7"
;          "1abc2"      -> "12"
(defun remove_non_numeric (str) 
  (let ((numeric-chars (remove-if-not #'digit-char-p str))) 
    (coerce numeric-chars 'string)))

; Returns the first and last characters of a
; string as a list.
;
; Example: "treb7uchet" -> [ "t", "t" ]
;          "1abc2"      -> [ "1", "2" ]
(defun first_and_last_characters (str) 
  (if (or (null str) (zerop (length str)) nil 
    (values (char str 0) (char str 1- (length str))))))

; Returns a list containing the first and last
; numbers of a line in a string representation
;
; Example: "treb7uchet" -> ["7", "7"]
;          "1abc2"      -> ["1", "2"]
(defun get_first_last_number (str) 
  (first_and_last_characters (remove_non_numeric str)))
{% endhighlight %}

This function chooses to first manually remove all non-numeric characters from the string (which is already one \\(O(n)\\) loop right there), before obtaining the first and last characters of the new integer-only string as a list trhoguh indexing, and this method sucks because edge cases where there is only one number in the string have to have additional code written to manually copy the value to both our `first-number` and `second-number` variables.

View the final source code [here](https://gist.github.com/nickelulz/af897ea7624dc5dbf502885b30280d3d).

### Part 3: Success (kind of), and What I Learned About Lisp In The Process 

It's been a few weeks since I first started writing this post, and I'll level with you: there really hasn't been much success. At least, strictly speaking, there hasn't been much success in solving this specific Advent of Code problem thus far, but in all honesty, I'm beginning to love Common Lisp, and I have a few reasons why.

First and foremost, I'm starting to love the switch in human-computer interaction between imperative programming and functional/declarative programming. Fundamentally, the main difference between imperative programming and functional programming is the switch between essentially describing the exact processes the computer must undergo to solve a problem (which opens up issues of side effects due to the programmer having to constantly consider changes in states of varying scopes) and alternatively, describing the problem itself and then letting the computer do the rest automatically. When computer programs are restricted to have no mutable global states with little to no typing, the programs being written reflect something closer to natural human language while drastically reducing the amount of time spent debugging a program by reducing the amount of nuance the program holds in managing memory at any given step in the compilation process. Such issues rarely, if ever, occur with functional/declarative expression.

For one example, recently, I've had to get back into using Python for scientific computing for my introductory Physics course at UBC, and in the process of the familiarizing the class to Python, our Physics teaching team held an optional drop-in tutorial on basic algorithmic thinking in Python, with one particular challenge being the second question of ProjectEuler, calculating the sum of all of the even fibonnaci numbers under 4 million in value.

Given such a problem, the standard C solution would be the following:

{% highlight c %}
#include <stdio.h>
#include <stdint.h>

int main()
{
    uint64_t current = 2, previous 1;
    uint64_t next = current + previous;
    uint64_t sum = next;
    while (current < 4000000L) {
        previous = current;
        current = next;
        next = previous + current;
        if (next % 2 == 0)
            sum += next;
    }
    printf("%lld\n", sum);
}
{% endhighlight %}

Now, of course, this could easily be optimized. Assuming we can calculate the number of fibonacci numbers that we will encounter before reaching an even number greater than 4 million (at least, for C, where there are no dynamic arrays), we could generate a lookup table associating the fibonacci number to its index.

{% highlight C %}
#include <stdio.h>
#include <stdint.h>

/*
 * We could write additional code to verify
 * what value this actually should be, but
 * this situation only applies in cases
 * where we do not have dynamic arrays.
 */
#define FIB_COUNT_BELOW_FOUR_MIL = 10000

int main()
{
    uint64_t fibonacci_numbers[FIB_COUNT_BELOW_FOUR_MIL];

    fibonacci_numbers[0] = 1;
    fibonacci_numbers[1] = 2;
    uint16_t index = 2;
    uint64_t sum = 0;

    while (fibonacci_numbers[index-1] < 4000000) {
        fibonacci_numbers[index] = fibonacci_numbers[index-1] + fibonacci_numbers[index-2]; 
        if (fibonacci_numbers[index-1] % 2 == 0)
            sum += fibonacci_numbers[index-1];
    }

    printf("%lld\n", sum);
}
{% endhighlight %}

Now this method of writing the function doesn't have much outward time optimization, but certainly makes the program a bit more readable. However, we can do much better than this.

{% highlight C %}
#include <stdio.h>
#include <stdint.h>

/*
 * We could write additional code to verify
 * what value this actually should be, but
 * this situation only applies in cases
 * where we do not have dynamic arrays.
 */
#define FIB_COUNT_BELOW_FOUR_MIL = 10000

uint64_t fibonacci_numbers[FIB_COUNT_BELOW_FOUR_MIL];

uint64_t fib(uint16_t index)
{
    if (index == 0)
        return 1;
    if (index == 1)
        return 2;

    /*
     * Here, our fibonacci numbers array serves
     * as a sort of caching system
     */
    if (fibonacci_numbers[index] == 0)
        fibonacci_numbers[index] = fib(index-1) + fib(index-2);
    
    return fibonacci_numbers[index];
}

int main()
{    
    fibonacci_numbers[0] = 1;
    fibonacci_numbers[1] = 2;

    uint16_t index = 0;
    uint64_t current = 0, sum = 0;

    while (current < 4000000) {
        current = fib(index);
        if (current % 2 == 0)
            sum += current;
        index++;
    }

    printf("%lld\n", sum);
}
{% endhighlight %}

Then, translated to python, the answer would look something like this:

{% highlight python %}
fib_table = []

def fib(n):
    if n == 0:
        return 1
    if n == 1:
        return 2
    if fib_table[n] == 0:
        fib_table[n] = fib_table[n-1] + fib_table[n-2]
    return fib_table[n]

index = 0
sum = 0
current = fib(index)

while current < 4000000:
    if current % 2 == 0:
        sum += current
    index += 1
    current = fib(index)

print(sum)
{% endhighlight %}

### update: july 24, 2025

This is a bad post. Sort of. It was really my first venture into Common Lisp, and you can seriously tell how inexperienced I was when I was writing it. I had horribly incorrect conventions, like using snake case (ew) or putting permanent comments with only one semicolon. A lot of the information at the very top was good, and I still agree with that, but there is a lot I'd like to change.

First of all, I actually did go back and solve the Advent of Code problem from before. Here is my solution in Lisp:
{% highlight lisp %}
(ql:quickload :str)
(ql:quickload :cl-ppcre)

(defun replace-nums (line)
    (let ((replacement-dict
            '((:one   . 1) (:two   . 2) (:three . 3)
              (:four  . 4) (:five  . 5) (:six   . 6)
              (:seven . 7) (:eight . 8) (:nine  . 9))))
      (labels ((anycase (s)
                 (concatenate 'string (string-upcase s) "|" (string-downcase s)))
               (digit-replace (str pair)
                 (cl-ppcre:regex-replace-all
                  (anycase (symbol-name (car pair))) str (write-to-string (cdr pair)))))
        (reduce #'digit-replace replacement-dict :initial-value line))))

(progn
  (format t "~%~%")
  (let ((total 0))
    (progn
      (with-open-file (stream "input.txt" :direction :input)
        (do ((line (read-line stream nil 'eof)
                   (read-line stream nil 'eof)))
            ((eql line 'eof))
          (let* ((replaced-nums (replace-nums line))
                 (letters-removed (cl-ppcre:regex-replace-all "[a-zA-Z]" replaced-nums ""))
                 (n (length letters-removed))
                 (edges-only (concatenate
                              'string
                              (subseq letters-removed 0 1)
                              (subseq letters-removed (1- n) n)))
                 (final-score (parse-integer edges-only)))
            (format t "~A -> ~A -> ~A -> ~A~%" line replaced-nums letters-removed edges-only)
            (setq total (+ total final-score)))))
      (format t "Final Score: ~D~%" total))))
{% endhighlight %}

Well.. almost, anyway. It's not really complete. It works for day one, but it doesn't replace the words in the correct order for day 2 (which I would still need to do, but I'm too lazy to do it).

Anyway, a lot of things have changed since I wrote this post. I took a proper university course on Racket (*How to Design Programs*), a child language of Lisp, and did fairly well. I didn't actually like the course all that much, though. I think that course deserves its own post to explain my thoughts on it, as I hold somewhat complicated opinions about it, but I felt that they pushed extremely restrictive and almost draconian codewriting practices that largely don't have a bearing on even writing the lisp I've written afterward, and as a result, a lot of the course is spent focusing on things that largely don't matter, making the course kind of counterproductive. The grading scheme was really bad, focusing on certain issues that hardly even matter and ignoring potential problems that really do. 

Of course, again, I know this is an extremely vague description, but going any further would require a full breakdown on my thoughts about *How to Design Programs*. What I would have preferred as my introduction to Lisp over a programming structure/design class like HtDP or Sussman's *Structure and Interpretation of Computer Programs* would have been a proper language class centered purely around using the language as it is rather than software design principles, like using Paul Graham's *ANSI Common Lisp* (which I have found incredibly useful as a resource the past couple of months). 
