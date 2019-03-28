//USEUNIT CommonDictionary
//USEUNIT CommonReporting

/*------------------------------------------------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------- XML FILES ------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------------------------------------------------*/

/**
  * This function retrieves a single node corresponding to the xpath expression.
  * Logs an error of the filepath is incorrect.
  */
function File_LoadNodeFromXML(filepath, xpath)
{
  var Doc, Node, s;

  if (aqFile.Exists(filepath))
  {
    Doc = Sys.OleObject("Msxml2.DOMDocument.6.0");
    Doc.async = false;
    Doc.load(filepath);

      // Check if an error was detected while loading the file
    if(Doc.parseError.errorCode != 0)
    {
      error = "Reason:\t" + Doc.parseError.reason + "(" +
          "Line:\t" + aqConvert.VarToStr(Doc.parseError.line) + ", " +
          "Pos:\t" + aqConvert.VarToStr(Doc.parseError.linePos) + ", " +
          "Source:\t" + Doc.parseError.srcText + ")";
      // Post an error to the log and exit
      CommonReporting.Log_StepError("Common files(File_ParseXMLFile): Cannot parse the XML document."+ error);
    }
    Node = Doc.selectSingleNode(xpath);

    return Node.text;
  }
  else
    CommonReporting.Log_StepError("Common files(File_LoadNodeFromXML): Incorrect file path: " + filepath);
}

/**
  * This function parses an XML file and returns a dictionary object with the node name separated by a decimal point and the node value.
  * Logs an error if the XML file is not written correctly
  */
function File_ParseXMLFile(filepath)
{
  var doc, dic, node, error;

  dic = CommonDictionary.Dictionary_CreateDictionary();

  doc = Sys.OleObject("Msxml2.DOMDocument.6.0");
  doc.async = false;
  doc.load(filepath);

  // Check if an error was detected while loading the file
  if(doc.parseError.errorCode != 0)
  {
    error = "Reason:\t" + doc.parseError.reason + "(" +
        "Line:\t" + aqConvert.VarToStr(doc.parseError.line) + ", " +
        "Pos:\t" + aqConvert.VarToStr(doc.parseError.linePos) + ", " +
        "Source:\t" + doc.parseError.srcText + ")";
    // Post an error to the log and exit
    CommonReporting.Log_StepError("Common files(File_ParseXMLFile): Cannot parse the XML document."+ error);
  }
  // Obtains the node
  node = doc.documentElement;

  File_ProcessNode(node, node.nodeName, dic);
  return dic;
}

/**
  * This function retrieves only the nodes corresponding to the xpath expression.
  * The nodes are returned in a dictionary object.
  * Logs an error if the XML file format is incorrect.
  */
function File_ParseXMLFileWithXpath(filepath, xpath)
{
  var doc, nodes, dic, errorcode;

  if (aqFile.Exists(filepath))
  {
    dic = CommonDictionary.Dictionary_CreateDictionary();

    doc = Sys.OleObject("Msxml2.DOMDocument.6.0");
    doc.async = false;
    doc.load(filepath);

    //Checking if the XML file is correctly written
    if(doc.parseError.errorCode != 0)
    {
      errorcode = "Reason:\t" + doc.parseError.reason + "(" +
        "Line:\t" + aqConvert.VarToStr(doc.parseError.line) + ", " +
        "Pos:\t" + aqConvert.VarToStr(doc.parseError.linePos) + ", " +
        "Source:\t" + doc.parseError.srcText + ")";

      CommonReporting.Log_StepError("Common files(File_ParseXMLFileWithXpath): The XML file is incorrect :" + errorcode);
    }
    // Obtains the node
    if (xpath == "")
      CommonReporting.Log_StepError("Common files(File_ParseXMLFileWithXpath): No xpath expression specified");
    else
      nodes = doc.selectNodes(xpath);

    if (nodes.length == 0)
      CommonReporting.Log_StepError("Common files(File_ParseXMLFileWithXpath): No matching nodes for the xpath expression : " + xpath);

    // Process the nodes
    for(let i = 0; i < nodes.length; i++)
      CommonDictionary.Dictionary_AddElementKeyValueToDictionary(dic, nodes.item(i).nodeName, nodes.item(i).text);

    return dic;
  }
  else
     CommonReporting.Log_StepError("Common files(File_ParseXMLFileWithXpath): Incorrect file path: " + filepath);
}

/**
  * This function retrieves the attribute value corresponding to the xpath expression and attribute name.
  * Logs an error if the XML file format is incorrect or if there's no attribute matching the xpath expression.
  */
