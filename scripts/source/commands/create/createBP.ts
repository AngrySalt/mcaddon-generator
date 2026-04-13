import { randomUUID, type UUID } from "node:crypto";
import type { CreateArgs } from "./main";
import * as path from "node:path"
import { addonFilesFolder, ApplySharedManifestInfo, SavePackFiles } from "./createPack";
import { GetPackFolder, PackType } from "../..";

const BASE_BP_FOLDER = path.join(addonFilesFolder,"BP")

export function CreateBP(bpUUID : UUID,rpUUID : UUID,args : CreateArgs,destinationDirectory : string) : string {
    const base_manifest = require(path.join(BASE_BP_FOLDER,"manifest.json"))
    let manifest = ApplySharedManifestInfo(base_manifest,args,bpUUID,(args.rp && rpUUID) || undefined)

    if (args.script) {
        manifest.modules.push({
            type: "script",
            language: "javascript",
            entry: "scripts/output/main.js",
            description: "Allows you to add scripts that can interact with your minecraft world through APIs",
            uuid: randomUUID(),
            version: "1.0.0"
        });

        manifest.dependencies = manifest.dependencies ?? [];
        manifest.dependencies.push(
            {
                module_name: "@minecraft/server",
                version: args.script_version
            }
        )
    }

    const filePath : string = GetPackFolder(destinationDirectory,PackType.BP,args);
    SavePackFiles(manifest,BASE_BP_FOLDER,filePath,
        args.script==false?
        ((source)=>!(source.endsWith("scripts") || source.endsWith("package.json") || source.endsWith("tsconfig.json")))
        :undefined);

    return filePath
}
