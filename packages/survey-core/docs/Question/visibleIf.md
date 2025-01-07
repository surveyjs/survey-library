### The list of operators

| Operators         | Description                                                                                        | Examples                                                                    |
| ----------------- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| empty             | returns true if the left operand is empty                                                         | `{questionName} empty`                                                      |
| notempty          | returns true if the left operand is not empty                                                     | `{questionName} notempty`                                                   |
| = == equal        | returns true if two values are equal                                                              | `{questionName} = 5, {questionName} == 'abc', {questionName} equal 124`     |
| <> != notequal    | returns true if two values are not equal                                                          | `{questionName} <> 5, {questionName} != 'abc', {questionName} notequal 124` |
| > greater         | returns true if the left operand greater than the second operand                                  | `{questionName} > 2, {questionName} greater 'a'`                            |
| < less            | returns true if the left operand less than the second operand                                     | `{questionName} < 2, {questionName} less 'a'`                               |
| >= greaterorequal | returns true if the left operand equal or greater than the second operand                         | `{questionName} >= 2, {questionName} greaterorequal 'a'`                    |
| <= lessorequal    | returns true if the left operand equal or less than the second operand                            | `{questionName} <= 2, {questionName} lessorequal 'a'`                       |
| contains          | return true if the left operand is an array and it contains a value of the second operand         | `{questionName} contains 'a'`                                               |
| notcontains       | return true if the left operand is an array and it does not contain a value of the second operand | `{questionName} notcontains 'a'`                                            |
| ! not             | change the result of a condition to the opposite                                                   | `!({isLoayl} == 'yes')`                                                     |

### Logical operator

---

You may use 'or' or '||' or '|' as a logical 'or' operator. The expression returns true if any of two sides return true:
`{questionName1} < 2 || {questionName2} == 'abc'`

---

You may use 'and' or '&&' or '&' as a logical 'and' operator. The expression returns true if every of two sides return true:
`{questionName1} < 2 and {questionName2} == 'abc'`

---

You may use brackets to build a complex expression:
`{questionName1} < 2 || ({questionName2} == 'abc' and {questionName1} < 5)`

---

You may use arithmetic operation as: +, -, _ or / :
`({price} _ {quantity} > 1000)`

---

