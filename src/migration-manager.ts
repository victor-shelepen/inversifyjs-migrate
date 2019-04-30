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
    private migrations: (typeof  MigrationContainerBase)[];

    public async getMigrations(currentVersion: string  | undefined, down: boolean = false) {
        if (!currentVersion) {
            currentVersion = await this.currentVersionContainer.getVersion();
        }
        if (!down) {
            return this.migrations
                .sort((a, b) => compareVersions(a.version, b.version))
                .filter((m) => compareVersions(m.version, <string>currentVersion) === 1);
        }
        else {
            return this.migrations
                .sort((a, b) => compareVersions(a.version, b.version))
                .reverse()
                .filter((m) => compareVersions(m.version, <string>currentVersion) === -1);
        }
    }

    public async getCurrentVersion(): Promise<string> {
        return this.currentVersionContainer.getVersion();
    }

    public run() {
        // @todo later.
    }
}