function File_GetNodeAttributeFromXML(filepath, xpath, attributeName)
{
  var doc, node, attr, errorcode;

  if (aqFile.Exists(filepath))
  {
    doc = Sys.OleObject("Msxml2.DOMDocument.6.0");

    doc.async = false;
    doc.load(filepath);
    // Retrieving the node
    node = doc.selectSingleNode(xpath);

    // Retrieving the node attribute
    if (node != null)
      attr = node.getAttribute(attributeName);
    else
      CommonReporting.Log_StepError("Common files(File_ParseXMLFileWithXpath): Node " + xpath + " not found in the XML file");

    return attr;
  }
  else
     CommonReporting.Log_StepError("Common files(File_ParseXMLFileWithXpath): Incorrect file path: " + filepath);
}

/**
  * Returns the attribute value of a node
  * @param node            - XmlNode  one node of the XML
  * @param attributeName   - String  name of the node attribute
  * Logs an error if the attribute is not defined for the node
  */
function File_GetNodeAttribute(node,attributeName)
{
  var node, attr, errorcode;

  if ((attributeName != null) && (node != null))
  {
    // Retrieving the node attribute
    attr = node.getAttribute(attributeName);

    if (attr != null)
      return attr;
    else
      CommonReporting.Log_StepError("Common files(File_GetNodeAttribute): No <" + attributeName + "> attribute is defined for this node");
  }
  else
    CommonReporting.Log_StepError("Common files(File_ParseXMLFileWithXpath): Incorrect parameters, node <" + node + ">, attributeName <" + attributeName +">");
}

/**
  * This function retrieves all the nodes corresponding to the xpath expression.
  * The nodes are returned in a dictionary object. The key of the dictionary is the child node name and child node text.
  * Logs an error if the XML file format is incorrect or if there is no nodes matching the xpath expression.
  */
function File_GetXMLNodesWithXpath(filepath, xpath, keyValue)
{
  var doc, nodes, errorcode, dicNode;
  var attributeValue = "";

  if (aqFile.Exists(filepath))
  {
    doc = Sys.OleObject("Msxml2.DOMDocument.6.0");

    doc.async = false;
    doc.load(filepath);

    //Checking if the XML file is correctly written
    if(doc.parseError.errorCode != 0)
    {
      errorcode = "Reason:\t" + doc.parseError.reason + "(" +
        "Line:\t" + aqConvert.VarToStr(doc.parseError.line) + ", " +
        "Pos:\t" + aqConvert.VarToStr(doc.parseError.linePos) + ", " +
        "Source:\t" + doc.parseError.srcText + ")";

      CommonReporting.Log_StepError("Common files(File_GetXMLNodesWithXpath): The XML file is incorrect :" + errorcode);
    }

    // Obtains the node
    if (xpath == "")
      CommonReporting.Log_StepError("Common files(File_GetXMLNodesWithXpath): No xpath expression specified");
    else
      nodes = doc.selectNodes(xpath);

    if (nodes.length == 0)
      CommonReporting.Log_StepError("Common files(File_GetXMLNodesWithXpath): No matching nodes for the xpath expression : " + xpath);

    // Process the nodes
    for(let i = 0; i < nodes.length; i++)
    {
      dicNode = CommonDictionary.Dictionary_CreateDictionary();
      CommonDictionary.Dictionary_EmptyDictionary(dicNode);

      if (nodes.item(i).childNodes.length == 0)
        CommonReporting.Log_StepError("Common files(File_GetXMLNodesWithXpath): No matching nodes for the xpath expression : " + xpath);

      for(let j = 0; j < nodes.item(i).childNodes.length; j++)
        CommonDictionary.Dictionary_AddElementKeyValueToDictionary(dicNode, nodes.item(i).childNodes.item(j).nodeName,nodes.item(i).childNodes.item(j).text);
    }
    return dicNode;
  }
  else
     CommonReporting.Log_StepError("Common files(File_GetXMLNodesWithXpath): Incorrect file path: " + filepath);
}

/**
  * This function retrieves all the nodes attribute value corresponding to the xpath expression and an attribute name.
  * The nodes attribute values are returned in a dictionary object.
  * Logs an error if the XML file format is incorrect or if there is no nodes matching the xpath expression.
  */
