#! /usr/bin/env node
import {Command} from "commander";
import { CreateArgs, CreateCommand } from "./commands/create/main";
import { exit } from "node:process";
import * as path from "node:path";
import * as os from "node:os";
import { PACK_COMMAND } from "./commands/pack";

const program = new Command("mcaddon")
.description("Enables more efficient creation in MCBE addons")
.version("1.0.0")
.helpCommand(true)
.action(()=>{
    program.help();
});

export function GetTargetDirectory({here,preview} : CreateArgs) {
    const userDirectory = os.homedir();
    const currentDirectory = process.cwd();
    const minecraftDirectory = path.join(userDirectory,"AppData","Roaming","Minecraft Bedrock","Users","Shared","games","com.mojang");
    const previewDirectory = path.join(userDirectory,"AppData","Roaming","Minecraft Bedrock Preview","Users","Shared","games","com.mojang");
    return here?currentDirectory:preview?previewDirectory:minecraftDirectory;
}

export enum PackType {
    BP = "BP",
    RP = "RP"
}
export function GetPackFolder(directory : string,packType : PackType,{name,here} : CreateArgs) {
    const nameNoSpaces = name.replace(" ","") + packType;
    return here?path.join(directory,nameNoSpaces):path.join(directory,packType==PackType.BP?"development_behavior_packs":"development_resource_packs",nameNoSpaces)
}

export function AssertArgs(condition: boolean, errorMsg: string) {
    if (condition) {
        console.error(errorMsg);
        exit(9);
    }
}

program.addCommand(PACK_COMMAND);
program.addCommand(CreateCommand);
program.parse();


