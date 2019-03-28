﻿//USEUNIT CommonDictionary
//USEUNIT CommonData

//global customer dictionary containing all the dictionaries
var customerDictionary = CommonDictionary.Dictionary_CreateDictionary();

//dictionaries containing all the data used in the customer screen
var customerDataDictionary = CommonDictionary.Dictionary_CreateDictionary();

CommonDictionary.Dictionary_AddDictionaryToDictionary(customerDictionary, "Customer", customerDataDictionary);


function CustomersData_CreateCustomerDictionary()
{
  //Addition of trade data to the dictionary
  CommonDictionary.Dictionary_EmptyDictionary(customerDataDictionary);
  CommonDictionary.Dictionary_AddElementToDictionary(customerDataDictionary, "Name");
  CommonDictionary.Dictionary_AddElementToDictionary(customerDataDictionary, "Surname");
  CommonDictionary.Dictionary_AddElementToDictionary(customerDataDictionary, "Phone");
  CommonDictionary.Dictionary_AddElementToDictionary(customerDataDictionary, "Email");
  CommonDictionary.Dictionary_AddElementToDictionary(customerDataDictionary, "City");
  CommonDictionary.Dictionary_AddElementToDictionary(customerDataDictionary, "Street");  
}

function CustomersData_UpdateDictionaryFromXML(testCaseName, testStepId)
{
  CustomersData_CreateCustomerDictionary();
  //CommonData.Data_GetDictionaryAttributeFromXML(testCaseName, testStepId)
  CommonData.Data_UpdateDictionaryFromXML(customerDictionary, testCaseName, testStepId);
}

function CustomersData_GetParameter(parameter)
{
  return customerDataDictionary.Item(parameter);
}