function File_GetNodeAttributeWithXpath(filepath, xpath, attributeName)
{
  var doc, nodes, dic, errorcode;
  var idattr, typeattr, productId;

  if (aqFile.Exists(filepath))
  {
    doc = Sys.OleObject("Msxml2.DOMDocument.6.0");
    dic = CommonDictionary.Dictionary_CreateDictionary();

    doc.async = false;
    doc.load(filepath);

    //Checking if the XML file is correctly written
    if(doc.parseError.errorCode != 0)
    {
      errorcode = "Reason:\t" + doc.parseError.reason + "(" +
        "Line:\t" + aqConvert.VarToStr(doc.parseError.line) + ", " +
        "Pos:\t" + aqConvert.VarToStr(doc.parseError.linePos) + ", " +
        "Source:\t" + doc.parseError.srcText + ")";

      CommonReporting.Log_StepError("Common files(File_ParseXMLFileWithXpath): The XML file is incorrect :" + errorcode);
    }

    // Obtains the node
    if (xpath == "")
      CommonReporting.Log_StepError("Common files(File_ParseXMLFileWithXpath): No xpath expression specified");
    else
      nodes = doc.selectNodes(xpath);

    if (nodes.length == 0)
      CommonReporting.Log_StepError("Common files(File_ParseXMLFileWithXpath): No matching nodes for the xpath expression : " + xpath);

    // Process the nodes
    for(let i = 0; i < nodes.length; i++)
    {
      productId = nodes.item(i).getAttribute(attributeName);
      CommonDictionary.Dictionary_AddElementToDictionary(dic, productId);
    }
    return dic;
  }
  else
     CommonReporting.Log_StepError("Common files(File_ParseXMLFileWithXpath): Incorrect file path: " + filepath);
}

/**
  * This function returns the nodes (XmlNodeList type format) matching the xpath expression of the specified file
  * @param filepath    - fullpath to the XML file
  * @param xpath       - xpath expression
  * Logs an error if the the XML file is incorrect or if the filepath is incorrect
  */
function File_GetNodeFromXpath(filepath, xpath)
{
  var doc, nodes, errorcode, dicNode;
  var attributeValue = "";

  if (aqFile.Exists(filepath))
  {
    doc = Sys.OleObject("Msxml2.DOMDocument.6.0");

    doc.async = false;
    doc.load(filepath);

    //Checking if the XML file is correctly written
    if(doc.parseError.errorCode != 0)
    {
      errorcode = "Reason:\t" + doc.parseError.reason + "(" +
        "Line:\t" + aqConvert.VarToStr(doc.parseError.line) + ", " +
        "Pos:\t" + aqConvert.VarToStr(doc.parseError.linePos) + ", " +
        "Source:\t" + doc.parseError.srcText + ")";

      CommonReporting.Log_StepError("Common files(File_GetNodeFromXpath): The XML file is incorrect :" + errorcode);
    }

    // Obtains the node
    if (xpath == "")
      CommonReporting.Log_StepError("Common files(File_GetNodeFromXpath): No xpath expression specified");
    else
      nodes = doc.selectNodes(xpath);

    return nodes;
  }
  else
     CommonReporting.Log_StepError("Common files(File_GetNodeFromXpath): Incorrect file path: " + filepath);
}

/**
  * This function replaces the attribute value corresponding to the xpath expression and attribute name.
  * @param filepath            - fullpath to the XML file
  * @param xpath               - xpath expression
  * @param attributeName       - attribute name of the xml node that need to be updated
  * @param newAttributeValue   - new value for the attribute attributeName
  * Logs an error if the XML file format is incorrect or if there's no attribute matching the xpath expression.
  */
function File_SetNodeAttributeWithXpath(filepath, xpath, attributeName, newAttributeValue)
{
  var doc, nodes, errorcode;
  var idattr, typeattr, productId;

  if ((filepath != null) && (xpath != null) && (attributeName != null) && (newAttributeValue != null))
  {
    if (aqFile.Exists(filepath))
    {
      doc = Sys.OleObject("Msxml2.DOMDocument.6.0");

      doc.async = false;
      doc.load(filepath);

      //Checking if the XML file is correctly written
      if(doc.parseError.errorCode != 0)
      {
        errorcode = "Reason:\t" + doc.parseError.reason + "(" +
          "Line:\t" + aqConvert.VarToStr(doc.parseError.line) + ", " +
          "Pos:\t" + aqConvert.VarToStr(doc.parseError.linePos) + ", " +
          "Source:\t" + doc.parseError.srcText + ")";

        CommonReporting.Log_StepError("Common files(File_SetNodeAttributeWithXpath): The XML file is incorrect :" + errorcode);
      }

      // Obtains the node
      if (xpath == "")
        CommonReporting.Log_StepError("Common files(File_SetNodeAttributeWithXpath): No xpath expression specified");
      else
        nodes = doc.selectNodes(xpath);

      if (nodes.length == 0)
        CommonReporting.Log_StepError("Common files(File_SetNodeAttributeWithXpath): No matching nodes for the xpath expression : " + xpath);

      // Process the nodes
      for(i = 0; i < nodes.length; i++)
      {
        productId = nodes.item(i).getAttribute(attributeName);
        nodes.item(i).setAttribute(attributeName, newAttributeValue)
      }
      doc.save(filepath)
    }
    else
       CommonReporting.Log_StepError("Common files(File_SetNodeAttributeWithXpath): Incorrect file path: " + filepath);
  }
  else
    CommonReporting.Log_StepError("Common files(File_SetNodeAttributeWithXpath): Incorrect parameters, filepath <" + filepath + ">, xpath <" + xpath + ">, attributeName <" + attributeName +">, newAttributeValue <" + newAttributeValue + ">");
}

