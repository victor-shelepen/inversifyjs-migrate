import {
    ContainerType,
    ICurrentVersionContainer,
    IMigrationManagerContainer
} from './declaration';
import {inject, injectable, multiInject} from 'inversify';
import * as compareVersions from 'compare-versions';
import {MigrationContainerBase} from './migration-container-base';

@injectable()
export class MigrationManagerContainer implements IMigrationManagerContainer {

    @inject(ContainerType.CurrentVersion)
    private currentVersionContainer: ICurrentVersionContainer;

    @multiInject(ContainerType.Migration)
    private migrations: MigrationContainerBase[];

    public async getMigrations() {
        const currentVersion = await this.currentVersionContainer.getVersion();
        return this.migrations
            .sort((a, b) => compareVersions(a['version'], b['version']))
            .filter((m) => compareVersions(m['version'], currentVersion));
    }

    public async getCurrentVersion(): Promise<string> {
        return this.currentVersionContainer.getVersion();
    }

    public run() {

    }
}
