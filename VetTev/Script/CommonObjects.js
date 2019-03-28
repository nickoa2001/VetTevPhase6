var processName = "vettev";
var processObjectDepth = 25;

function CommonObjects_FindObjectByFullName(storedObject)
{
  let propArray = new Array();
  let valuesArray = new Array();
  var fullName, propertyValue, childObject;
  
  try
  {
    var p = Sys.Process(processName);

    if (Sys.WaitProcess(processName, 60000).Exists)
    {
      fullName = storedObject.PropertyByName("FullName");
      propArray[0] = "FullName";
      valuesArray[0] = fullName.Value;        
      childObject = p.FindChild(propArray, valuesArray, processObjectDepth);

        if (childObject.Exists)
          return childObject;
        else
        {
          Log.Error("[CommonObjects: CommonObjects_FindChild] Object " + storedObject.PropertyByName("FullName").Value +" not found");
          return false;
          Runner.Stop();
        }
    }
  }
  catch(e)
  {
    Log.Error("[CommonObjects: CommonObjects_FindChild] Exception while retrieving an object <" + e.message + "; stacktrace: " + e.stack + ">");
    Runner.Stop(true);
  }  
}


/**
  * This function retrieves an object matching the stored object
  * The properties used are the ClrClassName, Visible, Enabled and the name or the caption or the text as needed.
  * @param storedObject      - stored child object
  * @param enable            - boolean true/false default value true, if enable is false the Enabled property is not taken into account
  * Returns the object if found else returns false.
  */
function CommonObjects_FindObject(storedObject, enable)
{
  var PropArray;
  var ValuesArray;
  var clrClassName, propertyValue, childObject;
  var i = 0;

  try
  {
    var p = Sys.Process(processName);

    if (Sys.WaitProcess(processName, 60000).Exists)
    {
      clrClassName = storedObject.PropertyByName("ClrClassName");
      if ((clrClassName != null))
      {
        if (enable)
        {
          PropArray = new Array(4);
          ValuesArray = new Array(4);
        }
        else
        {
          PropArray = new Array(3);
          ValuesArray = new Array(3);
        }

        PropArray[i] = "ClrClassName";
        ValuesArray[i] = clrClassName.Value;
        i = i + 1;
      }
      else
      {
        PropArray = new Array(3);
        ValuesArray = new Array(3);
      }

      PropArray[i] = "Visible";
      ValuesArray[i] = true;
      i = i + 1;

      propertyValue = storedObject.PropertyByName("Name").Value;
      if (propertyValue == "")
      {
        propertyValue = storedObject.PropertyByName("WndCaption").Value;
        if (propertyValue == null)
        {
          propertyValue = storedObject.PropertyByName("Text").Value;
          PropArray[i] = "Text";
        }
        else
          PropArray[i] = "WndCaption";
      }
      else
        PropArray[i] = "Name";

      ValuesArray[i] = propertyValue;
      i = i + 1;

      if (enable)
      {
        PropArray[i] = "Enabled";
        ValuesArray[i] = true;
      }

        childObject = p.FindChild(PropArray,ValuesArray, processObjectDepth);

        if (childObject.Exists)
          return childObject;
        else
        {
          Log.Message("[CommonObjects: CommonObjects_FindChild] Object " + storedObject.PropertyByName("ClrClassName").Value +" not found");
          return false;
        }

    }
    else
    {
      Log.Error("[CommonObjects: CommonObjects_FindChild] The "+ processName +" process is not running");
      Runner.Stop(true);
    }
  }
  catch(e)
  {
    Log.Error("[CommonObjects: CommonObjects_FindChild] Exception while retrieving an object <" + e.message + "; stacktrace: " + e.stack + ">");
    Runner.Stop(true);
  }
}

/**
  * Clicks on a button object found in a specific window. Can be used if the same button is found in several windows.
  * Logs an error if the object is not found.
  */
function CommonObjects_ButtonClick(buttonObject)
{
  var button;
  try
  {
    if (button = CommonObjects_FindObjectByFullName(buttonObject))
    {
      Log.Message("[CommonObjects: CommonObjects_ButtonClick] Clicking on the button " + buttonObject.Name);
      button.Click();
    }
    else
    {
      Log.Error("[CommonObjects: CommonObjects_ButtonClick] The object "  + buttonObject.Name + " was not found");
      Runner.Stop(true);
    }
  }
  catch(e)
  {
    Log.Error("[CommonObjects: CommonObjects_ButtonClick] Exception raised <" + e.message + "; stacktrace: " + e.stack + ">");
    Runner.Stop(true);
  }
}

/**
  * Clicks on a radioButton object found in a specific window. 
  * Logs an error if the object is not found.
  */
function CommonObjects_RadioButtonClick(radioButtonObject)
{
  var radioButton;
  try
  {
    if (radioButton = CommonObjects_FindObjectByFullName(radioButtonObject))
    {
      Log.Message("[CommonObjects: CommonObjects_RadioButtonClick] Clicking on the radio button " + radioButtonObject.Name);
      radioButton.ClickButton();
    }
    else
    {
      Log.Error("[CommonObjects: CommonObjects_RadioButtonClick] The object "  + radioButtonObject.Name + " was not found");
      Runner.Stop(true);
    }
  }
  catch(e)
  {
    Log.Error("[CommonObjects: CommonObjects_RadioButtonClick] Exception raised <" + e.message + "; stacktrace: " + e.stack + ">");
    Runner.Stop(true);
  }
}


/**
  * Clicks on a button object found in a specific window. Can be used if the same button is found in several windows.
  * Logs an error if the object is not found.
  */
function CommonObjects_GetObjectPropertyValue(buttonObject, propertyName)
{
  var button;
  try
  {
    if (button = CommonObjects_FindObject(buttonObject))
    {
      Log.Message("[CommonObjects: CommonObjects_ButtonClick] Clicking on the button " + buttonObject.Name);
      button.Click();
    }
    else
    {
      Log.Error("[CommonObjects: CommonObjects_ButtonClick] The object "  + buttonObject.Name + " was not found");
      Runner.Stop(true);
    }
  }
  catch(e)
  {
    Log.Error("[CommonObjects: CommonObjects_ButtonClick] Exception raised <" + e.message + "; stacktrace: " + e.stack + ">");
    Runner.Stop(true);
  }
}