/**
  * This function replaces the value of a node corresponding to the xpath expression.
  * @param filepath          - fullpath to the XML file
  * @param xpath             - xpath expression
  * @param newNodeValue      - new value for the node
  * Logs an error if the XML file format is incorrect or if there's no node matching the xpath expression.
  */
function File_SetNodeValueWithXpath(filepath, xpath, newNodeValue)
{
  var doc, nodes, errorcode;
  var idattr, typeattr, productId;

  if (newNodeValue != null)
  {
    if ((filepath != null) && (xpath != null))
    {
      if (aqFile.Exists(filepath))
      {
        doc = Sys.OleObject("Msxml2.DOMDocument.6.0");

        doc.async = false;
        doc.load(filepath);

        //Checking if the XML file is correctly written
        if(doc.parseError.errorCode != 0)
        {
          errorcode = "Reason:\t" + doc.parseError.reason + "(" +
            "Line:\t" + aqConvert.VarToStr(doc.parseError.line) + ", " +
            "Pos:\t" + aqConvert.VarToStr(doc.parseError.linePos) + ", " +
            "Source:\t" + doc.parseError.srcText + ")";

          CommonReporting.Log_StepError("Common files(File_SetNodeValueWithXpath): The XML file is incorrect :" + errorcode);
        }

        // Obtains the node
        if (xpath == "")
          CommonReporting.Log_StepError("Common files(File_SetNodeValueWithXpath): No xpath expression specified");
        else
          nodes = doc.selectNodes(xpath);

        if (nodes.length == 0)
          CommonReporting.Log_StepError("Common files(File_SetNodeValueWithXpath): No matching nodes for the xpath expression : " + xpath);

        // Process the nodes
        for(i = 0; i < nodes.length; i++)
        {
          nodes.item(i).text = newNodeValue
        }
        doc.save(filepath)
      }
      else
         CommonReporting.Log_StepError("Common files(File_SetNodeValueWithXpath): Incorrect file path: " + filepath);
    }
    else
      CommonReporting.Log_StepError("Common files(File_SetNodeValueWithXpath): Incorrect parameters, filepath <" + filepath + ">, xpath <" + xpath + ">, newNodeValue <" + newNodeValue + ">");
  }
}

/**
  * PRIVATE
  * Function to parse an XML file
  */
function File_ProcessNode(node, currentNodeName, dic)
{
  var childNodes, i, name;

  childNodes = node.childNodes;

  for(i = 0; i <childNodes.length; i++)
  {
    if (childNodes.item(i).nodeName.charAt(0) != "\#")
    {
      name = currentNodeName+"."+childNodes.item(i).nodeName;
      File_ProcessNode(childNodes.item(i), childNodes.item(i).nodeName, dic);
    }
    else
    {
      dic.Add(currentNodeName,childNodes.item(i).nodeValue);
    }
  }
}

/*------------------------------------------------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------- FILES ----------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------------------------------------------------*/

/**
  * This function checks if the specified file path exists.
  * @param filePath               - path to the file that will be copied
  * Logs an error if the file doesn't exist.
  */
function File_CheckFileExists(filePath)
{
  if (filePath == null)
    return;

  if (!aqFile.Exists(filePath))
    CommonReporting.Log_StepError("[CommonFiles: File_CheckFileExists] The file path does not exist< " + filePath + ">");

  CommonReporting.Log_Debug("[CommonFiles: File_CheckFileExists] The filepath <" + filePath + "> exists");
}

/**
  * This function checks if the specified file path exist after the timeout.
  * Logs an error if the file does not exist.
  * @param filePath               - path to the file
  * @param timeout                - optional - time to wait before checking the file exists
  */
function File_CheckFileExistsWithTimeout(filePath, timeout)
{
  var elapsedTime = 0;
  if (timeout == null)
    timeout = 0;

  while(elapsedTime <= timeout)
  {
    if (!aqFile.Exists(filePath))
    {
      elapsedTime = elapsedTime + 100;
      aqUtils.Delay(100);
    }
    else
    {
      CommonReporting.Log_Debug("[CommonFiles: File_CheckFileExistsWithTimeout] The filepath <" + filePath + "> exists");
      return;
    }
  }
  CommonReporting.Log_StepError("[CommonFiles: File_CheckFileExistsWithTimeout] The file path does not exist < " + filePath + "> after "+ timeout);
}

