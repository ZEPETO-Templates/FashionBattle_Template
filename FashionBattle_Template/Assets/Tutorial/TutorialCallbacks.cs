using UnityEngine;
using UnityEditor;
using Unity.Tutorials.Core.Editor;

/// <summary>
/// Implement your Tutorial callbacks here.
/// </summary>
[CreateAssetMenu(fileName = DefaultFileName, menuName = "Tutorials/" + DefaultFileName + " Instance")]
public class TutorialCallbacks : ScriptableObject
{
    /// <summary>
    /// The default file name used to create asset of this class type.
    /// </summary>
    public const string DefaultFileName = "TutorialCallbacks";
     
     
     GameObject  startMultiserver;

    /// <summary>
    /// Creates a TutorialCallbacks asset and shows it in the Project window.
    /// </summary>
    /// <param name="assetPath">
    /// A relative path to the project's root. If not provided, the Project window's currently active folder path is used.
    /// </param>
    /// <returns>The created asset</returns>
    public static ScriptableObject CreateAndShowAsset(string assetPath = null)
    {
        assetPath = assetPath ?? $"{TutorialEditorUtils.GetActiveFolderPath()}/{DefaultFileName}.asset";
        var asset = CreateInstance<TutorialCallbacks>();
        AssetDatabase.CreateAsset(asset, AssetDatabase.GenerateUniqueAssetPath(assetPath));
        EditorUtility.FocusProjectWindow(); // needed in order to make the selection of newly created asset to really work
        Selection.activeObject = asset;
        return asset;
    }

    /// <summary>
    /// Example callback for basic UnityEvent
    /// </summary>
    public void ExampleMethod()
    {
        Debug.Log("ExampleMethod");
    }

    /// <summary>
    /// Example callbacks for ArbitraryCriterion's BoolCallback
    /// </summary>
    /// <returns></returns>
    public bool DoesFooExist()
    {
        return GameObject.Find("Foo") != null;
    }

    /// <summary>
    /// Implement the logic to automatically complete the criterion here, if wanted/needed.
    /// </summary>
    /// <returns>True if the auto-completion logic succeeded.</returns>
    public bool AutoComplete()
    {
        var foo = GameObject.Find("Foo");
        if (!foo)
            foo = new GameObject("Foo");
        return foo != null;
    }


 public bool Dockarea6()
    {
        var foo = GameObject.Find("Dockarea6");
        if (!foo)
            foo = new GameObject("Dockarea6");
        return foo != null;
    }

    void OnEnable()
    {
        // Encuentra el unity-imgui-container
        var imguiContainer = GetEditorUIElement("unity-imgui-container");
        if (imguiContainer != null)
        {
            Debug.Log("unity-imgui-container encontrado!");
        }
        else
        {
            Debug.LogWarning("No se encontró el unity-imgui-container");
        }

        // Encuentra el Dockarea6
        var dockArea6 = GetEditorUIElement("Dockarea6");
        if (dockArea6 != null)
        {
            Debug.Log("Dockarea6 encontrado!");
           //startMultiserver.Gameobject = dockArea6.gameObject;
        }
        else
        {
            Debug.LogWarning("No se encontró el Dockarea6");
        }
    }

    private EditorWindow GetEditorUIElement(string className)
    {
        var windows = Resources.FindObjectsOfTypeAll<EditorWindow>();
        foreach (var window in windows)
        {
            if (window.GetType().Name == className)
            {
                return window;
            }
        }
        return null;
    }


    
}
