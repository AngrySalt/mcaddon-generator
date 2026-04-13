import * as path from "node:path";
import { addonFilesFolder, ApplySharedManifestInfo, SavePackFiles } from "./createPack";
import { type UUID } from "node:crypto";
import type { CreateArgs } from "./main";
import { GetPackFolder, PackType } from "../..";

const BASE_RP_FOLDER = path.join(addonFilesFolder,"RP");

export function CreateRP(rpUUID : UUID,bpUUID : UUID,args : CreateArgs,destinationDirectory : string) : string {
    const base_manifest = require(path.join(BASE_RP_FOLDER,"manifest.json"));
    const manifest = ApplySharedManifestInfo(base_manifest,args,rpUUID,bpUUID);

    const filePath : string = GetPackFolder(destinationDirectory,PackType.RP,args);
    SavePackFiles(manifest,BASE_RP_FOLDER,filePath);
    return filePath;
}