/**
  * This function checks if the specified file path doesn't exist after the timeout.
  * Logs an error if the file exists.
  * @param filePath               - path to the file
  * @param timeout                - optional - time to wait before checking the file does not exist
  */
function File_CheckFileNotExists(filePath, timeout)
{
  var elapsedTime = 0;

  if (timeout == null)
    timeout = 0;

  while( elapsedTime <= timeout)
  {
    if (aqFile.Exists(filePath))
    {
      elapsedTime = elapsedTime + 100;
      aqUtils.Delay(100);
    }
    else
    {
      CommonReporting.Log_Debug("[CommonFiles: File_CheckFileNotExists] The filepath <" + filePath + "> doesn't exist");
      return;
    }
  }
  CommonReporting.Log_StepError("[CommonFiles: File_CheckFileNotExists] The filepath <" + filePath + "> exists");
}

/**
  * This function copies the specified file in a folder.
  * If the destination folder doesn't exist, it will be created. If the file already exists it will be overwritten.
  * Logs an error if the filepath is incorrect
  * @param filePath               - path to the file that will be copied
  * @param destinationPath        - path to the folder where the files is copied
  */
function File_CopyFile(filePath, destinationPath)
{
  var exitResult;

  File_CheckFileExists(filePath);
  File_CreateFolder(destinationPath);

  exitResult = aqFileSystem.CopyFile(filePath, aqFileSystem.IncludeTrailingBackSlash(destinationPath), false);
  if (!exitResult)
    Log.Error("[CommonFiles: File_CopyFile] Error when the file was copied");

  CommonReporting.Log_Debug("[CommonFiles: File_CopyFile] Copying file: " + filePath + " in folder: " + aqFileSystem.IncludeTrailingBackSlash(destinationPath));
}

/**
  * This function deletes the file from a specific path.
  * @param filePath   - String  full file path (The entire path + file name need to be provided)
  * Logs an error if the filepath format is incorrect
  */
function File_DeleteFile(filePath)
{
  var exitResult;

  if (!aqFile.Exists(filePath))
  {
    CommonReporting.Log_Debug("[CommonFiles: File_DeleteFile] The file path <" + filePath + "> does not exist");
    return;
  }

  var exitResult = aqFileSystem.DeleteFile(filePath);
  if (!exitResult)
    CommonReporting.Log_StepError("[CommonFiles: File_DeleteFile] The file <" + filePath + "> was not deleted");

  CommonReporting.Log_Debug("[CommonFiles: File_DeleteFile] Deleting file " + filePath);
}

/**
  * Opens the specified file in text mode using the given encoding type and write in the file the string specified
  * @param  folderPath        - String  path to the folder
  * @param  fileName          - String  with the name of the file
  * @param  content           - String  with the content that will be written in the file
  * @param  textCodingType    - Available values : aqFile.ctANSI -> ANSI / aqFile.ctUnicode -> Unicode (UTF-16) / aqFile.ctUTF8 -> UTF8
  * @param overWriteOrCreate  - optional, Boolean true/false(default) Specifies whether or not the method will create a new file in place of existing or non-existent files
                                        - if file does not exist and OverwriteOrCreate is false => Does not create a file and returns False
                                        - if file does not exist and OverwriteOrCreate is true => Creates a file with the specified text.
                                        - if file exist and OverwriteOrCreate is false => Appends text at the end of the file.
                                        - if file exist and OverwriteOrCreate is true => Overwrites file contents with the new text.
  */
function File_WriteToFile(folderPath, fileName, content, textCodingType, overWriteOrCreate)
{
  var filePath;
  var exitResult;

  if (folderPath == null || fileName == null || content == null)
    CommonReporting.Log_StepError("[CommonFiles: File_WriteToFile] Incorrect parameter folderPath <" + folderPath + ">, fileName <" + fileName + "> content <" + content + ">");

  if (textCodingType == null)
    textCodingType = aqFile.ctUTF8;
  if (overWriteOrCreate == null)
    overWriteOrCreate = false;

  try
  {
    File_CreateFolder(folderPath);
    filePath = folderPath + "\\" + fileName;

    exitResult = aqFile.WriteToTextFile(filePath, content, textCodingType, overWriteOrCreate);
    if (!exitResult)
      CommonReporting.Log_StepError("[CommonFiles: File_WriteToFile] Unable to write in the file <" + filePath + ">");
    CommonReporting.Log_Debug("[CommonFiles: File_WriteToFile] File was successfully written");
  }
  catch(e)
  {
    CommonReporting.Log_StepError("[CommonFiles: File_WriteToFile] Exception caught: " + e.message + "; stacktrace: " + e.stack);
  }
}

