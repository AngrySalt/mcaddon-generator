import { type UUID, randomUUID } from "node:crypto";
import * as path from "node:path";
import type { CreateArgs } from "./main";
import * as filesystem from "node:fs";


function FormatVersionNumber(args: CreateArgs, version: string): string | number[] {
    return args.format_version == 3 ? version : version.split(".").map(parseFloat);
}
type manifest = { header: { name: string; description: string; uuid: string; min_engine_version: any; }; modules: any[]; dependencies?: any[]; metadata: { authors: string[]; }; };


export function ApplySharedManifestInfo<T extends manifest>(manifest: T, args: CreateArgs, uuid: UUID, dependentId?: UUID): T & manifest {
    manifest.header.name = args.name;
    manifest.header.description = args.description;
    manifest.header.uuid = uuid;
    manifest.header.min_engine_version = FormatVersionNumber(args, args.engine_version);
    manifest.modules[0].uuid = randomUUID();

    if (dependentId) {
        manifest.dependencies = [{
            uuid: dependentId,
            version: "1.0.0"
        }];
    }
    manifest.metadata.authors.push(args.author);

    return manifest;
}


export const addonFilesFolder = path.join(__dirname, "..", "..", "..", "..", "addon_files");

export function SavePackFiles(manifest: object, sourceDirectory: string, directory: string,filter? : (source : string,destination : string) => boolean) {
    filesystem.cpSync(sourceDirectory, directory, { recursive: true, filter });
    filesystem.writeFile(path.join(directory, "manifest.json"), JSON.stringify(manifest, undefined, 4), (e) => {
        if (e) console.error(`Error when writing BP manifest file: ${e}`);
    });
}

