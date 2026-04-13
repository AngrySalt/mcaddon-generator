import {Command} from "commander";
import { exit, stdin, stdout } from "node:process";
import { randomUUID } from "node:crypto";
import { CreateBP } from "./createBP";
import { CreateRP } from "./createRP";
import * as path from "node:path";
import * as filesystem from "node:fs";
import * as readline from "node:readline";
import { AssertArgs, GetTargetDirectory } from "../..";


export type CreateArgs = {
    bp : boolean,
    rp : boolean,
    here : boolean,
    preview : boolean,
    script : boolean,
    engine_version : string,
    script_version : string,
    format_version : number,
    beta : boolean,
    name : string,
    description : string,
    author : string,
    vscode : boolean
}

let rl : readline.Interface;


function AskQuestion(question : string,defaultAnswer : string) : Promise<string> {
    question += `? (${defaultAnswer}): `;
    return new Promise<string>((r)=>{
        rl.question(question,(answer)=>r(answer.length>0?answer:defaultAnswer));
    })
}

async function ExecuteCreateCommand(args : CreateArgs) {
    if (args.beta) args.script_version = "beta";
    AssertArgs(args.preview && args.here,"--preview or --here must be false");
    AssertArgs(!(args.bp === true || args.rp === true),"Must either output a BP file, a RP file, or both. Cannot do neither");

    rl = readline.createInterface({input: stdin,output:stdout});

    if (!args.name) args.name = await AskQuestion("name","PACK_NAME");
    if (!args.description) args.description = await AskQuestion("description","pack.description");
    if (!args.author) args.author = await AskQuestion("author","");

    rl.close();

    let bpUUID = randomUUID();
    let rpUUID = randomUUID();
    
    const destinationDirectory : string = GetTargetDirectory(args)
    if (!filesystem.existsSync(destinationDirectory)) {
        console.error(`${destinationDirectory} doesn't exist!`)
        exit(1);
    }

    const workspaceData = {
        folders: [

        ] as {path : string}[],
        settings: {}
    }

    if (args.bp) workspaceData.folders.push({path: CreateBP(bpUUID,rpUUID,args,destinationDirectory)});
    if (args.rp) workspaceData.folders.push({path:  CreateRP(rpUUID,bpUUID,args,destinationDirectory)});

    if (!args.vscode) return;
    filesystem.writeFileSync(path.join(process.cwd(),`${args.name}.code-workspace`),JSON.stringify(workspaceData,undefined,4));

}

export const CreateCommand = new Command("create")
    .description("Used to create both BPs and RPs for MCBE")
    .option("--name, -n <NAME>","Set the name used for both packs")
    .option("--description, -d <DESCRIPTION>","Set the description used for both packs")
    .option("--author, -a <AUTHOR>","Specify the author of the project")
    .option("--bp [VALUE]","Whether or not to create a behavior pack",true)
    .option("--no-bp")
    .option("--rp [VALUE]","Whether or not to create a resource pack",true)
    .option("--no-rp")
    .option("--here, -h","Output the packs into the current directory. By default the pack files will go into your minecraft development folders",false)
    .option("--preview, -p","Will output your packs into the preview version of the game",false)
    .option("--script [VALUE]","Whether or not to use the script api",true)
    .option("--no-script")
    .option("--script_version <VERSION>","What version to use for the @minecraft/server api","2.6.0")
    .option("--beta, -b","Shorthand for --script_version beta",false)
    .option("--engine_version, -v <VERSION>","The minimum engine version","1.26.0")
    .option("--format_version <VERSION>","The format_version of the manifest",parseInt,3)
    .option("--vscode [VALUE]","Whether or not to output a vscode workspace file in the current directory",true)
    .option("--no-vscode")
    .action(ExecuteCreateCommand);



