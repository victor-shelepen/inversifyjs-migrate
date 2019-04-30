import {expect} from 'chai';
import {Container} from 'inversify';
import {CurrentVersionContainer} from './helper';
import {
    ContainerType,
    ICurrentVersionContainer,
    IMigrationManagerContainer
} from '../src/declaration';
import {MigrationManagerContainer} from '../src/migration-manager';
import {cleanUpMetadata, migration, registerMigrations} from '../src/lib';
import {MigrationContainerBase} from '../src/migration-container-base';


describe('Migration manager container', () => {
    let container: Container;
    let migrationManagerContainer: IMigrationManagerContainer;

    before(() => {
        cleanUpMetadata();
        const project = {
            state: 'State->0.0.0'
        };

        @migration('0.0.7')
        class _0_0_7_Migration extends MigrationContainerBase {
            up() {
                project.state = 'State->0.0.7'
            }

            down() {
                project.state = 'State->0.0.6'
            }
        }

        @migration('0.0.8')
        class _0_0_8_Migration extends MigrationContainerBase {
            up() {
                project.state = 'State->0.0.8'
            }

            down() {
                project.state = 'State->0.0.7'
            }
        }

        @migration('0.0.6')
        class _0_0_6_Migration extends MigrationContainerBase {
            up() {
                project.state = 'State->0.0.6'
            }

            down() {
                project.state = 'State->0.0.5'
            }
        }

        @migration('0.0.5')
        class _0_0_5_Migration extends MigrationContainerBase {
            up() {
                project.state = 'State->0.0.5'
            }

            down() {
                project.state = 'State->0.0.4'
            }
        }

        container = new Container();
        container.bind<ICurrentVersionContainer>(ContainerType.CurrentVersion).to(CurrentVersionContainer).inSingletonScope();
        container.bind<IMigrationManagerContainer>(ContainerType.MigrationManager).to(MigrationManagerContainer).inSingletonScope();
        registerMigrations(container);
        migrationManagerContainer = container.get<IMigrationManagerContainer>(ContainerType.MigrationManager);
    });

    it('Get version', async () => {
        const version = await migrationManagerContainer.getCurrentVersion();
        expect(version).equal('0.0.6');
    });

    it('Get above migrations', async () => {
        const migrations = await migrationManagerContainer.getMigrations();
        expect(migrations.length).equal(2);
        expect(migrations[0].version).equal('0.0.7');
        expect(migrations[1].version).equal('0.0.8');
    });
    it('Get under migrations', async () => {
        const migrations = await migrationManagerContainer.getMigrations(undefined, true);
        expect(migrations.length).equal(1);
        expect(migrations[0].version).equal('0.0.5');
    });
});