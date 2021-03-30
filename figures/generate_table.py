import os
import requests
import webbrowser
import numpy as np
import plotly.graph_objects as plt

print ("Generating table...")


# Get name of tests
testFile = open("../src/test/suite/extension.test.ts")
contents = testFile.readlines()

testNames = []
# Find testNames from unit test file
for line in contents:
    if line.find("testNames") != -1:
        start = line.index("testNames")

# Get the entire definition of testNames
for i in range(start, len(contents)):
    testNames.append(contents[i])
    if contents[i].find(";") != -1:
        break

# Remove excess characters from testNames
for i in range(len(testNames)):
    # Remove the typescript definition
    if testNames[i].find("const testNames = [") != -1:
        testNames[i] = testNames[i].replace("const testNames = [", "")
    if testNames[i].find("];") != -1:
        testNames[i] = testNames[i].replace("];", "")
    
    # Remove other characters
    testNames[i] = testNames[i].replace("\n", "")
    testNames[i] = testNames[i].replace("\"", "")


# Split testNames into seperate strings
for i in range(len(testNames)):
    testNames[i] = testNames[i].split(", ")

    # Remove left over commas
    for j in range(len(testNames[i])):
        testNames[i][j] = testNames[i][j].replace(",", "")
    
# Combine lists
unitTests = []
for i in range(len(testNames)):
    unitTests += testNames[i]

# Select build method
print("1. Use the latest working build.")
print("2. Manually select a new build")
method = input("Choose a build method (1 or 2): ")

if method == "1":
    url = 'https://api.travis-ci.com/v3/job/491911244/log.txt'

elif method == "2":
    print("\n\nOpening the Travis CI page for SoundCloud for VS Code...")
    print("https://www.travis-ci.com/github/owen-hunter1/soundcloud-for-vs-code")
    webbrowser.open("https://www.travis-ci.com/github/owen-hunter1/soundcloud-for-vs-code")

    print("\nFollow the following steps to get the URL of the most recent build.")
    print("1. Under the most recent build, click on XX.1 or XX.2")
    print("2. Under the job log, click on \"Raw log\"")
    print("3. Copy this URL.")
    print("It should look something like \"https://api.travis-ci.com/v3/job/491911244/log.txt\"")
    url = input("URL: ")
else:
    print("Invalid input.")

# Download the file
r = requests.get(url)    
f = open("latestBuild.txt", "wb")
f.write(r.content)
f.close()

# Read the downloaded file
f = open("latestBuild.txt")
contents = f.readlines()

testStatus = []
# Determine which tests passed and failed.
indexOfFailingTests = 0
numOfFailing = 0
for line in contents:
    if line.find("passing") != -1:
        for i in line.split():
            if i.isdigit():
                i = int(i)
                # When the number of passes is equal to the number of tests
                if (i == len(unitTests)):
                    for l in range(i):
                        testStatus.append("Pass")


    if line.find("failing") != -1:
        # Get the number of failing tests
        indexOfFailingTests = contents.index(line)
        for i in line.split():
            if i.isdigit():
                numOfFailing = int(i)

# If there are any failing tests, note them
if numOfFailing > 0:
    for i in range(len(unitTests)):
        testStatus.append("")

    for i in range(indexOfFailingTests, len(contents)):
        if contents[i].find("Extension Test Suite") != -1:
            nameOfFailingTest = contents[i+1]
            
            nameOfFailingTest = nameOfFailingTest.replace(" ", "")
            nameOfFailingTest = nameOfFailingTest.replace(":", "")
            nameOfFailingTest = nameOfFailingTest.replace("\n", "")
            testStatus[unitTests.index(nameOfFailingTest)] = "Fail"
            
    for i in range(len(testStatus)):
        if testStatus[i] != "Fail":
            testStatus[i] = "Pass"


# Make the table
fig = plt.Figure(data=[plt.Table(
    header=dict(values=['Test Name', 'Passed or Failed'],
                line_color='darkslategray',
                fill_color='rgb(179, 205, 227)',
                align='center'),
    cells=dict(values=[unitTests, testStatus], 
               line_color='darkslategray',
               fill_color='rgb(238,238,238)',
               align='left'))
])
fig.update_layout(width=500)
fig.show()

# Clean up 
os.remove("latestBuild.txt")