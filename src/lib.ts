import {injectable, decorate} from "inversify";
import {IGroupMetadata, TGroupsMetadata} from "./declaration";
import {METADATA_KEY} from "./constant";

export function getMigrationsMetadata(): TGroupsMetadata {
    return Reflect.getMetadata(
        METADATA_KEY.migration,
        Reflect
    );
}

export function migration(name = "default") {
    return function (target: any) {
        let currentMetadata: IGroupMetadata = {
            name,
            target
        };
        decorate(injectable(), target);
        Reflect.defineMetadata(METADATA_KEY.migration, currentMetadata, target);

        // We need to create an array that contains the metadata of all
        // the migrations in the application, the metadata cannot be
        // attached to a migration. It needs to be attached to a global
        // We attach metadata to the Reflect object itself to avoid
        // declaring additonal globals. Also, the Reflect is avaiable
        // in both node and web browsers.
        const previousMetadata: TGroupsMetadata = Reflect.getMetadata(
            METADATA_KEY.migration,
            Reflect
        ) || [];

        const newMetadata = [currentMetadata, ...previousMetadata];

        Reflect.defineMetadata(
            METADATA_KEY.migration,
            newMetadata,
            Reflect
        );
    };
}

export function cleanUpMetadata() {
    Reflect.defineMetadata(
        METADATA_KEY.migration,
        [],
        Reflect
    );
}
