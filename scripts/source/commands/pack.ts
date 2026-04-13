import type { CreateArgs } from "./create/main";
import {Command} from "commander";
import { GetTargetDirectory, GetPackFolder, PackType, AssertArgs } from "../index";
import * as path from "node:path";
import * as filesystem from "node:fs";
import { exit } from "node:process";
import {zip} from "zip-a-folder"

type PackArgs = {
    name : string,
    here : boolean,
    preview : boolean
}

export const PACK_COMMAND = new Command()
.name("pack")
.description("Packs up your existing pack to be downloaded and imported by other players")
.requiredOption("--name, -n <NAME>","The name of your pack(s)")
.option("--here, -h [VALUE]","Look for files in the current directory",false)
.option("--preview, -p","Look for files in the Minecraft Preview directory",false)
.action(async (args : PackArgs)=>{
    AssertArgs(args.here && args.preview,"Either --preview or --here must be false");
    const directory = GetTargetDirectory(args as CreateArgs);
    const bpFolder = GetPackFolder(directory,PackType.BP,args as CreateArgs);
    const rpFolder = GetPackFolder(directory,PackType.RP,args as CreateArgs);

    const newDirectory = path.join(process.cwd(),args.name);
    const hasBp = filesystem.existsSync(bpFolder);
    const hasRp = filesystem.existsSync(rpFolder);

    if (!(hasBp || hasRp)) {
        console.error("Couldn't find neither a BP or a RP")
        exit(1);
    }
    if (filesystem.existsSync(newDirectory)) {
        console.error("Folder with addon name already exists!");
        exit(1);
    }
    if (hasBp) { 
        const newBpDirectory = path.join(newDirectory,"BP");
        filesystem.cpSync(bpFolder,newBpDirectory,{recursive:true});
        
        // Optimize the BP by removing un-needed files
        const targetFiles = filesystem.globSync([path.join(newBpDirectory,"package.json"),path.join(newBpDirectory,"**","tsconfig.json"),path.join(newBpDirectory,"scripts","source"),path.join(newBpDirectory,"**","*.ts")])
        targetFiles.forEach(filePath=>{
            if (filesystem.existsSync(filePath)) filesystem.rmSync(filePath,{recursive:true})
        });
    }
    if (hasRp) filesystem.cpSync(rpFolder,path.join(newDirectory,"RP"),{recursive:true});

    await zip(newDirectory,newDirectory+".mcaddon");
    filesystem.rmSync(newDirectory,{recursive:true});
});