/**
  * This function returns aqObjIterator object that contains files matching the specified pattern in a folder
  * @param   path              - Specifies the location (the fully qualified path) where the search will be performed.
  * @param   searchPattern     - Specifies the names of the files to search. Wildcard characters can be used.
  * @param   searchInSubDirs   - Specifies whether to perform the search in the subfolders of the folder specified by the path parameter.
  * Returns false if no matching files is found
  */
function File_FindFileInFolderWithPattern(path, searchPattern, searchInSubDirs)
{
  var foundFiles = aqFileSystem.FindFiles(path, searchPattern, searchInSubDirs);

  if (foundFiles != null )
    return foundFiles;
  else
  {
    CommonReporting.Log_Debug("[CommonFiles: File_FindFileInFolderWithPattern] No matching files in the folder for this pattern");
    return false;
  }
}

/**
  * This function returns aqObjIterator object that contains files matching the specified pattern in a folder
  * @param   path              - Specifies the location (the fully qualified path) where the search will be performed.
  * @param   searchPattern     - Specifies the names of the files to search. Wildcard characters can be used.
  * @param   searchInSubDirs   - Specifies whether to perform the search in the subfolders of the folder specified by the path parameter.
  * @param   timeout           - optional - time to wait before checking the file does not exist.
  * Returns false if no matching files is found
  */
function File_FindFileInFolderWithPatternAndTimeout(path, searchPattern, searchInSubDirs, timeout)
{
  var elapsedTime = 0;
  if (timeout == null)
    timeout = 0;

  while(elapsedTime <= timeout)
  {
    var foundFiles = aqFileSystem.FindFiles(path, searchPattern, searchInSubDirs);
    if (foundFiles != null)
    {
      return foundFiles;
    }
    else
    {
      elapsedTime = elapsedTime + 100;
      aqUtils.Delay(100);
    }
  }
  CommonReporting.Log_Debug("[CommonFiles: File_FindFileInFolderWithPattern] No matching files in the folder for this pattern after " + timeout);
  return false;
}

/**
  * Opens the specified file in text mode using the given encoding type and returns the file contents as a single string.
  * @param  filePath        - file path
  * @param  textCodingType  - optional, available values : aqFile.ctANSI -> ANSI / aqFile.ctUnicode -> Unicode (UTF-16) / aqFile.ctUTF8 -> UTF8(default value)
  */
function File_GetContent(filePath, textCodingType)
{
  try
  {
    if (filePath == null)
      CommonReporting.Log_StepError("[CommonFiles: File_GetContent] Incorrect parameter filePath <" + filePath + ">");

    if (textCodingType == null)
      textCodingType = aqFile.ctUTF8;

    var elapsedTime = 0;

    while (elapsedTime < CommonProperties.defaultTimeout)
    {
      if (aqFile.Exists(filePath))
      {
        return aqFile.ReadWholeTextFile(filePath, textCodingType);
      }
      else
      {
        elapsedTime = elapsedTime + 100;
        aqUtils.Delay(100);
      }
    }
  }
  catch(e)
  {
    CommonReporting.Log_StepError("[CommonFiles: File_GetContent] Exception caught : " + e.message + "; stacktrace: " + e.stack);
  }
}

/**
  * Search for a string in a file. Return true or false if the string is found
  * @param  filePath        - file path
  * @param  searchString    - string that is searched
  * @param  textCodingType  - optional, available values : aqFile.ctANSI -> ANSI / aqFile.ctUnicode -> Unicode (UTF-16) / aqFile.ctUTF8 -> UTF8(default value)
  */
function File_IsStringInFile(filePath, searchString, textCodingType)
{
  if (filePath == null || searchString == null)
  CommonReporting.Log_StepError("[CommonFiles: File_IsStringInFile] Incorrect parameter filePath <" + filePath + ">, searchString <" + searchString + ">");

  var fileContent = File_GetContent(filePath, textCodingType);
  if(aqString.Find(fileContent, searchString) != -1)
    return true;
  else
    return false;
}

/**
  * Check for a message in the product log file of the current date
  * @param  logFolder         - path of the log folder of the product
  * @param  searchedMessage   - string that is searched in the current log file
  * @param  timeout           - time in seconds, to wait for the message in log file
  */
function File_CheckMessageInCurrentLogFile(logFolder, searchedMessage, timeout)
{
  var elapsedTime = 0;

  if (logFolder == null)
    CommonReporting.Log_StepError("[CommonFiles: File_CheckMessageInCurrentLogFile] Incorrect parameter logFolder <" + logFolder + ">");

  if (timeout == null)
    var timeout = CommonProperties.defaultTimeout;

  while (elapsedTime <= timeout)
  {
    if(File_IsStringInFile(logFolder + "\\" + File_GetLogFileName(), searchedMessage))
    {
      CommonReporting.Log_Trace("[CommonFiles: File_CheckMessageInCurrentLogFile] The message <" + searchedMessage + "> was found");
      return;
    }
    else
    {
      elapsedTime = elapsedTime + 1;
      aqUtils.Delay(1000);
    }
  }
  CommonReporting.Log_StepError("[CommonFiles: File_CheckMessageInCurrentLogFile] The string <" + searchedMessage + "> was not found");
}

