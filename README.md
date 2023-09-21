
# Find a pair game

## 📢 About

Nice to meet you Creators! 👋 Welcome to Runner template guide!

With Runner you can create amazing worlds to play with your friends!

Now, are you ready to start?

  

## ❓ How to create with Runner template

:wrench: Installation and settings

- Download Unity Hub and Unity 2020.3.9f1 version. ([Download](https://unity.com/releases/editor/archive))

- Pull the repository.

  

> 💡 Enjoy and start creating with the Template! :tada:

  

## 🔨 Tools

**GameManager**
The GameManager shows the basic settings for the game

| Variable                 | Utility                                                    |
| ------------------------ | ---------------------------------------------------------- |
| Stage Customization      | Reference to the Stage of the mannequin                    |
| Stage Runway             | Reference to the Stage of the Runway                       |
| Stage Winner             | Reference to the Stage of the Winner                       |
| Time To Start            | Sets the time to start the game when all players are ready |
| Vote Timer Limit         | Sets the time limit of the vote state                      |
| Customization Time Limit | Sets the time limit of the customization state             |

<br><img src = "docs/images/gamemanager.png" alt = "gamemanager img"></img><br>

**UIManager**
The ui manager has a list that contains all the panels of the different states of the game.

<br><img src = "docs/images/uimanager.png" alt = "uimanager img"></img><br>

**Mutliplayer Manager**
This class is included into the multiplay component of the <a href="https://github.com/JasperGame/zepeto-modules"> Module importer</a> you can learn more about multiplayer <a href="https://docs.zepeto.me/studio/reference/multiplay">here</a>.


<br><img src = "docs/images/multiplayermanager.png" alt = "module importer img"></img><br>
<br><img src = "docs/images/moduleimporter.png" alt = "module importer img" width="500"></img><br>



**Player Spawner**
This class only has the reference of where the player should be in certain moment of the game.
In this case it has a reference of where the player will be in the mannequin state.
<br><img src = "docs/images/playerspawner.png" alt = "module importer img"></img><br>

**Clothing Manager**
This class has the list of items for each part of the body that will be created on the game.
To create one you will need the itemId of the item that you want to create in the game and write that id on the correct list by the part of the body.
<br><img src = "docs/images/clothingmanager.png" alt = "module importer img"></img><br>

**UI Prefabs**
You can edit every panel of each part of the game from their own prefab.
You can found them in the project folder.
<br><img src = "docs/images/uiprefabs.png" alt = "module importer img"></img><br>

