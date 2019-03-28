//USEUNIT CommonObjects

/**
  * Returns the value of a textbox object.
  * @param textBoxObject       - textbox stored object
  * Logs an error if the textbox object is not found.
  */
function TextBox_GetText(textBoxObject)
{
  let textBox = CommonObjects.CommonObjects_FindObject(textBoxObject);

  Log.Message(`[CommonTextControl: TextBox_GetText] Retrieving the value of the text box`);
  return textBox.Text;
}

/**
  * Keys a value in a textbox object. The textBoxPropertyName parameter specifies a property to be used to search for the object. This parameter is not mandatory.
  * @param textBoxObject       - textbox stored object
  * @param value               - the value to be appended
  * Logs an error if the textbox object is not found.
  */
function TextBox_Type(textBoxObject, value)
{
  if (value == null)
    return;

  let textBox = CommonObjects.CommonObjects_FindObject(textBoxObject);
  try
  {
    Log.Message(`[CommonTextControl: TextBox_Type] Typing ${value} in the text box ${textBoxObject.Name}`);
    textBox.Focus();
    textBox.SelectAll();
    textBox.Keys("[Del]");
    textBox.Keys(value);
  }
  catch(e)
  {
    Log.Error(`[CommonTextControl: TextBox_Type] Exception raised ${e.message}; stacktrace: ${e.stack}`);
  }
}