/**
  * Obtain the log message of the current date of the product
  */
function File_GetLogFileName()
{
  var todayValue, logFileName;

  todayValue = aqConvert.DateTimeToFormatStr(aqDateTime.Now(), "%Y%m%d")
  logFileName = todayValue + ".txt";

  return logFileName;
}

/**
  * This function returns the last modified file matching the specified pattern in a folder
  * @param   path              - Specifies the location (the fully qualified path) where the search will be performed.
  * @param   searchPattern     - Specifies the names of the files to search. Wildcard characters can be used.
  * @param   searchInSubDirs   - optional; Specifies whether to perform the search in the subfolders of the folder specified by the path parameter. default value = false
  * Returns the fullpath of the file, returns false if no matching file is found
  */
function File_GetLastModifiedFileInFolderWithPattern(path, searchPattern, searchInSubDirs)
{
  var foundFiles, aFile, lastDateTime, fileResult;

  if (path == null || searchPattern == null)
    CommonReporting.Log_StepError("[CommonFiles: File_GetLastModifiedFileInFolderWithPattern] Incorrect parameters path <" + path + ">, searchPattern <" + searchPattern + ">");

  if (searchInSubDirs == null)
    searchInSubDirs = false;

  foundFiles = aqFileSystem.FindFiles(path, searchPattern, searchInSubDirs);
  if (foundFiles != null)
  {
    while (foundFiles.HasNext())
    {
      aFile = foundFiles.Next();

      if (lastDateTime == null)
        lastDateTime = aFile.DateLastModified;

      if (aFile.DateLastModified > lastDateTime)
        fileResult = aFile.Path;
    }
    return fileResult;
  }
  else
  {
    CommonReporting.Log_Debug("[CommonFiles: File_GetLastModifiedFileInFolderWithPattern] No matching files in the folder for this pattern");
    return false;
  }
}

/* Download artifact from http://ulcentral.ullink.lan:8081/
*/
function File_GetResourceFromArtifactory(fileURL)
{
    var localPath = File_GetLocalArtifactPath(fileURL);
    File_RemoveLocalArtifact(localPath);

    // Download the file
    var objHTTP = new Sys.OleObject("MSXML2.XMLHTTP");
    objHTTP.open("GET", fileURL, false);
    objHTTP.send();
    while((objHTTP.readyState != 4) && (objHTTP.readyState != 'complete'))
    {
        Delay(100);
        if (objHTTP.Status != 200)
        {
            CommonReporting.Log_StepError("[CommonFiles: File_GetResourceFromArtifactory] Invalid URL provided." + " The returned status is " + objHTTP.Status);
        }
    }
    var objADOStream = new Sys.OleObject("ADODB.Stream");
    objADOStream.Open();
    objADOStream.Type = 1; //adTypeBinary

    objADOStream.Write(objHTTP.ResponseBody);
    objADOStream.Position = 0;    //Set the stream position to the start

    objADOStream.SaveToFile(localPath);
    objADOStream.Close();

    var objFSO = new Sys.OleObject("Scripting.FileSystemObject");
    if (objFSO.FileExists(localPath))
    {
        CommonReporting.Log_Trace("[CommonFiles: File_GetResourceFromArtifactory] Successfully downloaded the artifact.");
    }
    else
    {
        CommonReporting.Log_StepError("[CommonFiles: File_GetResourceFromArtifactory] File not found.");
    }
}

/* Get local path of artifact from http://ulcentral.ullink.lan:8081/
*/
function File_GetLocalArtifactPath(fileURL)
{
    if (fileURL != null)
    {
        var localPath = aqFileSystem.GetCurrentFolder() + "\\";
        var reversedFileName = "";

        //get file name from URL passed as parameter
        for (i = fileURL.length -1; i>=0; i--)
        {
            if (fileURL[i] != "/")
                reversedFileName = reversedFileName + fileURL[i]
            else
                break;
        }

        //add file name to local path
        for (i = reversedFileName.length -1; i>=0; i--)
        {
            localPath = localPath + reversedFileName[i];
        }

        return localPath;
    }
    else
    {
        CommonReporting.Log_StepError("[CommonFiles: File_GetLocalArtifactPath] Empty URL provided.");
    }
}

