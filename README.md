
# Fashion Battle Template

## 📢 About

Nice to meet you Creators! 👋 Welcome to Fashion Battle guide! <br>

With Fashion Battle you can create amazing worlds to play with your friends! <br>

Now, are you ready to start? <br>

  

## ❓ How to create with Fashion Battle Template

:wrench: Installation and settings

- If you haven't install the Zepeto World you can check how to do it <a href="https://docs.zepeto.me/studio/reference/installation_and_settings">Here!</a>

- Once you have installed Zepeto, you have to pull this repository and you can do it in 3 ways
  - [Cloning it](#cloning-the-project)
  - [Downloading it](#downloading-the-project)
  - [By Unitypackage](#getting-it-from-the-releases-section)

### Cloning the project

First we go to the [Code] button and click it.

<br><img src = "docs/images/download/01.png" alt = "button code img"></img><br>

Then click on the icon to copy the link of the repository (make sure that you are on the https tab) or copy it manually.

<br><img src = "docs/images/download/02.png" alt = "copy github link img"></img><br>

Once you have it, using your your preferred software (in this case we are using <a href="https://git-fork.com/" target="_blank"> Fork</a>) click on "File->Clone" or press "Ctrl + N" to clone.

<br><img src = "docs/images/download/03.png" alt = "clone project img"></img><br>

Here we fill the URL tab and set the folder where you want to save it and press clone.

<br><img src = "docs/images/download/04.png" alt = "cloning settings img"></img><br>

Once it clones the project you can open it from Unity Hub. <br>


### Downloading the project

Click on the same [Code] button but instead of clicking on the link, click on download zip

<br><img src = "docs/images/download/05.png" alt = "download zip img"></img><br>

Then extract the files and open it with Unity. <br>


### Getting it from the releases section

Go to the releases section or click in the lastest release

<br><img src = "docs/images/download/06.png" alt = "releases section img"></img><br>

Then click on the file ".unitypackage" and import it in a new project of Unity!

<br><img src = "docs/images/download/07.png" alt = "unitypackage img"></img><br>


  

> 💡 Enjoy and start creating with the Template! :tada:
<br>


## ❓ FAQ
<h3> How to open the project</h3>

To open the project you have to press the [Open] button in Unity Hub and then look for the folder that you download.
Then inside this folder you have the project folder and the docs, select the template folder and it will open the project.

<br><img src = "docs/images/howto/unityproject.png" alt = "unity project img" width="600"></img><br><br>

<h3> How to play</h3>

Before you press play to test the template you have to open the scene and start the server. 
First find the scene in the next folder and open it.

<br><img src = "docs/images/howto/scene.png" alt = "scene img" width="600"></img><br><br>

Then first press the [Start Server Button(green)] and then you can press [Play] to test the template.

<br><img src = "docs/images/howto/howtoplay.png" alt = "how to play img" width="600"></img><br><br>


<h3> How to change variables</h3>

To make changes in the game you can go in the Hierarchy and select the "Managers" folder there are the most customizables settings for the template.

<br><img src = "docs/images/howto/wherearevariables.png" alt = "variables img" width="600"></img><br><br>


<h3> World multiplay component missing</h3>

If you have an error showing that some component is missing, you have to go to the project/packages folder and find the ZEPETO.World folder, then right click it and press in Reimport, it will took some time to fix that problem.

<br><img src = "docs/images/howto/reimportzepetoworld.png" alt = "reimport folder img" width="600"></img><br><br>

## 🔨 Tools

- **GameManager:**
The GameManager shows the basic settings for the game

| Variable                 | Utility                                                    |
| ------------------------ | ---------------------------------------------------------- |
| Stage Customization      | Reference to the Stage of the mannequin                    |
| Stage Runway             | Reference to the Stage of the Runway                       |
| Stage Winner             | Reference to the Stage of the Winner                       |
| Time To Start            | Sets the time to start the game when all players are ready |
| Vote Timer Limit         | Sets the time limit of the vote state                      |
| Customization Time Limit | Sets the time limit of the customization state             |

<br><img src = "docs/images/gamemanager.png" alt = "gamemanager img"></img><br><br>

- **UIManager:**
The ui manager has a list that contains all the panels of the different states of the game.

<br><img src = "docs/images/uimanager.png" alt = "uimanager img"></img><br><br>

- **Multiplayer Manager:**
This class is included into the multiplay component of the <a href="https://github.com/JasperGame/zepeto-modules"> Module importer</a> you can learn more about multiplayer <a href="https://docs.zepeto.me/studio/reference/multiplay">here</a>.


<br><img src = "docs/images/multiplayermanager.png" alt = "module importer img"></img><br>
<br><img src = "docs/images/moduleimporter.png" alt = "module importer img" width="500"></img><br><br>



- **Player Spawner:**
This class only has the reference of where the player should be in certain moment of the game.
In this case it has a reference of where the player will be in the mannequin state.
<br><img src = "docs/images/playerspawner.png" alt = "module importer img"></img><br><br>

- **Clothing Manager:**
This class has the list of items for each part of the body that will be created on the game.
To create one you will need the itemId of the item that you want to create in the game and write that id on the correct list by the part of the body.
<br><img src = "docs/images/clothingmanager.png" alt = "module importer img"></img><br><br>

- **UI Prefabs:**
You can edit every panel of each part of the game from their own prefab.
You can found them in the project folder.
<br><img src = "docs/images/uiprefabs.png" alt = "module importer img"></img><br><br>

- **Themes Names:**
You can edit the list of names and the number of random Themes.
(Remember to change the number of themes in the "SyncPlayerDataModule")
<br><img src = "docs/images/themeConfig.png" alt = "module importer img"></img><br>
<br><img src = "docs/images/themeConfigCode.png" alt = "module importer img"></img><br>
