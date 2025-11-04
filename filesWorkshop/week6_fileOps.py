import json

# Open rainbow.txt in reading mode
# rainbowFile = open("files/rainbow.txt", "r")
# out = rainbowFile.read(4)
# print(out)
# rainbowFile.seek(0)
# out2 = rainbowFile.read()
# print(out2)
# rainbowFile.close()

# outlines = rainbowFile.readlines()
# print(outlines)

# sampleFile = open("files/sample_text.txt", "w")
# for i in range(3):
#     a_name = input("enter animal: ")  
#     sampleFile.write(a_name)
#     sampleFile.write("\n")
# sampleFile.close()
# animalList = []
# for i in range(3):
#     a_name = input("enter animal: ")
#     animalList.append(a_name+'\n')
# sampleFile.writelines(animalList)
# sampleFile.close()


# sampleFile_a = open("files/sample_text.txt", "a")
# nameList = []
# for i in range(3):
#     name = input("type name: ")
#     nameList.append(name+'\n')

# sampleFile_a.writelines(nameList)
# sampleFile_a.close()

# Read from file and parse JSON
# jsonFile = open("files/test.json", "r")
# data = json.load(jsonFile)
# print(data)
# print(type(data)) # <class 'list'> a list

# json_str = '{"name":"Sabs", "fav_col":"red", "fav_city":"montreal"}'
# data_2 = json.loads(json_str) 
# print(data_2)
# print(type(data_2))#converts to a dict

# data_toSave = {"name":"mandy", "fav_col":"blue", "fav_city":"winnipeg"}
# #convert dictionary to str
# data_s = json.dumps(data_toSave, indent=4)
# #open or create if non existent
# fileOpen = open("files/new_sample.json","w")
# fileOpen.write(data_s)

jsonFile = open("files/new_sample.json", "r+")
data = json.load(jsonFile)
print(data['fav_city'])
print(type(data['fav_city']))
# #go to beginning of file
jsonFile.seek(0)
data['fav_city'].append("another element")
data["newKey"] = 1234
#output to the file
json.dump(data,jsonFile, indent =4)