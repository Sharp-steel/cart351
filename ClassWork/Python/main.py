#!/usr/bin/python3
class_professors = {
    'CART_253_A' : 'Pippin Barr',
    'CART_211' : 'Brad Todd',
    'CART_214' : 'Joanna Berzowska',
    'CART_215' : 'Jonathan Lessard'
}

print(type(class_professors))

dict_2 = {}
print(type(dict_2))
# print(class_professors['CART_215'])
cart_key = 'CART_215'
print(class_professors[cart_key])
print(class_professors.keys())

for key in class_professors.keys():
    print(key)
    print(class_professors[key])

print(class_professors.values())
print(class_professors.items())

print('CART_253_A' in class_professors) #-------- Return True or False ----------#