/* Remove previosuly downloaded artifact from http://ulcentral.ullink.lan:8081/
*/
function File_RemoveLocalArtifact(localPath)
{
    var objFSO = new Sys.OleObject("Scripting.FileSystemObject");
    if (objFSO.FileExists(localPath))
    {
        objFSO.DeleteFile(localPath);
        if (objFSO.FileExists(localPath))
        {
            CommonReporting.Log_StepError("[CommonFiles: File_RemoveLocalArtifact] Artifact was not successfully deleted.");
        }
        else
        {
            CommonReporting.Log_Trace("[CommonFiles: File_RemoveLocalArtifact] Successfully deleted the artifact.");
        }
    }
}

/*------------------------------------------------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------- FOLDERS --------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------------------------------------------------*/

/**
  * Create a folder at the path specified
  * @param  folderPath    - String  path with the folder that will be created
  */
function File_CreateFolder(folderPath)
{
  var exitResult;
  if (folderPath == null)
    CommonReporting.Log_StepError("[CommonFiles: File_CreateFolder] Incorrect parameter folderPath <" + folderPath + ">" );

  if (!aqFileSystem.Exists(folderPath))
  {
    exitResult = aqFileSystem.CreateFolder(folderPath);
    if(exitResult != 0)
      CommonReporting.Log_StepError("[CommonFiles: File_CreateFolder] Folder <" + folderPath + "> was not created");

    CommonReporting.Log_Debug("[CommonFiles: File_CreateFolder] Creation of the folder : <" + folderPath + ">");
  }
}

/**
  * This function copies the specified folder in the destination folder. If the destination folder doesn't exist, it will be created.
  * If the folder already exists it will be overwritten.
  * Logs an error if the folderpath is incorrect
  * @param filePath               - path to the file that will be copied
  * @param destinationPath        - path to the folder where the fields is copied
  */
function File_CopyFolder(sourceFolder, destinationFolder)
{
  var exitResult;
  File_CheckFileExists(sourceFolder);

  exitResult = aqFileSystem.CopyFolder(sourceFolder, destinationFolder, false);
  if(!exitResult)
    CommonReporting.Log_StepError("[CommonFiles: File_CopyFolder] Folder <" + sourceFolder + "> was not copied");

  CommonReporting.Log_Debug("[CommonFiles: File_CopyFolder] Copying files in folder: " + aqFileSystem.IncludeTrailingBackSlash(destinationFolder));
}

/**
  * This function deletes the content of a folder if the specified path exists.
  * @param folderPath       - path to the folder that will be emptied
  */
function File_EmptyFolder(folderPath)
{
  var isFolderContentRemoved;

  if (!aqFile.Exists(folderPath))
  {
    CommonReporting.Log_Debug("[CommonFiles: File_EmptyFolder] Folder <" + folderPath + "> does not exist");
    return;
  }

  isFolderContentRemoved = aqFileSystem.DeleteFile(folderPath + "\\*.*");
  if (!isFolderContentRemoved)
  {
    CommonReporting.Log_StepWarning("[CommonFiles: File_EmptyFolder] Failed to delete files from folder " + folderPath);
    CommonReporting.SetCurrentTestCaseStatus(statusWarning);
  }

  CommonReporting.Log_Debug("[CommonFiles: File_EmptyFolder] Deleting files in folder " + folderPath + " was successful");
}

/**
  * This function deletes a folder if the specified path exists
  * @param folderPath       - path to the folder that will be removed
  * @param removeNonEmpty   - optional; default value: true
                            - Specifies whether the method should remove non-empty folders.
                            - If the parameter is False, the method removes a folder only if it does not contain any files.
                            - If the parameter is True, the method removes non-empty folders as well.
  */
function File_DeleteFolder(folderPath, removeNonEmpty)
{
  var isFolderRemoved;

  if (!aqFile.Exists(folderPath))
  {
    CommonReporting.Log_Debug("[CommonFiles: File_DeleteFolder] Folder does not exist");
    return;
  }

  if (removeNonEmpty == null)
    removeNonEmpty = true;

  isFolderRemoved = aqFileSystem.DeleteFolder(folderPath, removeNonEmpty);
  if (!isFolderRemoved)
    CommonReporting.Log_StepError("[CommonFiles: File_DeleteFolder] The folder " + folderPath + " failed to be removed");

  CommonReporting.Log_Debug("[CommonFiles: File_DeleteFolder] Folder " + folderPath + " was successfully removed");
}

/**
  * Returns the folder path of the specified file path
  * @param filePath   - String  full file path
  * Logs an error if the filepath format is incorrect
  */
function File_GetFolderPath(filePath)
{
  var pos = aqString.FindLast(filePath, "\\");
  if (pos != -1)
    return aqString.SubString(filePath, 0, pos);
  else
    CommonReporting.Log_StepError("[CommonFiles: File_GetFolderPath] Incorrect file path: " + filePath);
}