//USEUNIT CommonComboBox
//USEUNIT CommonTextControl
//USEUNIT CommonReporting

function Animals_SeachCustomerName(customerName)
{
  customerName = customerName || "noName";
  CommonComboBox.ComboBox_Type(Objects.Animals_ComboBox_Customer, customerName);
}

function Animals_FindCustomerName(customerName)
{
  customerName = customerName || "noName";
  CommonComboBox.ComboBox_SetText(Objects.Animals_ComboBox_Customer, customerName);
}

function Animals_ClickButtonNew()
{
  let buttonNew = Objects.Animals_Button_New; 
  let buttonUndo = Objects.Animals_Button_Undo;
  
  if (Animals_GetButtonEnabledProperty(buttonUndo))
    CommonObjects.CommonObjects_ButtonClick(buttonUndo);
    
  if (Animals_GetButtonEnabledProperty(buttonNew))
  {
    CommonObjects.CommonObjects_ButtonClick(buttonNew);
    return true; 
  }
  else 
    CommonReporting.Log_StepError("We cannot click on the New Button");    
}

function Animals_ClickButtonEdit()
{
  CommonObjects.CommonObjects_ButtonClick(Objects.Animals_Button_Edit);
}

function Animals_ClickButtonDelete()
{
  CommonObjects.CommonObjects_ButtonClick(Objects.Animals_Button_Delete);
}

function Animals_ClickButtonSave()
{
  CommonObjects.CommonObjects_ButtonClick(Objects.Animals_Button_Save);
}

function Animals_ClickButtonUndo()
{
  CommonObjects.CommonObjects_ButtonClick(Objects.Animals_Button_Undo);
}

function Animals_FillBreed(breedName = "default - default")
{
  ComboBox_ClickItem(Objects.Animals_ComboBox_Breeds, "*"+ breedName + "*");
}

function Animals_FillAnimalName(animalName)
{
  if (animalName == ""|| animalName == null)
    Log_StepError("[Animals: Animals_FillAnimalName] Animal name is mandatory field!")

  CommonTextControl.TextBox_Type(Objects.Animals_TextBox_AnimalName, animalName);  
}

function Animals_SelectGender(gender)
{
  if (gender == null) return;
  else 
    if (gender == "M" || gender == "m" || gender == "Male") 
      CommonObjects_RadioButtonClick(Objects.Animals_RadioButton_SexMale)
  else
    CommonObjects_RadioButtonClick(Objects.Animals_RadioButton_SexFemale)
}

function Animals_IsAnimalSterilized(isSterilized)
{
  if (isSterilized == null) return;
  
  if (isSterilized == "true") 
    CommonObjects_RadioButtonClick(Objects.Animals_RadioButton_SterilizedYes)
  else
    CommonObjects_RadioButtonClick(Objects.Animals_RadioButton_SterilizedNo)
}

function Animals_AddNotes(newNote)
{
  if (newNote == null) return;
  let existingNote = CommonTextControl.TextBox_GetText(Objects.Animals_TextBox_Notes);
  let currentTime = aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%Y/%m/%d/%H:%M");
  
  newNote = existingNote + "New Note on" + currentTime + ": " + newNote;
  TextBox_Type(Objects.Animals_TextBox_Notes, newNote);    
}

function Animals_GetButtonEnabledProperty(buttonObject)
{
  let animalButton = CommonObjects.CommonObjects_FindObjectByFullName(buttonObject);
  //return aqObject.CheckProperty(customerButtonNew, "Enabled", cmpEqual, "true", false);
  return animalButton.Enabled;  
}