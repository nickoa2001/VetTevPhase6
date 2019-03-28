//USEUNIT CommonObjects

/**
  * Keys a value in a textbox object. The textBoxPropertyName parameter specifies a property to be used to search for the object. This parameter is not mandatory.
  * @param comboBoxObject       - comboBox stored object
  * @param value               - the value to be added
  * Logs an error if the comboBoxObject is not found.
  */
function ComboBox_Type(comboBoxObject, value)
{
  if (value == null)
    return;

  let comboBox = CommonObjects.CommonObjects_FindObject(comboBoxObject);
  try
  {
    Log.Message(`[CommonComboBox: ComboBox_Type] Typing ${value} in the combo box ${comboBoxObject.Name}`);
    comboBox.Focus();
    comboBox.SelectAll();
    comboBox.Keys("[Del]");
    comboBox.Keys(value);
    comboBox.Keys("[Enter]");
  }
  catch(e)
  {
    Log.Error(`[CommonComboBox: ComboBox_Type] Exception raised ${e.message}; stacktrace: ${e.stack}`);
  }
}

/**
  * Keys a value in a textbox object. The textBoxPropertyName parameter specifies a property to be used to search for the object. This parameter is not mandatory.
  * @param comboBoxObject       - comboBox stored object
  * @param value               - the value to be added
  * Logs an error if the comboBoxObject is not found.
  */
function ComboBox_SetText(comboBoxObject, value)
{
  if (value == null)
    return;

  let comboBox = CommonObjects.CommonObjects_FindObject(comboBoxObject);
  comboBox.SetText(value);
  comboBox.Keys("[Enter]");
  Log.Message(`[CommonComboBox: ComboBox_SetText] Setting text ${value} in the combo box ${comboBoxObject.Name}`);  
}

/**
  * Keys a value in a textbox object. The textBoxPropertyName parameter specifies a property to be used to search for the object. This parameter is not mandatory.
  * @param comboBoxObject       - comboBox stored object
  * @param item               - can be either string or the item order inside the dropdown control
  * Logs an error if the comboBoxObject is not found.
  */
function ComboBox_ClickItem(comboBoxObject, item)
{
  if (item == null)
    return;

  let comboBox = CommonObjects.CommonObjects_FindObject(comboBoxObject);
  comboBox.ClickItem(item);
  Log.Message(`[CommonComboBox: ComboBox_ClickItem] Clicking the item ${item} specified`);  
}