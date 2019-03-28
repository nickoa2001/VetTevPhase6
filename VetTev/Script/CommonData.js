﻿//USEUNIT CommonFiles
/**
  * Parses the test data XML file matching the test case id defined and updates the businessDictionary (global dictionary containing several type of dictionaries).
  * @param testStepId           - string  testStep Id value of the XML test case file
  * @param businessDictionary   - dictionary object  business dictionary name
  * The dictionary type is retrieved by reading the dictionary attribute of the specified test step.
  */
function Data_UpdateDictionaryFromXML(businessDictionary, testCaseName, testStepId)
{
  var dictionaryType = Data_GetDictionaryAttributeFromXML(testCaseName, testStepId);
  var dictionaryFromXML;
  var keysArray, referenceDictionary;

  var xpathExp =  "//TestCase/TestStep[@id='" + testStepId + "']/Dictionary[@id='" + dictionaryType + "']/*";

  dictionaryFromXML = CommonFiles.File_ParseXMLFileWithXpath(Project.Path + "\Script\\"+ testCaseName + ".xml", xpathExp);
  keysArray = dictionaryFromXML.Keys().toArray();
  referenceDictionary = businessDictionary.Item(dictionaryType);
  for (var i = 0; i < keysArray.length ; i++)
  {
    referenceDictionary.$set("Item", keysArray[i], dictionaryFromXML.Item(keysArray[i]));
  }
  return referenceDictionary;
}

/**
  * Private function - Returns the dictionary attribute value of a the specified testStepId node in the test case XML file
  * Logs an error if the dictionary attribute doesn't exist in the business global dictionary.
  */
function Data_GetDictionaryAttributeFromXML(testCaseName, testStepId)
{
  var attribute;
  var xpathExp =  "//TestCase/TestStep[@id='" + testStepId + "']/Dictionary";

  attribute = File_GetNodeAttributeFromXML(Project.Path + "\Script\\"+ testCaseName + ".xml" , xpathExp, "id");
  return attribute;  
}