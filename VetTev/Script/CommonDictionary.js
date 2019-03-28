//USEUNIT CommonReporting

/**
  * This functions returns a dictionary type object
  */
function Dictionary_CreateDictionary()
{
  return new Sys.OleObject("Scripting.Dictionary");
}

/**
  * Adds an element to the specified dictionary. The new element is initialised with the null value.
  * @param dictionaryName     - dictionary object
  * @param element            - element key value
  */
function Dictionary_AddElementToDictionary(dictionaryName, element)
{
  if (!dictionaryName.Exists(element))
    dictionaryName.Add(element,null);
  else
     CommonReporting.Log_StepError("Common dictionary(Dictionary_AddElementToDictionary): The element " + element + " already exists in the dictionary.");
}

/**
  * Removes an element to the specified dictionary.
  * @param dictionaryName     - dictionary object
  * @param element            - element key value
  */
function Dictionary_RemoveElementToDictionary(dictionaryName, element)
{
  if (dictionaryName.Exists(element))
    dictionaryName.Remove(element);
}

/**
  * Adds an element key and value to the specified dictionary. Logs an error if the key already exists.
  * @param dictionaryName     - dictionary object
  * @param element            - element key value
  * @param value              - element value
  */
function Dictionary_AddElementKeyValueToDictionary(dictionaryName, elementKey, value)
{
  if (!dictionaryName.Exists(elementKey))
    dictionaryName.Add(elementKey, value);
  else
     CommonReporting.Log_StepError("Common dictionary(Dictionary_AddElementKeyValueToDictionary): The element " + elementKey + " already exist.");
}

/**
  * Adds a couple (dictionaryType, dictionary) in a global dictionary.
  * @param globalDictionary   - global dictionary object
  * @param dictionaryType     - dictionary key element value
  * @param dictionary         - dictionary element value
  */
function Dictionary_AddDictionaryToDictionary(globalDictionary, dictionaryType, dictionary)
{
  globalDictionary.Add(dictionaryType,dictionary);
}

/**
  * Gets an element from the specified dictionary. Keyword patterns will be interpreted, for ex %TODAY(%Y%m%d)%.txt will be replaced with the current date in the format %Y%m%d (ex 20130605.txt)
  * @param dictionaryName     - dictionary object
  * @param element            - element key value
  * Logs an error if the element doesn't exist
  */
function Dictionary_GetElementFromDictionary(dictionaryName, element)
{
  var regEx, Matches;
  var keyWordValue;

  if ( dictionaryName.Exists(element))
  {
    if (typeof(dictionaryName.Item(element)) == "string")
    {
      regEx = /%(TODAY)\((%Y|%m|%d)(%Y|%m|%d)(%Y|%m|%d)\)%(.*)/;

      Matches = dictionaryName.Item(element).match(regEx);

      if (Matches != null)
      {
        switch (RegExp.$1)
        {
          case "TODAY":
            keyWordValue = aqConvert.DateTimeToFormatStr(aqDateTime.Today(), RegExp.$2+RegExp.$3+RegExp.$4);
            keyWordValue = aqString.Concat(keyWordValue, RegExp.$5)
            CommonReporting.Log_Trace("Common dictionary(Dictionary_GetElementFromDictionary): Interpreted value for <" + dictionaryName.Item(element) + "> is " + keyWordValue);
            return keyWordValue;
          default:
            CommonReporting.Log_Trace("Common dictionary(Dictionary_GetElementFromDictionary): <" + dictionaryName.Item(element) + "> wasn't interpreted ");
            return dictionaryName.Item(element);
        }
      }
      else
        return dictionaryName.Item(element);
    }
    else
        return dictionaryName.Item(element);
  }
  else
     return undefined;
}

/**
  * Returns an element key matching an element value from the specified dictionary.
  * @param dictionaryName     - dictionary object
  * @param elementValue       - value of an element in the dictionary
  * Logs an error if the element value doesn't exist
  */
function Dictionary_GetKeyFromElementValue(dictionaryName, elementValue)
{
  var keysArray = dictionaryName.Keys().toArray();

  for (var i = 0; i < keysArray.length ; i++)
  {
    if (dictionaryName.Item(keysArray[i]) == elementValue)
      return keysArray[i];
  }
  CommonReporting.Log_StepError("Dictionary_GetKeyFromElementValue: The element value " + elementValue + " was not found in the dictionary");
}

/**
  * Returns the number of items found in the specified dictionary
  * @param dictionaryName     - dictionary object
  */
function Dictionary_GetItemCount(dictionaryName)
{
  return dictionaryName.Count;
}


/**
  * Empties the specified dictionary.
  * @param dictionaryName     - dictionary object
  */
function Dictionary_EmptyDictionary(dictionaryName)
{
  dictionaryName.RemoveAll();
}

/**
  * Concatenate the specified value to the existing value separated by a ,
  * @param dictionaryName     - dictionary object
  * @param elementKey         - element key value
  * @param value              - element value
  */
function Dictionary_ConcatValueToDictionaryElement(dictionaryName, elementKey, value)
{
  Dictionary_ConcatValueToDictionaryElementWithSeparator(dictionaryName, elementKey, value, ",");
}

/**
  * Concatenate the specified value to the existing value separated by the specified separator
  * @param dictionaryName     - dictionary object
  * @param elementKey         - element key value
  * @param value              - element value
  * @param separator          - separator used in the concatenation
  */
function Dictionary_ConcatValueToDictionaryElementWithSeparator(dictionaryName, elementKey, value, separator)
{
  var existingValue;
  var newValue;

  existingValue = dictionaryName.Item(elementKey);
  if ((existingValue == "") || (existingValue == null))
    dictionaryName.$set("Item", elementKey, value);
  else
  {
    newValue = aqString.Concat(aqString.Concat(existingValue, separator),value);
    dictionaryName.$set("Item", elementKey, newValue);
  }
}

/**
  * Adds the specified value to the existing value
  * @param dictionaryName     - dictionary object
  * @param elementKey         - element key value
  * @param value              - element value
  */
function Dictionary_SumValueToDictionaryElement(dictionaryName, elementKey, value)
{
  var existingValue;
  var newValue;

  existingValue = dictionaryName.Item(elementKey);
  if ((existingValue == "") || (existingValue == null))
    dictionaryName.$set("Item", elementKey, value);
  else
  {
    newValue = aqConvert.StrToFloat(existingValue) + aqConvert.StrToFloat(value);
    dictionaryName.$set("Item", elementKey, newValue);
  }
}

/**
  * Updates an element in the specified dictionary. The element is identified with its key value.
  * @param dictionaryName     - dictionary object
  * @param elementKey         - element key value
  * @param value              - element value
  */
function Dictionary_UpdateDictionaryElementValue(dictionaryName, elementKey, value)
{
    dictionaryName.$set("Item", elementKey, value);
}

