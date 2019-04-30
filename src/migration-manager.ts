import {
    ContainerType,
    ICurrentVersionContainer,
    IMigrationManagerContainer
} from "./declaration";
import {inject, injectable, multiInject} from "inversify";
import * as compareVersions from "compare-versions";
import {MigrationContainerBase} from "./migration-container-base";

@injectable()
export class MigrationManagerContainer implements IMigrationManagerContainer {

    @inject(ContainerType.CurrentVersion)
    private currentVersionContainer: ICurrentVersionContainer;

    @multiInject(ContainerType.Migration)
    private migrations: MigrationContainerBase[];

    public async getMigrations(currentVersion: string  | undefined, down = false): Promise<MigrationContainerBase[]> {
        if (!currentVersion) {
            currentVersion = await this.currentVersionContainer.getVersion();
        }
        if (!down) {
            return this.migrations
                .sort((a, b) => compareVersions(a["version"], b["version"]))
                .filter((m) => compareVersions(m["version"], <string>currentVersion) === 1);
        } else {
            return this.migrations
                .sort((a, b) => compareVersions(a["version"], b["version"]))
                .reverse()
                .filter((m) => compareVersions(m["version"], <string>currentVersion) === -1);
        }
    }

    public async getCurrentVersion(): Promise<string> {
        return this.currentVersionContainer.getVersion();
    }

    public async run(currentVersion: string  | undefined, down = false) {
        const migrations = await this.getMigrations(currentVersion, down);
        for (const migration of migrations) {
            if (down) {
                await migration.down();
            } else {
                await migration.up();
            }
            await this.currentVersionContainer.setVersion(migration.getVersion());
        }
    }
}
