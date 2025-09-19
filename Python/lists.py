#!/usr/bin/python3
# fruit = ["apples", "bananas", "oranges"] # Simple list of strings
# mixed = [1,3,5, "string", True, ["a", "b", "c"]] # List of mixed types

# for item in fruit:
#     print(item)

# testString = "test one two three"
# for element in testString:
#     print(element)

# newItems = [] # Empty list
# newItems.append("hello")
# for i in range(2,10):
#     newItems.append(i)
# print(newItems)

# print(newItems[0])

# print(len(newItems))
# length = len(newItems)
# print(newItems[length-1])

# newItems.insert(2,"new item at position 2")
# print(newItems)
# anotherList = ["a", "b", "c"]

#--------- EXTENDING A LIST WITH ANOTHER LIST ----------
# newItems+=anotherList
# newItems.extend(anotherList)
# print(newItems)

# thirdList = newItems+newItems+anotherList
# print(thirdList)
# print(thirdList.index("a"))
# thirdList.remove("a")
# print(thirdList)
# thirdList.pop(0)
# print(thirdList)
# thirdList.pop()
# print(thirdList)
# joinOn = "*"
# newStringList = ["apples","oranges","pears"]
# Convert from list to string
# listAsString = joinOn.join(newStringList) # Doesn't work with numbers
# print(listAsString)
# Convert from string to list
# newSplitList = listAsString.split("p")
# print(newSplitList)

aList = [1, 2, 3, 4, 5, "a", "b", "c"]
print(aList[1:4])
print(aList[:]) #entire list
print(aList[::]) #entire list
print(aList[2:]) #3rd item to end
print(aList[:4]) #beginning to 4th item
print(aList[1:8:2]) #every second item between position 1 & 8

print(aList[-1])