## What is mcaddon-generator?
Mcaddon generator is a CLI tool dedicated to making Minecraft Bedrock addons easier to create. It handles both creating packs, and packaging them efficiently into .mcaddon files
### Installation
To install this package, you may type the following line in the terminal. Assuming you have [Node.js](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) installed of course.
```
npm install mcaddon-generator
```
## How to create packs
Once you have this package installed, open file explorer and use SHIFT+ Right Click to open the terminal in the directory you want your vscode workspace file to be in. Afterwards, you can create your pack by inputting
```
mcaddon create
```
Assuming you've correctly installed the package, the terminal should ask for your packs name, description, and the author. You can skip these prompts by instead entering
```
mcaddon create --name "Example Pack" --description "PACK DESCRIPTION" --author "PACK AUTHOR"
// or
mcaddon create -n "Example Pack" -d "PACK DESCRIPTION" -a "PACK AUTHOR"
```
Once you've entered all of the required information, your packs files will automatically be generated in your ``development_behavior_packs`` and ``development_resource_packs`` folders respectively. And a new project workspace file for vscode will be generated in the current directory.
You can disable the vscode output by using the ``--no-vscode`` flag. 
And change the output directory to the current one by using the ``--here`` flag.

For more information on all of the flags associated with this command, use ``mcaddon help create	``
## How to package your addon (Generate .mcaddon file)
Just like before, you'll want to open your desired output directory in the terminal. After which, you may type the following line in the terminal 
```
mcaddon pack --name "Example Pack"
// or
mcaddon pack -n "Example Pack"
```
Keep in mind that this package assumes that the target files were created with the same naming scheme as ``mcaddon create`` uses. This means that when detecting your BP and RP files, it will look for files named ``ExamplePackBP`` and ``ExamplePackRP`` in the target directory. 

If you used the ``--preview`` or ``--here`` flags when creating your addon, 
you should do the same when packaging it.