//USEUNIT CommonDictionary
//USEUNIT CommonData

//global customer dictionary containing all the dictionaries
var animalDictionary = CommonDictionary.Dictionary_CreateDictionary();

//dictionaries containing all the data used in the customer screen
var animalDataDictionary = CommonDictionary.Dictionary_CreateDictionary();

CommonDictionary.Dictionary_AddDictionaryToDictionary(animalDictionary, "Animal", animalDataDictionary);


function AnimalsData_CreateAnimalDictionary()
{
  //Addition of trade data to the dictionary
  CommonDictionary.Dictionary_EmptyDictionary(animalDataDictionary);
  CommonDictionary.Dictionary_AddElementToDictionary(animalDataDictionary, "OwnerName");
  CommonDictionary.Dictionary_AddElementToDictionary(animalDataDictionary, "AnimalName");
  CommonDictionary.Dictionary_AddElementToDictionary(animalDataDictionary, "Breed");
  CommonDictionary.Dictionary_AddElementToDictionary(animalDataDictionary, "Gender");
  CommonDictionary.Dictionary_AddElementToDictionary(animalDataDictionary, "BirthDate");
  CommonDictionary.Dictionary_AddElementToDictionary(animalDataDictionary, "DeathDate");
  CommonDictionary.Dictionary_AddElementToDictionary(animalDataDictionary, "Sterilized");
  CommonDictionary.Dictionary_AddElementToDictionary(animalDataDictionary, "Note");
}

function AnimalsData_UpdateDictionaryFromXML(testCaseName, testStepId)
{
  AnimalsData_CreateAnimalDictionary();
  //CommonData.Data_GetDictionaryAttributeFromXML(testCaseName, testStepId)
  CommonData.Data_UpdateDictionaryFromXML(animalDictionary, testCaseName, testStepId);
}

function AnimalsData_GetParameter(parameter)
{
  return animalDataDictionary.Item(parameter);
}